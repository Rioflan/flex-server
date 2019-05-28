/* eslint-disable */

import {
	append,
	filter
} from "ramda";

import { Request, Response, Error, Router } from "express";
import User from "../models/user";
import Place from "../models/place";
import * as model from "../models/model"
import VerifyToken from "./VerifyToken";
import { encrypt, decrypt } from "./test";
import moment from "moment"

const HTTPS_REGEX = "^https?://(.*)";

const errorMessages = {
	userCreation: "Error creating the user",
	userFind: "Error finding the user",
	userUpdate: "Error updating the user",
	userIdMatch: "User's ID not matching user's info",
	placeCreation: "Error creating the place",
	placeFind: "Error finding the place",
	placeUpdate: "Error updating the place",
	placeAlreadyUsed: "Place already used by : ",
	invalidArguments: "Invalid arguments"
}

const successMessages = {
	takePlace: "Place successfully assigned to user",
	leavePlace: "User successfully left the place"
}

const resultCodes = {
	success: 200,
	syntaxError: 400,
	serverError: 500
}

interface Request {
	userId?: string | Buffer | DataView;
	body: any;
}

let RES;

const post = (router: Router) => {

	/**
	 * This route is used to handle users login.
	 */
	router
		.route("/login_user")

		.post(VerifyToken, async (req: Request, res: Response) => {
			const body = req.body;
			if (
				body.name === null ||
				body.fname === null ||
				body.id_user === null ||
				body.id_user.match(process.env.LOGIN_REGEX) === null
			)
				return res.status(resultCodes.syntaxError).json(errorMessages.invalidArguments);
			body.id_user = encrypt(body.id_user, req.userId);
			body.name = encrypt(body.name, req.userId);
			body.fname = encrypt(body.fname, req.userId);

			if (await model.userExists(body.id_user)) {
				const user = await model.getUserById(body.id_user);
				if (model.matchUserInfo(user, body)) res.status(resultCodes.success).send(user);
				else res.status(resultCodes.serverError).send(errorMessages.userIdMatch);
			}

			else {
				await model.addUser(body.id_user, body.name, body.fname);
				const user = await model.getUserById(body.id_user);
				res.status(resultCodes.success).json(user);
			}
		});

	/**
	 * This route is used to assign a place to a user.
	 */
	router
		.route("/take_place")

		.post(VerifyToken, async (req: Request, res: Response) => {
			const body = req.body;
			if (!body.id_place || !body.id_user) {
				return res.status(resultCodes.syntaxError).send(errorMessages.invalidArguments);
			}

			const id_place = body.id_place;
			const id_user = encrypt(body.id_user, req.userId);
			const place = await model.getPlaceById(id_place);

            const placeIsAllowed = place => place.start_date && place.end_date && moment().isBetween(place.start_date, place.end_date)
			const placeIsAvailable = place => !place.using && (!place.semi_flex || placeIsAllowed(place))

			if (place && !placeIsAvailable(place)) {
				console.log("Place already used");
				const user = await model.getUserById(place.id_user);
				const name = decrypt(user.name, req.userId);
				const fname = decrypt(user.fname, req.userId);
				res.status(resultCodes.serverError).json({
					name: name,
					fname: fname
				});
				return
			}
			const historical = await model.getUserById(id_user).then(user => user.historical);
			const beginDate = new Date(Date.now()).toLocaleString();
			if (!place) {
				console.log("Place doesn't exist");
				model.addPlace(id_place, true, id_user);
			}
			else {
				console.log("Place exists and is free");
				model.updatePlace(id_place, { using: true, id_user: id_user });
			}
			model.updateUser(id_user, {
				id_place: id_place,
				historical: [...historical, { id_place: id_place, begin: beginDate, end: "" }]
			});
			res.status(resultCodes.success).send(successMessages.takePlace);
		});

	router
		.route("/leave_place")

		.post(VerifyToken, async (req: Request, res: Response) => {
			const body = req.body;
			if (!body.id_place || !body.id_user) {
				return res.status(resultCodes.syntaxError).send(errorMessages.invalidArguments);
			}
			const id_user = encrypt(body.id_user, req.userId);
			const historical = await model.getUserById(id_user).then(user => user.historical);
			const endDate = new Date(Date.now()).toLocaleString();
			historical[historical.length - 1].end = endDate; // set the end date of the last place in array

			model.updateUser(id_user, { historical: historical, id_place: "" });
			model.updatePlace(body.id_place, { using: false, id_user: "" });

			res.status(resultCodes.success).send(successMessages.leavePlace);
		});

	/**
	 * This route is used to add a friend.
	 */
	router
		.route("/add_friend")

		.post(VerifyToken, (req: Request, res: Response) => {
			const body = req.body;
			RES = res;
			const id_user = encrypt(body.id_user, req.userId);

			User.findOne(
				{ id: id_user },
				null,
				{ sort: { _id: -1 } },
				(err: Error, user) => {
					if (err) RES.status(resultCodes.syntaxError).send(errorMessages.userFind);
					else if (user) {
						user.friend = append(
							{
								id: body.id,
								name: encrypt(body.name, req.userId),
								fname: encrypt(body.fname, req.userId),
								id_place: body.id_place,
								photo: body.photo
							},
							user.friend
						);
						user.save((err: Error) => {
							if (err) RES.status(resultCodes.serverError).send(errorMessages.userUpdate);
							RES.status(resultCodes.success).send({ user });
						});
					}
				}
			);
		});

	/**
	 * This route is used to remove a friend.
	 */
	router
		.route("/remove_friend")

		.post(VerifyToken, (req: Request, res: Response) => {
			const body = req.body;
			RES = res;
			const id_user = encrypt(body.id_user, req.userId);

			User.findOne(
				{ id: id_user },
				null,
				{ sort: { _id: -1 } },
				(err: Error, user) => {
					if (err) RES.status(resultCodes.syntaxError).send(errorMessages.userFind);
					else if (user) {
						const isRemovedUser = userFriend => userFriend.id !== body.id;
						user.friend = filter(isRemovedUser, user.friend);
						user.save((err: Error) => {
							if (err) RES.status(resultCodes.serverError).send(errorMessages.userUpdate);
							RES.status(resultCodes.success).send({ user });
						});
					}
				}
			);
		});

	router
		.route("/settings_user")

		.post(VerifyToken, (req: Request, res: Response) => {
			const body = req.body;
			const id_user = encrypt(body.id_user, req.userId);

			if (
				body.photo &&
				body.photo.match(HTTPS_REGEX) === null &&
				(body.photo !== "" || body.photo !== null)
			) model.updatePhoto(id_user, body.photo);

			if (body.remoteDay !== "") model.updateUser(id_user, { remoteDay: body.remoteDay });
			if (body.startDate && body.endDate) {
				model.updateAvailabilityPeriod(id_user, moment(body.startDate, "DD/MM/YYYY").toDate(), moment(body.endDate, "DD/MM/YYYY").toDate())
			}
			res.status(resultCodes.success).send({success: "success"});
		});
};

export default post;

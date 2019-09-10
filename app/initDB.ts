import mongoose = require("mongoose")
import dbconfig from './database/mongoDB';
import Places from "./models/place";
import apiUser, {ApiSchema} from './models/apikey';
import credentials from "./credentials.json";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


/**
 * API TOKEN
 */

const usermail = process.env.USERMAIL || credentials.usermail;
const username = process.env.USERNAME || credentials.username;
const password = process.env.PASSWORD || credentials.password;
const hashedPassword = bcrypt.hashSync(password, 8);
process.stdout.write("IMPORTING....\n");
/**
 * PLACES
 */

const floor3 = {
    "number": 3,
    "V": {
        "RER": 26,
        "MILIEU": 17,
        "BOIS": 22
    },
    "B": {
        "RER": 34,
        "MILIEU": 0,
        "BOIS": 43
    },
    "R": {
        "RER": 36,
        "MILIEU": 13,
        "BOIS": 56
    }
};

const floor4 = {
    "number": 4,
    "V": {
        "RER": 23,
        "MILIEU": 13,
        "BOIS": 23
    },
    "B": {
        "RER": 40,
        "MILIEU": 0,
        "BOIS": 35
    },
    "R": {
        "RER": 44,
        "MILIEU": 0,
        "BOIS": 59
    }
};

const floorX = {
    "number": 0,
    "V": {
        "SEINE": 23,
        "COUR": 13
    },
    "B": {
        "SEINE": 23,
        "COUR": 13
    },
    "R": {
        "SEINE": 23,
        "COUR": 13
    }
};

const floors = [floor3, floor4];
const floorsX = [floorX];
const zones = ["V", "B", "R"];
const sides = ["RER", "MILIEU", "BOIS"];
const sides2 = ["SEINE", "COUR"];
const nbFloors = floors.length;
const nbZones = zones.length;
const nbSides = sides.length;


(async () => {
    try{
        mongoose.connect(dbconfig.getMongoUri(), { useNewUrlParser: true });
        mongoose.set('useFindAndModify', false);
        // RAJOUT DU USER API
        
        process.stdout.write("ADDING API USER\n");
        await apiUser.create(
            {
                name: username,
                email: usermail,
                api_key: hashedPassword,
                creation: Date.now(),
            },
            (err: Error, user) => {
                if (err) return process.stdout.write("ERROR ? "+err+"\n");
            },
        );
        await apiUser.findOne({email: usermail}, (err: Error, user: ApiSchema) => {
            if (err) return process.stdout.write('Error on the server.\n');
            if (!user) return process.stdout.write('No user found.\n');

            const token = jwt.sign({id: user._id}, process.env.API_SECRET);

            process.stdout.write("API USER INSERTED :" +username+", "+usermail+"\n");
            process.stdout.write("API TOKEN (keep it for API Authentication):" +token+"\n");
        });    
    
    // LA RAPEE
        let totalX = 0;
            for (let indexFloor = 0; indexFloor < floorsX.length; indexFloor++) {
                for (let indexZone = 0; indexZone < nbZones; indexZone++) {
                    for (let indexSide = 0; indexSide < sides2.length; indexSide++) {
                        let number = floorsX[indexFloor].number;
                        let zone = zones[indexZone];
                        let side = sides2[indexSide];
                        let nbPlaces = floorsX[indexFloor][zone][side];
                        for (let numPlace = 1; numPlace <= nbPlaces; numPlace++) {
                            let id = `RA-${number}-${zone}-${side}${("0" + numPlace).slice(-2)}`;
                            process.stdout.write("\r                              \r"); // clear current line
                            process.stdout.write("Inserting " + id + "\n");
                            await Places.findOneAndUpdate({id: id}, {}, {upsert: true, setDefaultsOnInsert: true});
                            totalX++;
                        }
                    }
                }
            }
        
        
        let total = 0;
        for (let indexFloor = 0; indexFloor < nbFloors; indexFloor++) {
            for (let indexZone = 0; indexZone < nbZones; indexZone++) {
                for (let indexSide = 0; indexSide < nbSides; indexSide++) {
                    let number = floors[indexFloor].number;
                    let zone = zones[indexZone];
                    let side = sides[indexSide];
                    let nbPlaces = floors[indexFloor][zone][side];
                    for (let numPlace = 1; numPlace <= nbPlaces; numPlace++) {
                        let id = `JO-${number}-${zone}-${side}${("0" + numPlace).slice(-2)}`;
                        process.stdout.write("\r                              \r"); // clear current line
                        process.stdout.write("Inserting " + id + "\n");
                        await Places.findOneAndUpdate({id: id}, {}, {upsert: true, setDefaultsOnInsert: true});
                        total++;
                    }
                }
            }
        }
        console.log("\nTotal LA RAPEE :", totalX, "inserted");
        console.log("\nTotal JOINVILLE :", total, "inserted");

        console.log("\nTotal GLOBAL :", total+totalX, "inserted");
        await mongoose.disconnect();
        console.log("FINISHED !");
    }
    catch(err){
        console.log("ERROR : "+err);

    }  
})();

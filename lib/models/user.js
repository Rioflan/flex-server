"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var Schema = mongoose_1.default.Schema;
var UserSchema = new Schema({
    id: String,
    name: String,
    fname: String,
    email: String,
    id_place: { type: String, default: "" },
    historical: Array,
    remoteDay: { type: Array, default: [] },
    photo: { type: String, default: "" },
    friend: Array,
    pool: { type: Boolean, default: false },
    start_date: { type: Date, default: new Date(+new Date() - 24 * 60 * 60 * 1000) },
    end_date: { type: Date, default: new Date(+new Date() - 24 * 60 * 60 * 1000) },
    confirmation_code: { type: String, default: "" },
    confirmation_token: { type: String, default: "" },
});
var Model = mongoose_1.default.model("User", UserSchema);
exports.default = Model;

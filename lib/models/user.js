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
    id_place: { type: String, default: "" },
    historical: Array,
    remoteDay: { type: String, default: "" },
    photo: { type: String, default: "" },
    friend: Array,
    pool: { type: Boolean, default: false }
});
var Model = mongoose_1.default.model("User", UserSchema);
exports.default = Model;

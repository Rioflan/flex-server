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
    id_place: String,
    historical: Array,
    remoteDay: String
});
var Model = mongoose_1.default.model("User", UserSchema);
exports.default = Model;

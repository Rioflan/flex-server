"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var Schema = mongoose_1.default.Schema;
var PlaceSchema = new Schema({
    id: String,
    using: Boolean,
    id_user: String,
});
var Model = mongoose_1.default.model('Place', PlaceSchema);
exports.default = Model;

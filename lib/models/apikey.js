"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var Schema = mongoose_1.default.Schema;
var ApiSchema = new Schema({
    name: String,
    email: String,
    api_key: String,
    creation: Date,
});
var Model = mongoose_1.default.model('Api', ApiSchema);
exports.default = Model;

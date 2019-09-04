"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = __importStar(require("mongoose"));
exports.PlaceSchema = new mongoose.Schema({
    id: String,
    using: { type: Boolean, default: false },
    semi_flex: { type: Boolean, default: false },
    id_user: { type: String, default: "" },
    id_owner: { type: String, default: "" },
});
var Model = mongoose.model('Place', exports.PlaceSchema);
exports.default = Model;

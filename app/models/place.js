"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
var Schema = mongoose_1["default"].Schema;
var PlaceSchema = new Schema({
    id: String,
    using: { type: Boolean, "default": false },
    semi_flex: { type: Boolean, "default": false },
    id_user: { type: String, "default": "" },
    id_owner: { type: String, "default": "" }
});
var Model = mongoose_1["default"].model('Place', PlaceSchema);
exports["default"] = Model;

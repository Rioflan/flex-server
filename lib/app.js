"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express")); //  call express
var body_parser_1 = __importDefault(require("body-parser"));
var post_1 = __importDefault(require("./routes/post"));
var get_1 = __importDefault(require("./routes/get"));
var auth_1 = __importDefault(require("./routes/auth"));
var express_sslify_1 = __importDefault(require("express-sslify"));
var app = express_1.default(); // use express on our app
if (process.env.NODE_ENV === "production")
    app.use(express_sslify_1.default.HTTPS({ trustProtoHeader: true })); // Redirect http => https
exports.listOfRoutes = function (router, websocket, pool) {
    post_1.default(router);
    get_1.default(router, websocket, pool);
    auth_1.default(router);
};
exports.router = express_1.default.Router(); // get an instance of the express Router
exports.router.use(function (req, res, next) {
    console.log(req.connection.remoteAddress);
    next();
});
exports.router.get("/", function (req, res) {
    res.json({ message: "It works !" });
});
// configure app to use bodyParser() => get data from http request (POST)
app.use(body_parser_1.default.urlencoded({ limit: "50mb", extended: true }));
app.use(body_parser_1.default.json({ limit: "50mb", extended: true }));
app.use("/api", exports.router); // define the default route
exports.default = app;

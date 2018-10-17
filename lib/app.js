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
var app = express_1.default(); // use express on our app
var router = express_1.default.Router(); // get an instance of the express Router
post_1.default(router);
get_1.default(router);
auth_1.default(router);
router.use(function (req, res, next) {
    console.log(req.connection.remoteAddress);
    next();
});
router.get('/', function (req, res) {
    res.json({ message: 'It works !' });
});
// configure app to use bodyParser() => get data from http request (POST)
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use('/api', router); // define the default route
exports.default = app;

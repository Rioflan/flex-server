"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express")); //  call express
var body_parser_1 = __importDefault(require("body-parser")); //  call body-parser
var mongoose_1 = __importDefault(require("mongoose")); // call mongoose
var mongoDB_1 = __importDefault(require("./database/mongoDB"));
var post_1 = __importDefault(require("./routes/post"));
var get_1 = __importDefault(require("./routes/get"));
var auth_1 = __importDefault(require("./routes/auth"));
var certPath = "cert";
// const httpsOptions = {
//     key:   fs.readFileSync(path.join(__dirname, 'cert', 'server.key')),
//     cert:   fs.readFileSync(path.join(__dirname, 'cert', 'server.cert'))
// };
var app = express_1.default(); //use express on our app
var router = express_1.default.Router(); // get an instance of the express Router
post_1.default(router);
get_1.default(router);
auth_1.default(router);
// configure app to use bodyParser() => get data from http request (POST)
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
var DEFAULT_URI = mongoDB_1.default.getMongoUri(); //  get the URI from config file
var DEFAULT_PORT = 3000;
mongoose_1.default.connect(DEFAULT_URI, { useNewUrlParser: true });
router.use(function (req, res, next) {
    console.log(req.connection.remoteAddress);
    next();
});
router.get("/", function (req, res) {
    res.json({ message: "It works !" });
});
app.use("/api", router); //define the default route
var server = app.listen(process.env.PORT || DEFAULT_PORT, function () {
    var port = server.address().port;
    console.log("App now running on port : ", port);
});
// http.createServer(httpApp).listen(httpApp.get('port'), function() {
//     console.log('Express HTTP server listening on port ' + httpApp.get('port'));
// });
// https.createServer(httpsOptions, app).listen(process.env.PORT || DEFAULT_PORT, function() {
//     console.log('Express HTTPS server listening on port ' + DEFAULT_PORT);
// });

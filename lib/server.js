"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose")); // call mongoose
var mongoDB_1 = __importDefault(require("./database/mongoDB"));
var app_1 = __importDefault(require("./app"));
var certPath = 'cert';
// const httpsOptions = {
//     key:   fs.readFileSync(path.join(__dirname, 'cert', 'server.key')),
//     cert:   fs.readFileSync(path.join(__dirname, 'cert', 'server.cert'))
// };
var DEFAULT_URI = mongoDB_1.default.getMongoUri(); //  get the URI from config file
var DEFAULT_PORT = 3000;
mongoose_1.default.connect(DEFAULT_URI, { useNewUrlParser: true });
var server = app_1.default.listen(process.env.PORT || DEFAULT_PORT, function () {
    var port = server.address().port;
    console.log('App now running on port : ', port);
});
// http.createServer(httpApp).listen(httpApp.get('port'), function() {
//     console.log('Express HTTP server listening on port ' + httpApp.get('port'));
// });
// https.createServer(httpsOptions, app).listen(process.env.PORT || DEFAULT_PORT, function() {
//     console.log('Express HTTPS server listening on port ' + DEFAULT_PORT);
// });

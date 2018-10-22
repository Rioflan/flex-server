"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_1 = __importDefault(require("crypto"));
var algorithm = 'aes-256-ctr';
/**
   * This function encrypt the provided text.
   * @param {string} text the current text to encrypt.
   * @param {string} password the provided password.
   */
exports.encrypt = function (text, password) {
    var cipher = crypto_1.default.createCipher(algorithm, password);
    var crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
};
/**
 * This function decrypt the provided text.
 * @param {string} text the current text to decrypt.
 * @param {string} password the provided password.
 */
exports.decrypt = function (text, password) {
    var decipher = crypto_1.default.createDecipher(algorithm, password);
    var dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
};
// let crypto = require('crypto'),
//     algorithm = 'aes-256-ctr';
// let randomBytes = require('randombytes');
// exports.encrypt = function(text, password){
//   const iv = new Buffer(randomBytes(16));
//   let key = crypto.createHash('sha256').update(String(iv)).digest('base64').substr(0, 32);
//   let cipher = crypto.createCipheriv(algorithm, key, iv)
//   let crypted = cipher.update(text,'utf8','hex')
//   crypted += cipher.final('hex');
//   return crypted;
// }
// exports.decrypt = function(text, password){
//   const iv = new Buffer(randomBytes(16));
//   let key = crypto.createHash('sha256').update(String(iv)).digest('base64').substr(0, 32);
//   let decipher = crypto.createDecipheriv(algorithm, key, iv)
//   let dec = decipher.update(text,'hex','utf8')
//   dec += decipher.final('utf8');
//   return dec;
// }

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateNewWord = exports.getRecentDocument = exports.wordBankRef = exports.validWords = exports.__dirname = void 0;
var random_words_1 = require("random-words");
var fs_1 = require("fs");
var path_1 = require("path");
var dotenv = require("dotenv");
var firebase_ts_1 = require("./firebase.ts");
var url_1 = require("url");
var path_2 = require("path");
var __filename = (0, url_1.fileURLToPath)(import.meta.url);
exports.__dirname = (0, path_2.dirname)(__filename);
dotenv.config();
exports.validWords = null;
// Load filtered words list
(function getWords() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    fs_1.default.readFile(path_1.default.resolve(exports.__dirname, "words_filtered.txt"), "utf-8", function (err, data) {
                        if (err) {
                            reject(err);
                        }
                        resolve(data.split(","));
                    });
                })];
        });
    });
})().then(function (data) { return (exports.validWords = data); });
var wordBankRef = function () {
    var collectionName = process.env.NODE_ENV === "production" ? "wordBank" : "wordBankDev";
    return firebase_ts_1.db.collection(collectionName);
};
exports.wordBankRef = wordBankRef;
var getRecentDocument = function (documentData) {
    return documentData
        .sort(function (a, b) { return b.data().count - a.data().count; })[0]
        .data();
};
exports.getRecentDocument = getRecentDocument;
// Creates a new random word and writes it to the database
var generateNewWord = function (newCount, pushToDatabase) {
    if (pushToDatabase === void 0) { pushToDatabase = true; }
    return __awaiter(void 0, void 0, void 0, function () {
        var newWord, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    newWord = (0, random_words_1.generate)({ exactly: 1, minLength: 4, maxLength: 8 })[0];
                    // Ensure validWords array has been created
                    // let newWord = "";
                    if (!exports.validWords) {
                        setTimeout(function () {
                            console.log("Waiting for validWords array to be created...");
                        }, 500);
                    }
                    while (!exports.validWords.includes(newWord)) {
                        newWord = (0, random_words_1.generate)({ exactly: 1, minLength: 4, maxLength: 8 })[0];
                    }
                    console.log("Generated word: " + newWord + " on " + getDateAndTime());
                    if (!pushToDatabase) return [3 /*break*/, 4];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, exports.wordBankRef)().add({
                            word: newWord,
                            count: newCount,
                        })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    console.error("Error adding document: ", e_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, newWord];
            }
        });
    });
};
exports.generateNewWord = generateNewWord;
var getDateAndTime = function () {
    var date = new Date();
    return (date.getMonth() +
        1 +
        "/" +
        date.getDate() +
        "/" +
        date.getFullYear() +
        " @ " +
        new Date().toLocaleTimeString());
};

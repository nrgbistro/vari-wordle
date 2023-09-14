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
var cors_1 = require("cors");
var express_1 = require("express");
var path_1 = require("path");
var node_schedule_1 = require("node-schedule");
var gameHelpers_ts_1 = require("./gameHelpers.ts");
var app = (0, express_1.default)();
var port = process.env.PORT || 3001;
var currentWord = "";
var wordleCount = 0;
var unsubscribe; // Stores the database listener; call to unsubscribe
var getUnsubscribe = function () {
    return (0, gameHelpers_ts_1.wordBankRef)().onSnapshot(function (snapshot) { return __awaiter(void 0, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            if (snapshot.empty)
                return [2 /*return*/];
            data = (0, gameHelpers_ts_1.getRecentDocument)(snapshot.docs);
            currentWord = data.word;
            wordleCount = data.count;
            return [2 /*return*/];
        });
    }); });
};
// Loads the most recent word in the database, adds first word if database only contains placeholder
(function initializeGame() {
    return __awaiter(this, void 0, void 0, function () {
        var querySnapshot;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, gameHelpers_ts_1.wordBankRef)().get()];
                case 1:
                    querySnapshot = _a.sent();
                    if (!((0, gameHelpers_ts_1.getRecentDocument)(querySnapshot.docs).count < 1)) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, gameHelpers_ts_1.generateNewWord)(1)];
                case 2:
                    currentWord = _a.sent();
                    _a.label = 3;
                case 3:
                    unsubscribe = getUnsubscribe();
                    return [2 /*return*/];
            }
        });
    });
})();
// This displays message that the server is running and listening to specified port
app.listen(port, function () { return console.log("Using port ".concat(port)); });
// Have Node serve the files for our built React app
app.use(express_1.default.static(path_1.default.resolve(gameHelpers_ts_1.__dirname, "../build")));
var whitelist = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://vari-wordle.nrgserver.me/",
    "https://dev-vari-wordle.nrgserver.me/",
];
var corsOptions = {
    origin: function (origin, cb) {
        if (whitelist.includes(origin) || !origin) {
            cb(null, true);
        }
        else {
            console.log("origin: ".concat(origin));
            cb(new Error("Not allowed by CORS"));
        }
    },
    optionsSuccessStatus: 200,
};
app.use((0, cors_1.default)(corsOptions));
app.get("/api/word", function (_req, res) {
    res.json({ word: currentWord, count: wordleCount });
});
app.get("/api/validWords", function (_req, res) {
    res.json(gameHelpers_ts_1.validWords);
});
app.get("/", function (_req, res) {
    res.sendFile(path_1.default.resolve(gameHelpers_ts_1.__dirname, "../build", "index.html"));
});
// Generate a new word at midnight every day
node_schedule_1.default.scheduleJob("0 0 * * *", function () {
    wordleCount++;
    (0, gameHelpers_ts_1.generateNewWord)(wordleCount);
    unsubscribe(); // unsubscribe from the old listener to prevent conflicts
    unsubscribe = getUnsubscribe();
});

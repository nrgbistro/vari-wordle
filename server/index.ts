import cors from "cors";
import express from "express";
import path from "path";
import schedule from "node-schedule";
import {
	generateNewWord,
	getRecentDocument,
	validWords,
	wordBankRef,
	__dirname,
} from "./gameHelpers.js";

const app = express();
const port = process.env.PORT || 3001;

let currentWord = "";
let wordleCount = 0;
let unsubscribe = () => {}; // Stores the database listener; call to unsubscribe

// Loads the most recent word in the database, adds first word if database only contains placeholder
(async function initializeGame() {
	const querySnapshot = await wordBankRef().get();
	if (getRecentDocument(querySnapshot.docs).count < 1) {
		currentWord = await generateNewWord(1);
	}
	unsubscribe = wordBankRef().onSnapshot(async (snapshot) => {
		if (snapshot.empty) return;
		const data = getRecentDocument(snapshot.docs);
		currentWord = data.word;
		wordleCount = data.count;
	});
})();

// This displays message that the server is running and listening to specified port
app.listen(port, () => console.log(`Using port ${port}`));

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, "../build")));

const whitelist = [
	"http://localhost:3000",
	"http://localhost:3001",
	"https://vari-wordle.nrgserver.me/",
];
const corsOptions = {
	origin: (origin: any, cb: any) => {
		if (whitelist.includes(origin) || !origin) {
			cb(null, true);
		} else {
			console.log(`origin: ${origin}`);
			cb(new Error("Not allowd by CORS"));
		}
	},
	optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.get("/api/word", (req, res) => {
	res.json({ word: currentWord, count: wordleCount });
});

app.get("/api/validWords", (req, res) => {
	res.json(validWords);
});

app.get("/", (req, res) => {
	res.sendFile(path.resolve(__dirname, "../build", "index.html"));
});

// Generate a new word at midnight every day
schedule.scheduleJob("0 0 * * *", () => {
	wordleCount++;
	generateNewWord(wordleCount);
	unsubscribe();
	unsubscribe = wordBankRef().onSnapshot((snapshot) => {
		const data = getRecentDocument(snapshot.docs);
		currentWord = data.word;
		wordleCount = data.count;
	});
});

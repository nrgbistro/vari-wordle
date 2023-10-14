import cors from "cors";
import express from "express";
import schedule from "node-schedule";
import {
	generateNewWord,
	getRecentDocument,
	validWords,
	wordBankRef,
} from "./gameHelpers";

const app = express();
const port = process.env.PORT ?? 3001;

let currentWord = "";
let wordleCount = 0;
let unsubscribe: () => void; // Stores the database listener; call to unsubscribe

const getUnsubscribe = () => {
	return wordBankRef().onSnapshot(
		(snapshot: FirebaseFirestore.QuerySnapshot) => {
			if (snapshot.empty) return;
			const data = getRecentDocument(snapshot.docs);
			currentWord = data.word;
			wordleCount = data.count;
		}
	);
};

// Loads the most recent word in the database, adds first word if database only contains placeholder
(async function initializeGame() {
	const querySnapshot = await wordBankRef().get();
	if (getRecentDocument(querySnapshot.docs).count < 1) {
		currentWord = await generateNewWord(1);
	}
	unsubscribe = getUnsubscribe();
})().catch((err) => {
	console.error(err);
	process.exit(1);
});

// This displays message that the server is running and listening to specified port
app.listen(port, () => console.log(`Using port ${port}`));

const whitelist = [
	"http://localhost:3000",
	"http://localhost:3001",
	"https://vari-wordle.nrgserver.me/",
	"https://dev-vari-wordle.nrgserver.me/",
];

// TODO: FIX CORS!!!
const corsOptions = {
	origin: (origin: any, cb: any) => {
		if (whitelist.includes(origin) || origin === undefined) {
			cb(null, true);
		} else {
			console.log(`origin: ${origin}`);
			cb(new Error("Not allowed by CORS"));
		}
	},
	optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.get("/api/word", (_req, res) => {
	res.json({ word: currentWord, count: wordleCount });
});

app.get("/api/validWords", (_req, res) => {
	res.json(validWords);
});

app.get("/", (_req, res) => {
	res.send("Vari-Wordle Backend Up!");
});

// Generate a new word at midnight every day
schedule.scheduleJob("0 0 * * *", () => {
	wordleCount++;
	generateNewWord(wordleCount).catch((err) => console.error(err));
	unsubscribe(); // unsubscribe from the old listener to prevent conflicts
	unsubscribe = getUnsubscribe();
});

import cors from "cors";
import express from "express";
import schedule from "node-schedule";
import {
	generateNewWord,
	getRecentDocument,
	validWords,
	wordBankRef,
	getDateAndTime,
} from "./gameHelpers";

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
async function initializeBackendConnection() {
	const querySnapshot = await wordBankRef().get();
	if (getRecentDocument(querySnapshot.docs).count < 1) {
		currentWord = await generateNewWord(1);
	}
	unsubscribe = getUnsubscribe();
}

const whitelist = [
	"http://localhost:3000",
	"https://vari-wordle.nrgserver.me/",
	"https://dev-vari-wordle.nrgserver.me/",
];

const corsOptions = {
	origin: (origin: any, cb: any) => {
		if (origin === undefined || whitelist.includes(origin)) {
			cb(null, true);
		} else {
			console.log(`origin: ${origin}`);
			cb(new Error("Not allowed by CORS"));
		}
	},
	optionsSuccessStatus: 200,
};

// Generate a new word at midnight every day
const createScheduler = () =>
	schedule.scheduleJob("0 0 * * *", () => {
		wordleCount++;
		generateNewWord(wordleCount).catch((err) => console.error(err));
		unsubscribe(); // unsubscribe from the old listener to prevent conflicts
		unsubscribe = getUnsubscribe();
	});

export const initializeServer = async (
	port: number,
	startScheduler: boolean
) => {
	await initializeBackendConnection();
	const app = express();

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

	startScheduler && createScheduler();

	return app.listen(port, () =>
		console.log(`Starting backend on port ${port}, ${getDateAndTime()}`)
	);
};

process.env.TEST === undefined &&
	initializeServer(parseInt(process.env.PORT ?? "3001"), true).catch(
		console.error
	);
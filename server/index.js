const db = require("./firebase.ts");
const cors = require("cors");
const express = require("express");
const path = require("path");
const app = express();
const fs = require("fs");
const { rword } = require("rword");
const port = process.env.PORT || 3001;

let currentWord = "";
let wordleCount = 0;
let unsubscribe = () => {};
let validWords = null;

const checkDatabase = async () => {
	unsubscribe();
	const querySnapshot = db.collection("wordBank");
	if (querySnapshot.empty) {
		const newWord = generateNewWord();
		currentWord = newWord;
		wordleCount = 1;
		try {
			await db.collection("wordBank").add({
				word: newWord,
				count: wordleCount,
			});
		} catch (e) {
			console.error("Error adding document: ", e);
		}
	}
	unsubscribe = db.collection("wordBank").onSnapshot(async (snapshot) => {
		if (snapshot.empty) return;
		const data = snapshot.docs
			.sort((a, b) => b.data().count - a.data().count)[0]
			.data();
		currentWord = data.word;
		wordleCount = data.count;
	});
};

checkDatabase();

// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`));

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, "../build")));

const whitelist = [
	"http://localhost:3000",
	"http://localhost:3001",
	"https://vari-wordle.nrgserver.me/",
];
const corsOptions = {
	origin: (origin, cb) => {
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

const generateNewWord = () => {
	let newWord = rword.generate(1, { length: "4-8" });
	// Ensure validWords array has been created
	if (!validWords) {
		setTimeout(() => {}, 200);
	}
	while (!validWords.includes(newWord)) {
		newWord = rword.generate(1, { length: "4-8" });
	}
	console.log("Generated word: " + newWord);
	return newWord;
};

// Loop to generate new word at midnight
(async function loop() {
	let now = new Date();
	if (now.getHours() === 0 && now.getMinutes() === 0) {
		const newWord = generateNewWord();
		wordleCount++;
		try {
			await db.collection("wordBank").add({
				word: newWord,
				count: wordleCount,
			});
			console.log("Added new word to database: " + newWord);
			console.log("New word count: " + wordleCount);
		} catch (e) {
			console.error("Error adding document: ", e);
		}
		unsubscribe();
		unsubscribe = db.collection("wordBank").onSnapshot((snapshot) => {
			const data = snapshot.docs
				.sort((a, b) => b.data().count - a.data().count)[0]
				.data();
			currentWord = data.word;
			wordleCount = data.count;
		});
	}
	now = new Date(); // allow for time passing
	let delay = 60000 - (now % 60000); // exact ms to next minute interval
	setTimeout(loop, delay);
})();

// Load filtered words list
(async function getWords() {
	return new Promise((resolve, reject) => {
		fs.readFile(
			path.resolve(__dirname, "words_filtered.txt"),
			"UTF-8",
			(err, data) => {
				if (err) {
					reject(err);
				}
				resolve(data.split(","));
				console.log("Valid Words Length: " + data.length);
			}
		);
	});
})().then((data) => (validWords = data));

app.get("/api/word", (req, res) => {
	res.json({ word: currentWord, count: wordleCount });
});

app.get("/api/validWords", (req, res) => {
	res.json(validWords);
});

app.get("*", (req, res) => {
	res.sendFile(path.resolve(__dirname, "../build", "index.html"));
});

const fs = require("fs");
const { rword } = require("rword");
const cors = require("cors");
const express = require("express");
const path = require("path");
const supabase = require("./supabase.ts");
const app = express();
const port = process.env.PORT || 3001;

let currentWord = "";
let wordleCount = 0;
let validWords = null;
let subscription = null;

// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`));

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, "../build")));

const whitelist = [
	"http://localhost:3000/",
	"http://localhost:3001/",
	"https://vari-wordle.herokuapp.com",
	"https://vari-wordle.nrgserver.me",
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
	console.log(`generating`);
	let newWord = rword.generate(1, { length: "4-8" });
	// Ensure validWords array has been created
	if (!validWords) {
		setTimeout(() => {}, 5000);
	}
	console.log(validWords.length);
	while (!validWords.includes(newWord)) {
		newWord = rword.generate(1, { length: "4-8" });
	}
	console.log("Generated word: " + newWord);
	return newWord;
};

// Pushes a new word to supabase and subscribes to changes
const pushWord = async (newWord, count) => {
	console.log("Pushing new word: " + newWord);
	try {
		const result = await supabase.from("wordData").insert({
			word: newWord,
			count: count,
		});
		console.log(result);
	} catch (e) {
		console.error("Error adding document: ", e);
	} finally {
		subscribe();
	}
};

// Loop to generate new word at midnight
(async function loop() {
	let now = new Date();
	if (now.getHours() === 0 && now.getMinutes() === 0) {
		const newWord = generateNewWord();
		wordleCount++;
		await pushWord(newWord, wordleCount);
	}
	now = new Date(); // allow for time passing
	let delay = 60000 - (now % 60000); // exact ms to next minute interval
	setTimeout(loop, delay);
})();

// Runs once on server start to get current word from supabase
(async function connectSupabase() {
	const res = await supabase
		.from("wordData")
		.select("word, count")
		.order("count", { ascending: false })
		.limit(1);
	if (res.data.length === 0) {
		console.log("No words found");
		currentWord = generateNewWord();
		wordleCount = 1;
		await pushWord(currentWord, wordleCount);
	} else {
		currentWord = res.data[0].word;
		wordleCount = res.data[0].count;
	}
	subscribe();
})();

function subscribe() {
	if (subscription) {
		supabase.removeChannel(subscription);
	}
	subscription = supabase
		.channel("wordData")
		.on("postgres_changes", { event: "*", schema: "*" }, (payload) => {
			console.log("Change received!", payload);
			const data = payload.new;
			if (data.count >= wordleCount) {
				currentWord = data.word;
				wordleCount = data.count;
			}
		})
		.subscribe();
}

// Load filtered words list from file
(async function getWords() {
	return new Promise((resolve, reject) => {
		fs.readFile(
			path.resolve(__dirname, "words_filtered.txt"),
			"UTF-8",
			(err, data) => {
				if (err) {
					reject(err);
				}
				resolve(data.split("\r\n"));
			}
		);
	});
})().then((data) => {
	validWords = data;
});

app.get("/api/word", (req, res) => {
	res.json({ word: currentWord, count: wordleCount });
});

app.get("/api/validWords", (req, res) => {
	res.json(validWords);
});

app.get("*", (req, res) => {
	res.sendFile(path.resolve(__dirname, "../build", "index.html"));
});

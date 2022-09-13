const supabase = require("./supabase.ts");
const cors = require("cors");
const express = require("express");
const path = require("path");
const app = express();
const fs = require("fs");
const { rword } = require("rword");
const port = process.env.PORT || 3001;

let currentWord = "";
let wordleCount = 0;
let subscription = () => {};
let validWords = null;

const connectSupabase = async () => {
	const res = await supabase
		.from("wordData")
		.select("word, count")
		.order("count", { ascending: false });
	if (res.data.length === 0) {
		currentWord = generateNewWord();
		wordleCount = 1;
		pushWord(currentWord, wordleCount);
	} else {
		currentWord = res.data[0].word;
		wordleCount = res.data[0].count;
		console.log(currentWord);
	}
	subscription = supabase
		.channel("wordData")
		.on("postgres_changes", { event: "*", schema: "*" }, (payload) => {
			console.log("Change received!", payload);
		})
		.subscribe();
};

connectSupabase();

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

const pushWord = async (newWord, count) => {
	try {
		await supabase.from("wordData").insert({
			word: newWord,
			count: count,
		});
	} catch (e) {
		console.error("Error adding document: ", e);
	}
	// 	if (snapshot.empty) return;
	// 	const data = snapshot.docs
	// 		.sort((a, b) => b.data().count - a.data().count)[0]
	// 		.data();
	// 	currentWord = data.word;
	// 	wordleCount = data.count;
	// });
};

// Loop to generate new word at midnight
(async function loop() {
	let now = new Date();
	if (now.getHours() === 0 && now.getMinutes() === 0) {
		const newWord = generateNewWord();
		wordleCount++;
		// try {
		//   await db.collection("wordBank").add({
		// 	word: newWord,
		// 	count: wordleCount,
		//   });
		// } catch (e) {
		//   console.error("Error adding document: ", e);
		// }
		// subscription();
		// subscription = db.collection("wordBank").onSnapshot((snapshot) => {
		//   const data = snapshot.docs
		// 	.sort((a, b) => b.data().count - a.data().count)[0]
		// 	.data();
		//   currentWord = data.word;
		//   wordleCount = data.count;
		// });
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
				resolve(data.split("\r\n")[0]);
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

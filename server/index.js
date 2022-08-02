const express = require("express");
const path = require("path");
const app = express();
const isWord = require("is-word");
const word = isWord("american-english");
const { rword } = require("rword");
const port = process.env.PORT || 3001;

// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`));

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, "../build")));

const generateNewWord = () => {
	let newWord = rword.generate(1, { length: "4-8" });
	while (!word.check(newWord)) {
		newWord = rword.generate(1, { length: "4-8" });
	}
	return newWord;
};

let currentWord = generateNewWord();
let wordleCount = 1;

(function loop() {
	let now = new Date();
	// if (now.getHours() === 0 && now.getMinutes() === 0) {
	currentWord = generateNewWord();
	wordleCount++;
	// }
	now = new Date(); // allow for time passing
	let delay = 60000 - (now % 60000); // exact ms to next minute interval
	setTimeout(loop, delay);
})();

// create a GET route
app.get("/api/word", (req, res) => {
	res.json({ word: currentWord, count: wordleCount });
});

app.post("/api/word/:word", (req, res) => {
	res.send(word.check(req.params.word));
});

app.get("*", (req, res) => {
	res.sendFile(path.resolve(__dirname, "../build", "index.html"));
});

import randomWords from "random-words";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { db } from "./firebase/firebase.js";

export let validWords: any = null;
export let currentWord = "";
export let wordleCount = 0;
let unsubscribe = () => {};

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load filtered words list
(async function getWords() {
	return new Promise((resolve, reject) => {
		fs.readFile(
			path.resolve(__dirname, "words_filtered.txt"),
			"utf-8",
			(err, data) => {
				if (err) {
					reject(err);
				}
				resolve(data.split(","));
			}
		);
	});
})().then((data) => (validWords = data));

// Creates a new random word and writes it to the database
const generateNewWord = async (newCount: number) => {
	let newWord = randomWords(1)[0];
	// Ensure validWords array has been created
	if (!validWords) {
		setTimeout(() => {}, 200);
	}
	while (
		newWord.length < 4 ||
		newWord.length > 8 ||
		!validWords?.includes(newWord)
	) {
		newWord = randomWords(1)[0];
	}
	console.log("Generated word: " + newWord);

	currentWord = newWord;
	try {
		await db.collection("wordBank").add({
			word: newWord,
			count: newCount,
		});
	} catch (e) {
		console.error("Error adding document: ", e);
	}
	return newWord;
};

// Checks if database is empty, if so, adds a new word
(async function initializeDatabase() {
	const wordBankRef = db.collection("wordBank");
	const querySnapshot = await wordBankRef.get();
	if (querySnapshot.empty) {
		await generateNewWord(1);
	}
	unsubscribe = db.collection("wordBank").onSnapshot(async (snapshot) => {
		if (snapshot.empty) return;
		const data = snapshot.docs
			.sort((a, b) => b.data().count - a.data().count)[0]
			.data();
		currentWord = data.word;
		wordleCount = data.count;
	});
})();

// Loop to generate new word at midnight
export async function gameLoop() {
	let now = new Date();
	if (now.getHours() < 1 && now.getMinutes() < 1) {
		wordleCount++;
		const newWord = generateNewWord(wordleCount);
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
	let delay = 60000 - now.getMilliseconds(); // exact ms to next minute interval
	setTimeout(gameLoop, delay);
}

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
const generateNewWord = async (
	newCount: number,
	pushToDatabase: boolean = true
) => {
	let newWord = randomWords({ exactly: 1, maxLength: 8 })[0];
	// Ensure validWords array has been created
	if (!validWords) {
		setTimeout(() => {}, 200);
	}
	while (newWord.length < 4 || !validWords?.includes(newWord)) {
		newWord = randomWords({ exactly: 1, maxLength: 8 })[0];
	}
	console.log("Generated word: " + newWord);
	if (pushToDatabase) {
		try {
			await db.collection("wordBank").add({
				word: newWord,
				count: newCount,
			});
		} catch (e) {
			console.error("Error adding document: ", e);
		}
	}
	return newWord;
};

// If database is empty, adds the first word
(async function initializeDatabase() {
	const wordBankRef = db.collection("wordBank");
	const querySnapshot = await wordBankRef.get();
	if (querySnapshot.empty) {
		currentWord = await generateNewWord(1);
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
	console.log("new minute: " + now.getMinutes());
	if (now.getHours() < 1 && now.getMinutes() < 1) {
		wordleCount++;
		generateNewWord(wordleCount, false);
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
	console.log("delay: " + delay);
	setTimeout(gameLoop, delay);
}

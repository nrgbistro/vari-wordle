import randomWords from "random-words";
import fs from "fs";
import path from "path";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import { db } from "./firebase.js";

export const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config();

interface WordBankDocument {
	word: string;
	count: number;
}

export let validWords: any = null;

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

export const wordBankRef = () => {
	const collectionName =
		process.env.NODE_ENV === "production" ? "wordBank" : "wordBankDev";
	return db.collection(collectionName);
};

export const getRecentDocument = (
	documentData: FirebaseFirestore.DocumentData
): WordBankDocument => {
	return documentData
		.sort((a: any, b: any) => b.data().count - a.data().count)[0]
		.data();
};

// Creates a new random word and writes it to the database
export const generateNewWord = async (
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
			await wordBankRef().add({
				word: newWord,
				count: newCount,
			});
		} catch (e) {
			console.error("Error adding document: ", e);
		}
	}
	return newWord;
};

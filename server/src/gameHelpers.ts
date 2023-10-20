import fs from "fs";
import path from "path";
import * as dotenv from "dotenv";
import { db } from "./firebase";

dotenv.config();

interface WordBankDocument {
	word: string;
	count: number;
}

export let validWords: string[] | null = null;

// Load filtered words list
(async () => {
	return await new Promise<string[]>((resolve, reject) => {
		fs.readFile(
			path.resolve(__dirname, "static/words_filtered.txt"),
			"utf-8",
			(err, data) => {
				if (err !== null && err !== undefined) {
					reject(err);
				}
				resolve(data.split(","));
			}
		);
	});
})()
	.then((data) => (validWords = data))
	.catch((err) => {
		console.error(err);
	});

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

const generateNewWordHelper = async () => {
	try {
		const { generate } = await import("random-words");
		const ret = generate({
			exactly: 1,
			minLength: 4,
			maxLength: 8,
		})[0];
		return ret;
	} catch (err) {
		console.error(err);
		return "";
	}
};

// Creates a new random word and writes it to the database
export const generateNewWord = async (
	newCount: number,
	pushToDatabase = true
) => {
	let newWord = await generateNewWordHelper();
	if (validWords === null || validWords === undefined) {
		// Ensure validWords array has been created
		setTimeout(() => {
			console.log("Waiting for validWords array to be created...");
		}, 500);
	}
	while (!(validWords ?? []).includes(newWord)) {
		newWord = await generateNewWordHelper();
	}
	console.log("Generated word: " + newWord + " on " + getDateAndTime());
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

const getDateAndTime = (): string => {
	const date = new Date();
	return (
		date.getMonth() +
		1 +
		"/" +
		date.getDate() +
		"/" +
		date.getFullYear() +
		" @ " +
		new Date().toLocaleTimeString()
	);
};
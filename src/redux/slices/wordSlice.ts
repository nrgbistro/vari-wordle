import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { Status } from "../../components/GameGrid/Block";

const checkWord = require("check-if-word");
const word = checkWord("en");

const WORD_URL =
	"https://d24a4e67-4a13-4045-b478-6e50a7204af1.mock.pstmn.io/api/word";
interface wordData {
	correctWord: {
		word: string;
		status: "idle" | "loading" | "succeeded" | "failed";
		error: null | string;
	};
	currentGuess: string;
	guessIndex: number;
	guessedWords: string[];
	guessedLetters: [string, Status][];
}

export const fetchWord = createAsyncThunk("word/fetchWord", async () => {
	try {
		const word = await axios.get(WORD_URL);
		return word;
	} catch (err: any) {
		return err.message;
	}
});

const initialState: wordData = {
	correctWord: {
		word: "place",
		status: "idle",
		error: null,
	},
	currentGuess: "",
	guessIndex: 0,
	guessedWords: [],
	guessedLetters: [],
};

const wordSlice = createSlice({
	name: "word",
	initialState,
	reducers: {
		typeLetter: (state, { payload }) => {
			if (state.currentGuess.length < state.correctWord.word.length) {
				state.currentGuess += payload;
			}
		},
		addGuessedLetter: (state, { payload }) => {
			const letter: string = payload[0].toUpperCase();
			const newStatus: Status = payload[1];
			for (let i = 0; i < state.guessedLetters.length; i++) {
				if (state.guessedLetters[i][0] === letter) {
					// Ensure only 'greater' statuses can replace an existing status
					if (newStatus.valueOf() > state.guessedLetters[i][1].valueOf()) {
						state.guessedLetters[i][1] = newStatus;
					}
					return;
				}
			}
			state.guessedLetters.push([letter, newStatus]);
		},
		removeLetter: (state) => {
			const length = state.currentGuess.length;
			if (length > 0) {
				state.currentGuess = state.currentGuess.substring(0, length - 1);
			}
		},
		guessWord: (state) => {
			if (
				state.correctWord.word.length === state.currentGuess.length &&
				word.check(state.currentGuess)
			) {
				state.guessedWords.push(state.currentGuess);
				state.currentGuess = "";
				state.guessIndex++;
			}
		},
		resetGame: (state) => {
			state = initialState;
		},
	},
});

export const {
	typeLetter,
	removeLetter,
	guessWord,
	addGuessedLetter,
	resetGame,
} = wordSlice.actions;

export default wordSlice.reducer;

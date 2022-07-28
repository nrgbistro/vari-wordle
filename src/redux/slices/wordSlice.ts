import { createSlice } from "@reduxjs/toolkit";
import { Status } from "../../components/GameGrid/Block";

interface wordData {
	correctWord: string;
	currentGuess: string;
	guessIndex: number;
	guessedWords: string[];
	guessedLetters: [string, Status][];
}

const initialState: wordData = {
	correctWord: "practice",
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
			if (state.currentGuess.length < state.correctWord.length) {
				state.currentGuess += payload;
			}
		},
		addGuessedLetter: (state, { payload }) => {
			const letter: string = payload[0].toUpperCase();
			const newStatus: Status = payload[1];
			for (let i = 0; i < state.guessedLetters.length; i++) {
				if (state.guessedLetters[i][0] === letter) {
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
			if (state.correctWord.length === state.currentGuess.length) {
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

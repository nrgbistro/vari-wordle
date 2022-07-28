import { createSlice } from "@reduxjs/toolkit";

interface wordData {
	correctWord: string;
	currentGuess: string;
	guessIndex: number;
	guessedWords: string[];
}

const initialState: wordData = {
	correctWord: "abbey",
	currentGuess: "",
	guessIndex: 0,
	guessedWords: [],
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
	},
});

export const { typeLetter, removeLetter, guessWord } = wordSlice.actions;

export default wordSlice.reducer;

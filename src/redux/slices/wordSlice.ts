import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	correctWord: "tests",
	currentGuess: "te",
	guessIndex: 0,
	guessedWords: [""],
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
	},
});

export const { typeLetter, removeLetter } = wordSlice.actions;

export default wordSlice.reducer;

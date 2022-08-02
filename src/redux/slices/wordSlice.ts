import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { Status } from "../../components/GameGrid/Block";
import { RootState } from "../store";

const WORD_URL = "/api/word";
export const fetchWord = createAsyncThunk("word/fetchWord", async () => {
	try {
		const word = await axios.get(WORD_URL);
		return word;
	} catch (err) {
		return err;
	}
});

export const checkWord = async (word: string) => {
	if (word.length === 0) return;
	const response = await axios.post("/api/word/" + word.toLowerCase());
	return response.data;
};
interface wordData {
	correctWord: {
		word: string;
		count: number;
		status: "idle" | "loading" | "succeeded" | "failed";
		error: null | string;
	};
	currentGuess: string;
	guessIndex: number;
	guessedWords: string[];
	guessedLetters: [string, Status][];
	modal: boolean;
}

const initialState: wordData = {
	correctWord: {
		word: "",
		count: 0,
		status: "idle",
		error: null,
	},
	currentGuess: "",
	guessIndex: 0,
	guessedWords: [],
	guessedLetters: [],
	modal: false,
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
			state.guessedWords.push(state.currentGuess);
			state.currentGuess = "";
			state.guessIndex++;
		},
		resetGame: (state) => {
			state.correctWord = initialState.correctWord;
			state.currentGuess = initialState.currentGuess;
			state.guessIndex = initialState.guessIndex;
			state.guessedLetters = initialState.guessedLetters;
			state.guessedWords = initialState.guessedWords;
			state.modal = initialState.modal;
		},
		toggleModal: (state) => {
			state.modal = !state.modal;
		},
	},
	extraReducers(builder) {
		builder
			.addCase(fetchWord.pending, (state, action) => {
				state.correctWord.status = "loading";
			})
			.addCase(fetchWord.rejected, (state, action) => {
				state.correctWord.status = "failed";
			})
			.addCase(fetchWord.fulfilled, (state, action: any) => {
				state.correctWord.status = "succeeded";
				state.correctWord.word = action.payload.data.word;
				state.correctWord.count = action.payload.data.count;
			});
	},
});

export const {
	typeLetter,
	removeLetter,
	guessWord,
	addGuessedLetter,
	resetGame,
	toggleModal,
} = wordSlice.actions;

export const getWordStatus = (state: RootState) =>
	state.word.correctWord.status;

export default wordSlice.reducer;

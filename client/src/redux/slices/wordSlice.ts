import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { Status } from "../../components/gameGrid/Block";
import { RootState } from "../store";

export const fetchWord = createAsyncThunk("word/fetchWord", async () => {
	try {
		const word = await axios.get("/api/word", { withCredentials: true });
		return word;
	} catch (err) {
		return err;
	}
});

export const fetchValidWords = createAsyncThunk(
	"word/fetchValidWords",
	async () => {
		try {
			const words = await axios.get("/api/validWords", {
				withCredentials: true,
			});
			return words;
		} catch (err) {
			return err;
		}
	}
);

interface wordData {
	correctWord: {
		word: string;
		count: number;
		status: "idle" | "loading" | "succeeded" | "failed";
		error: null | string;
	};
	validWords: {
		words: string[];
		status: "idle" | "loading" | "succeeded" | "failed";
		error: null | string;
	};
	currentGuess: string;
	guessIndex: number;
	guessedWords: string[];
	guessedLetters: [string, Status][];
	guessedWordsGrid: Status[][];
	gameDone: boolean;
	modal: boolean;
}

const initialState: wordData = {
	correctWord: {
		word: "",
		count: 0,
		status: "idle",
		error: null,
	},
	validWords: {
		words: [],
		status: "idle",
		error: null,
	},
	currentGuess: "",
	guessIndex: 0,
	guessedWords: [],
	guessedLetters: [],
	guessedWordsGrid: [],
	gameDone: false,
	modal: false,
};

const wordSlice = createSlice({
	name: "word",
	initialState,
	reducers: {
		typeLetter: (state, { payload }) => {
			if (
				state.currentGuess.length < state.correctWord.word.length &&
				!state.gameDone
			) {
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
			const addGuessedLetter = (letter: string, status: Status) => {
				for (let i = 0; i < state.guessedLetters.length; i++) {
					if (state.guessedLetters[i][0] === letter) {
						// Ensure only 'greater' statuses can replace an existing status
						if (status.valueOf() > state.guessedLetters[i][1].valueOf()) {
							state.guessedLetters[i][1] = status;
						}
						return;
					}
				}
				state.guessedLetters.push([letter, status]);
			};

			// Add guessed word store and reset currently guessed word
			state.guessedWords.push(state.currentGuess);
			state.currentGuess = "";

			const newStatusRow: Status[] = [];

			// Generate new row statuses
			for (let i = 0; i < state.correctWord.word.length; i++) {
				const status = getStatus(
					state.guessedWords[state.guessIndex],
					i,
					state.correctWord.word
				);
				addGuessedLetter(state.guessedWords[state.guessIndex][i], status);
				newStatusRow.push(status);
			}

			state.guessedWordsGrid.push(newStatusRow);

			// Increment guessIndex to next row
			state.guessIndex++;
		},
		resetGame: () => initialState,
		toggleModal: (state) => {
			state.modal = !state.modal;
		},
		openModal: (state) => {
			state.modal = true;
		},
		completeGame: (state) => {
			state.gameDone = true;
		},
	},
	extraReducers(builder) {
		builder
			.addCase(fetchWord.pending, (state) => {
				state.correctWord.status = "loading";
			})
			.addCase(fetchWord.rejected, (state, action) => {
				state.correctWord.status = "failed";
				state.correctWord.error = action.error.toString();
			})
			.addCase(fetchWord.fulfilled, (state, action: any) => {
				state.correctWord.status = "succeeded";
				state.correctWord.word = action.payload.data.word;
				state.correctWord.count = action.payload.data.count;
			})
			.addCase(fetchValidWords.pending, (state) => {
				state.validWords.status = "loading";
			})
			.addCase(fetchValidWords.rejected, (state, action) => {
				state.validWords.status = "failed";
				state.validWords.error = action.error.toString();
			})
			.addCase(fetchValidWords.fulfilled, (state, action: any) => {
				state.validWords.status = "succeeded";
				state.validWords.words = action.payload.data;
			});
	},
});

// Adapted from https://codereview.stackexchange.com/questions/274301/wordle-color-algorithm-in-javascript
const getStatus = (guess: string, index: number, correctWord: string) => {
	const word = correctWord.toLowerCase();
	guess = guess.toLowerCase();

	// correct (matched) index letter
	if (guess[index] === word[index]) {
		return Status.green;
	}

	let wrongWord = 0;
	let wrongGuess = 0;
	for (let i = 0; i < word.length; i++) {
		// count the wrong (unmatched) letters
		if (word[i] === guess[index] && guess[i] !== guess[index]) {
			wrongWord++;
		}
		if (i <= index) {
			if (guess[i] === guess[index] && word[i] !== guess[index]) {
				wrongGuess++;
			}
		}

		// an unmatched guess letter is wrong if it pairs with
		// an unmatched correctWord letter
		if (i >= index) {
			if (wrongGuess === 0) {
				break;
			}
			if (wrongGuess <= wrongWord) {
				return Status.yellow;
			}
		}
	}

	// otherwise not any
	return Status.guessed;
};

export const {
	typeLetter,
	removeLetter,
	guessWord,
	resetGame,
	toggleModal,
	completeGame,
	openModal,
} = wordSlice.actions;

export const getWordStatus = (state: RootState) =>
	state.word.correctWord.status;

export default wordSlice.reducer;

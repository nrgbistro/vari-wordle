export type Word = {
	word: string;
	count: number;
};

export interface WordData {
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

export const enum Status {
	empty,
	guessed,
	yellow,
	green,
}

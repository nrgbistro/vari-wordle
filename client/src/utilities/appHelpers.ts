import { Status } from "../components/gameGrid/Block";

// Mobile Formatting
export const isIosPWA = () => {
	return window.matchMedia("(display-mode: standalone)").matches;
};

export const isIos = () => {
	return (
		navigator.userAgent.toLowerCase().match(/mobile/i) &&
		navigator.userAgent.match(/ipad|ipod|iphone/i) &&
		"ontouchend" in document
	);
};

// Game Logic
export const checkGameWon = (
	guessIndex: number,
	correctWord: string,
	guessedWordsGrid: Status[][]
) => {
	if (guessIndex === 0) return false;
	let wonCheck = true;
	for (let i = 0; i < correctWord.length; i++) {
		if (guessedWordsGrid[guessIndex - 1][i] !== Status.green) {
			wonCheck = false;
		}
	}
	return wonCheck;
};

export const guessAllowedCheck = (
	gameDone: boolean,
	currentGuess: string,
	correctWord: string,
	validWords: string[]
) => {
	if (gameDone) return false;
	if (currentGuess.length !== correctWord.length) {
		return "Not enough letters";
	}
	if (!validWords.includes(currentGuess.toLowerCase())) {
		return "Not in word list";
	}
	return true;
};

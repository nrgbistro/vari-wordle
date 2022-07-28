import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Block, { Status } from "./Block";

const Row = ({ y }: { y: number }) => {
	let ret = [];
	const { correctWord, guessedWords, guessIndex } = useSelector(
		(state: RootState) => state.word
	);

	// Adapted from https://codereview.stackexchange.com/questions/274301/wordle-color-algorithm-in-javascript
	const getStatus = (guess: string, index: number) => {
		// If guess has not yet been reached, return an empty status
		if (guessIndex <= y) {
			return Status.empty;
		}
		const word = correctWord.toLowerCase();
		guess = guess.toLowerCase();

		// correct (matched) index letter
		console.log(guess[index] + "" + word[index]);
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

	for (let j = 0; j < correctWord.length; j++) {
		ret.push(
			<Block
				status={getStatus(guessedWords[y], j)}
				y={y}
				x={j}
				key={j + "" + y}
			/>
		);
	}
	return (
		<div className="w-full h-full grow flex flex-row gap-1 justify-center">
			{ret}
		</div>
	);
};

export default Row;

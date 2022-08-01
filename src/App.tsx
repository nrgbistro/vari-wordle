import axios from "axios";
import { useEffect } from "react";
import Grid from "./components/GameGrid/Grid";
import Keyboard from "./components/Keyboard/Keyboard";
import Navbar from "./components/Navbar";
import {
	typeLetter,
	removeLetter,
	guessWord,
	getWordStatus,
	fetchWord,
	checkWord,
	resetGame,
} from "./redux/slices/wordSlice";
import { useAppDispatch, useAppSelector } from "./redux/store";

const App = () => {
	const dispatch = useAppDispatch();
	const wordStatus = useAppSelector(getWordStatus);
	const { currentGuess, correctWord } = useAppSelector((state) => state.word);

	// Check for a new word
	useEffect(() => {
		(async () => {
			if (correctWord.word.length > 0) {
				const response = await axios.get("/api/word");
				const newWord = response.data.word;
				console.log(`new word: ${newWord}, current word: ${correctWord.word}`);
				if (newWord !== correctWord.word) {
					dispatch(resetGame());
					dispatch<any>(fetchWord());
				}
			}
		})();
	}, [correctWord.word, dispatch]);

	// Fetch the word if it doesn't exist
	useEffect(() => {
		if (wordStatus === "idle") {
			dispatch<any>(fetchWord());
		}
	}, [dispatch, wordStatus]);

	// Create keyboard listener
	useEffect(() => {
		const keyHandler = async (event: KeyboardEvent) => {
			if (event.code === "Enter") {
				if (!(await checkWord(currentGuess))) return;
				dispatch(guessWord());
			} else if (event.code === "Backspace" || event.code === "Delete") {
				dispatch(removeLetter());
			}
			// Ensure key pressed is a single letter without ctrl pressed
			if (event.key.length > 1 || event.ctrlKey) return;

			const keyCode = event.key.charCodeAt(0);
			if (
				(keyCode >= 65 && keyCode <= 90) ||
				(keyCode >= 97 && keyCode <= 122)
			) {
				dispatch(typeLetter(event.key.toUpperCase()));
			}
		};

		window.addEventListener("keyup", keyHandler);

		return () => {
			window.removeEventListener("keyup", keyHandler);
		};
	}, [currentGuess, dispatch]);

	return (
		<div className="min-h-screen dark:bg-gray-800 flex flex-col items-center">
			<Navbar />
			<Grid />
			<Keyboard />
		</div>
	);
};

export default App;

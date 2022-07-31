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

	useEffect(() => {
		(async function checkForNewWord() {
			if (correctWord.word.length > 0) {
				const newWord = await axios.get("/api/word");
				if (newWord.data.word !== correctWord.word) {
					dispatch(resetGame());
				}
			}
		})();
	});

	useEffect(() => {
		if (wordStatus === "idle") {
			dispatch<any>(fetchWord());
		}
	}, [dispatch, wordStatus]);

	useEffect(() => {
		const keyHandler = async (event: KeyboardEvent) => {
			if (event.code === "Enter") {
				if (!(await checkWord(currentGuess))) return;
				dispatch(guessWord());
			} else if (event.code === "Backspace" || event.code === "Delete") {
				dispatch(removeLetter());
			}
			// Ensure key pressed is a single letter
			if (event.key.length > 1) return;

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

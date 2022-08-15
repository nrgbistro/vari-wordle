import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { Status } from "./components/GameGrid/Block";
import Grid from "./components/GameGrid/Grid";
import Keyboard from "./components/Keyboard/Keyboard";
import Popup from "./components/modals/PopupMessage";
import Modal from "./components/modals/StatsModal";
import Navbar from "./components/Navbar";
import {
	typeLetter,
	removeLetter,
	guessWord,
	getWordStatus,
	fetchWord,
	checkWord,
	resetGame,
	toggleModal,
	completeGame,
} from "./redux/slices/wordSlice";
import { useAppDispatch, useAppSelector } from "./redux/store";

export const NUMBER_OF_TRIES = [6, 6, 7, 8, 9];

const App = () => {
	const dispatch = useAppDispatch();
	const wordStatus = useAppSelector(getWordStatus);
	const {
		currentGuess,
		correctWord,
		guessIndex,
		modal,
		guessedWordsGrid,
		gameDone,
	} = useAppSelector((state) => state.word);
	const [popupVisible, setPopupVisible] = useState(false);
	const [popupMessage, setPopupMessage] = useState("");
	const [popupDuration, setPopupDuration] = useState(2000);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (
			navigator.userAgent.toLowerCase().match(/mobile/i) &&
			containerRef.current
		) {
			containerRef.current.classList.remove("min-h-screen");
			containerRef.current.classList.add("min-h-screen-mobile");
		}
	}, []);

	useEffect(() => {
		if (guessIndex > NUMBER_OF_TRIES[correctWord.word.length - 4]) {
			dispatch(completeGame());
			setPopupMessage(correctWord.word);
			setPopupDuration(5000);
			setPopupVisible(true);
			setTimeout(() => {
				dispatch(toggleModal());
			}, 1500);
		}
	}, [correctWord.word, dispatch, guessIndex]);

	useEffect(() => {
		if (guessIndex === 0 || gameDone) return;
		let wonCheck: boolean = true;
		for (let i = 0; i < correctWord.word.length; i++) {
			if (guessedWordsGrid[guessIndex - 1][i] !== Status.green) {
				wonCheck = false;
			}
		}
		if (wonCheck) {
			dispatch(completeGame());
			setPopupMessage("You won!");
			setPopupDuration(2000);
			setPopupVisible(true);
			setTimeout(() => {
				dispatch(toggleModal());
			}, 2000);
		}
	}, [
		correctWord.word.length,
		dispatch,
		gameDone,
		guessIndex,
		guessedWordsGrid,
	]);

	const checkForNewWord = useCallback(async () => {
		if (correctWord.word.length > 0) {
			const response = await axios.get("/api/word");
			const newWord = response.data.word;
			if (newWord !== correctWord.word) {
				dispatch(resetGame());
				dispatch<any>(fetchWord());
			}
		}
	}, [correctWord.word, dispatch]);

	const safegGuessWord = useCallback(async () => {
		if (gameDone) return;
		if (currentGuess.length !== correctWord.word.length) {
			setPopupMessage("Not enough letters");
			setPopupVisible(true);
			return;
		}
		if (!(await checkWord(currentGuess))) {
			setPopupMessage("Not in word list");
			setPopupVisible(true);
			return;
		}
		dispatch(guessWord());
	}, [correctWord.word.length, currentGuess, dispatch, gameDone]);

	// Check for a new word on first load and on each window focus event
	useEffect(() => {
		checkForNewWord();
		window.onfocus = () => {
			checkForNewWord();
		};
	}, [checkForNewWord, correctWord.word, dispatch]);

	// Fetch the word on first load
	useEffect(() => {
		if (wordStatus === "idle") {
			dispatch<any>(fetchWord());
		}
	}, [dispatch, wordStatus]);

	// Create keyboard listener
	useEffect(() => {
		const keyHandler = (event: KeyboardEvent) => {
			if (event.code === "Enter") {
				safegGuessWord();
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
	}, [correctWord.word.length, currentGuess, dispatch, safegGuessWord]);

	return (
		<div
			className="min-h-screen dark:bg-gray-800 flex flex-col items-center"
			ref={containerRef}
		>
			{popupVisible ? (
				<Popup
					message={popupMessage}
					setVisible={setPopupVisible}
					duration={popupDuration}
					setDuration={setPopupDuration}
				/>
			) : null}
			{modal ? <Modal /> : null}
			<Navbar />
			<Grid />
			<Keyboard safegGuessWord={safegGuessWord} />
		</div>
	);
};

export default App;

import axios from "axios";
import {
	Suspense,
	lazy,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import Grid from "./components/gameGrid/Grid";
import Keyboard from "./components/keyboard/Keyboard";
// import Popup from "./components/PopupMessage";
// import Modal from "./components/modals/StatsModal";
import Navbar from "./components/Navbar";
import {
	typeLetter,
	removeLetter,
	guessWord,
	getWordStatus,
	fetchWord,
	resetGame,
	completeGame,
	openModal,
	fetchValidWords,
} from "./redux/slices/wordSlice";
import {
	addGuess,
	incrementGamesPlayed,
	incrementStreak,
	incrementWon,
	NUMBER_OF_TRIES,
	setStreaking,
} from "./redux/slices/statisticsSlice";
import { useAppDispatch, useAppSelector } from "./redux/store";
import { AuthContextProvider } from "./context/AuthContext";
import {
	checkGameWon,
	guessAllowedCheck,
	isIos,
	isIosPWA,
	logRocketInit,
} from "./utilities/appHelpers";

const Popup = lazy(() => import("./components/PopupMessage"));
const Modal = lazy(() => import("./components/modals/StatsModal"));

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

	// Ensure changes to the app don't break local storage by using package version
	useEffect(() => {
		if (localStorage.getItem("version") !== APP_VERSION) {
			localStorage.removeItem("persist:word");
			localStorage.setItem("version", APP_VERSION);
		}

		logRocketInit();
	}, []);

	// Fetch the word on first load
	useEffect(() => {
		if (wordStatus === "idle" || correctWord.word.length === 0) {
			dispatch<any>(fetchWord());
		}
	}, [correctWord, dispatch, wordStatus]);

	const validWords = useAppSelector((state) => state.word.validWords);
	const [popupVisible, setPopupVisible] = useState(false);
	const [popupMessage, setPopupMessage] = useState("");
	const [popupDuration, setPopupDuration] = useState(2000);
	const containerRef = useRef<HTMLDivElement>(null);

	const checkGameWonCached = useCallback(() => {
		return checkGameWon(guessIndex, correctWord.word, guessedWordsGrid);
	}, [correctWord.word, guessIndex, guessedWordsGrid]);

	const getValidWords = useCallback(async () => {
		if (validWords.status === "idle") {
			dispatch<any>(fetchValidWords());
		}
	}, [dispatch, validWords]);

	useEffect(() => {
		getValidWords();
	}, [getValidWords]);

	// Adjust height and spacing for mobile
	useEffect(() => {
		if (isIos()) {
			containerRef.current?.classList.remove("min-h-screen");
			containerRef.current?.classList.add("min-h-screen-mobile");
		}
	}, []);

	const lostGame = useCallback(() => {
		dispatch(completeGame());
		dispatch(setStreaking(false));
		setPopupMessage(correctWord.word);
		setPopupDuration(5000);
		setPopupVisible(true);
		setTimeout(() => {
			dispatch(openModal());
		}, 1500);
	}, [correctWord.word, dispatch]);

	const wonGame = useCallback(() => {
		dispatch(completeGame());
		dispatch(incrementWon());
		dispatch(setStreaking(true));
		dispatch(incrementStreak());
		dispatch(addGuess([correctWord.word.length, guessIndex - 1]));
		setPopupMessage("You won!");
		setPopupDuration(2000);
		setPopupVisible(true);
		setTimeout(() => {
			dispatch(openModal());
		}, 2000);
	}, [correctWord.word, dispatch, guessIndex]);

	// Check for game won or lost
	useEffect(() => {
		if (gameDone) return;
		if (checkGameWonCached()) {
			wonGame();
		} else if (guessIndex >= NUMBER_OF_TRIES[correctWord.word.length - 4]) {
			lostGame();
		}
	}, [
		checkGameWonCached,
		correctWord.word,
		dispatch,
		gameDone,
		guessIndex,
		lostGame,
		wonGame,
	]);

	// Check API for a new word
	const checkForNewWord = useCallback(async () => {
		if (correctWord.word.length <= 0 || correctWord.status === "loading")
			return;
		const response = await axios.get("/api/word", { withCredentials: true });
		const newWord = response.data.word;
		if (newWord !== correctWord.word) {
			if (!checkGameWonCached() && guessedWordsGrid.length > 0) {
				dispatch(setStreaking(false));
			}
			dispatch(resetGame());
			dispatch<any>(fetchWord());
		}
	}, [
		checkGameWonCached,
		correctWord.status,
		correctWord.word,
		dispatch,
		guessedWordsGrid.length,
	]);

	const safeGuessWord = useCallback(async () => {
		const result = guessAllowedCheck(
			gameDone,
			currentGuess,
			correctWord.word,
			validWords.words
		);

		if (!result) return;
		if (typeof result === "string") {
			setPopupMessage(result);
			setPopupVisible(true);
			return;
		}
		if (guessedWordsGrid.length === 0) {
			dispatch(incrementGamesPlayed());
		}
		dispatch(guessWord());
	}, [
		correctWord.word,
		currentGuess,
		dispatch,
		gameDone,
		guessedWordsGrid.length,
		validWords.words,
	]);

	// Check for a new word on first load and on each window focus event
	useEffect(() => {
		checkForNewWord();
		window.onfocus = () => {
			checkForNewWord();
		};
	}, [checkForNewWord]);

	// Create keyboard listener
	useEffect(() => {
		const keyHandler = (event: KeyboardEvent) => {
			if (event.code === "Enter") {
				safeGuessWord();
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
	}, [correctWord.word.length, currentGuess, dispatch, safeGuessWord]);

	return (
		<AuthContextProvider>
			<div
				className="min-h-screen dark:bg-gray-800 flex flex-col items-center"
				ref={containerRef}
			>
				{popupVisible && (
					<Suspense>
						<Popup
							message={popupMessage}
							setVisible={setPopupVisible}
							duration={popupDuration}
							setDuration={setPopupDuration}
						/>
					</Suspense>
				)}
				{modal && (
					<Suspense>
						<Modal />
					</Suspense>
				)}
				<Navbar />
				<Grid />
				<Keyboard
					safeGuessWord={safeGuessWord}
					className={isIosPWA() ? "mb-20" : ""}
				/>
			</div>
		</AuthContextProvider>
	);
};

export default App;

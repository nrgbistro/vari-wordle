import { useRef, useState } from "react";
import { toggleModal } from "../../redux/slices/wordSlice";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { AiOutlineClose } from "react-icons/ai";
import { BsShare } from "react-icons/bs";
import Popup from "./PopupMessage";
import GameStats from "./gameStats";
import GuessDistribution from "./GuessDistribution";
import { NUMBER_OF_TRIES } from "../../redux/slices/statisticsSlice";
import useDarkMode from "use-dark-mode";

const Modal = () => {
	const dispatch = useAppDispatch();
	const [popupVisible, setPopupVisible] = useState(false);
	const [popupMessage, setPopupMessage] = useState("");
	const shareButtonRef = useRef<HTMLButtonElement>(null);
	const backgroundRef = useRef<HTMLDivElement>(null);
	const { guessIndex, correctWord, guessedWordsGrid, gameDone } =
		useAppSelector((state) => state.word);

	const darkMode = useDarkMode();
	console.log(darkMode);

	const getEmoji = (num: number) => {
		if (num === 1) return darkMode.value ? "⬛" : "⬜";
		if (num === 2) return "🟨";
		else if (num === 3) return "🟩";
	};

	const shareResult = () => {
		if (!gameDone) {
			setPopupMessage("Game not won");
			setPopupVisible(true);
			return;
		}
		let ret = `Vari-Wordle ${correctWord.count} ${guessIndex}/${
			NUMBER_OF_TRIES[correctWord.word.length - 4]
		}\n`;

		// Add emojis based on guessedWordsGrid
		for (let i = 0; i < guessedWordsGrid.length; i++) {
			ret = ret + "\n";
			for (let j = 0; j < correctWord.word.length; j++) {
				ret = ret + getEmoji(guessedWordsGrid[i][j].valueOf());
			}
		}

		if (navigator.userAgent.toLowerCase().match(/mobile/i)) {
			navigator.share({ text: ret });
		} else {
			setPopupMessage("Copied to clipboard");
			setPopupVisible(true);
			navigator.clipboard.writeText(ret);
		}
	};
	return (
		<div
			className="absolute z-20 top-0 bottom-0 right-0 left-0 bg-gray-600/50"
			ref={backgroundRef}
			onClick={(e) => {
				if (e.target === backgroundRef.current) dispatch(toggleModal());
			}}
		>
			{popupVisible && (
				<Popup setVisible={setPopupVisible} message={popupMessage} />
			)}
			<div className="absolute z-30 top-10 bottom-10 left-4 right-4 md:left-[50%] md:-translate-x-[50%] md:w-[500px] bg-white dark:bg-slate-800 rounded-md">
				<div className="flex flex-col justify-between h-full">
					<div className="flex flex-row justify-between w-full">
						<h2 className="mx-2 text-3xl font-variant-small">statistics</h2>
						<AiOutlineClose
							className="m-2 text-2xl cursor-pointer"
							onClick={() => dispatch(toggleModal())}
						/>
					</div>
					<div className="w-full text-center">
						<GameStats />
					</div>
					<div>
						<GuessDistribution />
					</div>
					<button
						className="m-3 bg-blue-500 rounded-full h-10 text-white"
						onClick={shareResult}
						ref={shareButtonRef}
					>
						Share <BsShare className="inline text-sm -translate-y-[1px]" />
					</button>
				</div>
			</div>
		</div>
	);
};

export default Modal;

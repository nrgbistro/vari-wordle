import { useContext, useEffect, useRef, useState } from "react";
import { setModal } from "../../redux/slices/wordSlice";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { AiOutlineClose } from "react-icons/ai";
import { BsShare } from "react-icons/bs";
import Popup from "../PopupMessage";
import GameStats from "./Stats";
import GuessDistribution from "./GuessDistribution";
import { NUMBER_OF_TRIES } from "../../redux/slices/statisticsSlice";
import useDarkMode from "use-dark-mode";
import { UserAuth } from "../../context/AuthContext";
import supabase from "../../supabase";

interface User {
	email: string;
	avatar: string;
	name: string;
}

const defaultUser: User = {
	email: "",
	avatar: "",
	name: "",
};

const Modal = () => {
	const dispatch = useAppDispatch();
	const [popupVisible, setPopupVisible] = useState(false);
	const [popupMessage, setPopupMessage] = useState("");
	const shareButtonRef = useRef<HTMLButtonElement>(null);
	const backgroundRef = useRef<HTMLDivElement>(null);
	const { guessIndex, correctWord, guessedWordsGrid, gameDone } =
		useAppSelector((state) => state.word);

	const darkMode = useDarkMode();

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

	const [loading, setLoading] = useState(false);
	const [user, setUser] = useState<User>(defaultUser);

	const { googleSignIn }: any = UserAuth();
	const handleSignIn = async (e: any) => {
		e.preventDefault();
		if (loading) return;
		setLoading(true);
		await googleSignIn();
		setLoading(false);
	};

	useEffect(() => {
		const getUser = async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			return user;
		};
		getUser().then((e) => {
			console.log(e);
			if (e) {
				const newUser: User = {
					email: e.user_metadata.email,
					avatar: e.user_metadata.avatar_url,
					name: e.user_metadata.full_name,
				};
				setUser(newUser);
			}
		});
	}, []);

	const AccountIcon = () => {
		return <img src={user.avatar} alt={"profile"}></img>;
	};

	return (
		<div
			className="absolute z-20 top-0 bottom-0 right-0 left-0 bg-gray-600/50"
			ref={backgroundRef}
			onClick={(e) => {
				if (e.target === backgroundRef.current) dispatch(setModal(false));
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
							onClick={() => dispatch(setModal(false))}
						/>
					</div>
					<div className="w-full text-center">
						<GameStats />
					</div>
					<div>
						<GuessDistribution />
					</div>
					<div className="w-full flex flex-row justify-center p-1">
						{user ? (
							<AccountIcon />
						) : (
							<button
								className="w-28"
								aria-live="polite"
								onClick={handleSignIn}
							>
								Send magic link
							</button>
						)}

						<button
							className="m-1 bg-blue-500 rounded-full h-10 text-white w-full"
							onClick={shareResult}
							ref={shareButtonRef}
						>
							Share <BsShare className="inline text-sm -translate-y-[1px]" />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Modal;

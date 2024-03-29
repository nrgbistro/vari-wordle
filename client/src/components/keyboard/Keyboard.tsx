import { BsBackspace } from "react-icons/bs";
import { removeLetter, typeLetter } from "../../redux/slices/wordSlice";
import { useAppDispatch } from "../../redux/store";
import Key from "./Key";
import KeyRow from "./KeyRow";

const Keyboard = ({
	safeGuessWord: safegGuessWord,
	className = "",
}: {
	safeGuessWord: () => Promise<void>;
	className?: string;
}) => {
	const dispatch = useAppDispatch();

	const row1 = "QWERTYUIOP";
	const row2 = "ASDFGHJKL";
	const row3 = "ZXCVBNM";

	return (
		<div
			className={"flex flex-col items-center gap-2 mt-auto mb-1 px-1 w-full noselect".concat(
				" ",
				className
			)}
		>
			<KeyRow>
				{row1.split("").map((letter) => (
					<Key
						action={() => {
							dispatch(typeLetter(letter));
						}}
						accessibleLabel={letter}
						key={letter}
					>
						{letter}
					</Key>
				))}
			</KeyRow>
			<KeyRow className="px-4">
				{row2.split("").map((letter) => (
					<Key
						action={() => {
							dispatch(typeLetter(letter));
						}}
						accessibleLabel={letter}
						key={letter}
					>
						{letter}
					</Key>
				))}
			</KeyRow>
			<KeyRow>
				<Key
					action={() => {
						safegGuessWord();
					}}
					accessibleLabel="Enter"
				>
					ENTER
				</Key>
				{row3.split("").map((letter) => (
					<Key
						action={() => {
							dispatch(typeLetter(letter));
						}}
						accessibleLabel={letter}
						key={letter}
					>
						{letter}
					</Key>
				))}
				<Key
					action={() => {
						dispatch(removeLetter());
					}}
					accessibleLabel="Backspace"
				>
					<BsBackspace className="text-xl mx-auto sm:mx-4" />
				</Key>
			</KeyRow>
		</div>
	);
};

export default Keyboard;

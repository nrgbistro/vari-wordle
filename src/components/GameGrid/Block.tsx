import { useCallback, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, useAppSelector } from "../../redux/store";

type Props = {
	x: number;
	y: number;
};

export const enum Status {
	empty,
	guessed,
	yellow,
	green,
}

const Block: React.FC<Props> = ({ x, y }) => {
	const ref = useRef<HTMLDivElement>(null);
	const { guessIndex, currentGuess, guessedWords } = useSelector(
		(state: RootState) => state.word
	);
	const dispatch = useDispatch();

	const statusGrid = useAppSelector((state) => state.word.guessedWordsGrid);

	const getLetter = useCallback(
		(x: number, y: number): string => {
			if (guessIndex === y) {
				return currentGuess.split("")[x]?.toUpperCase();
			} else if (guessIndex > y) {
				return guessedWords[y].split("")[x]?.toUpperCase();
			}
			return "";
		},
		[currentGuess, guessIndex, guessedWords]
	);

	useEffect(() => {
		// Catch if the row has not been created yet
		if (statusGrid[y] === undefined) return;

		if (ref && ref.current) {
			if (statusGrid[y][x] !== Status.empty) {
				ref.current.classList.replace("border-gray-600", "border-transparent");
				ref.current.classList.add("text-white");
			}

			switch (statusGrid[y][x]) {
				case Status.yellow:
					ref.current.classList.add("bg-yellow-400");
					break;
				case Status.green:
					ref.current.classList.add("bg-green-600");
					break;
				case Status.guessed:
					ref.current.classList.add("bg-gray-400");
					ref.current.classList.add("dark:bg-slate-700");
					break;
				default:
					break;
			}
		}
	}, [
		currentGuess,
		dispatch,
		getLetter,
		guessIndex,
		guessedWords,
		statusGrid,
		x,
		y,
	]);

	return (
		<div
			className="grow border-solid border-gray-600 border-2 relative select-none"
			ref={ref}
		>
			<p className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] text-4xl font-semibold">
				{getLetter(x, y)}
			</p>
		</div>
	);
};

export default Block;

import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import { addGuessedLetter } from "../../redux/slices/wordSlice";

type Props = {
	x: number;
	y: number;
	status: Status;
};

export const enum Status {
	empty,
	guessed,
	yellow,
	green,
}

const Block: React.FC<Props> = ({ status, x, y }) => {
	const ref = useRef<HTMLDivElement>(null);
	const { guessIndex, currentGuess, guessedWords } = useSelector(
		(state: RootState) => state.word
	);
	const dispatch = useDispatch();

	const getLetter = (x: number, y: number): string => {
		if (guessIndex === y) {
			return currentGuess.split("")[x]?.toUpperCase();
		} else if (guessIndex > y) {
			return guessedWords[y].split("")[x]?.toUpperCase();
		}
		return "";
	};

	useEffect(() => {
		const getLetter = (x: number, y: number): string => {
			return guessedWords[y].split("")[x]?.toUpperCase();
		};

		if (ref && ref.current) {
			if (status !== undefined && status !== Status.empty) {
				ref.current.classList.add("border-none");
			}

			switch (status) {
				case Status.yellow:
					ref.current.classList.add("bg-yellow-300/75");
					dispatch(addGuessedLetter([getLetter(x, y), Status.yellow]));
					break;
				case Status.green:
					ref.current.classList.add("bg-green-600");
					dispatch(addGuessedLetter([getLetter(x, y), Status.green]));
					break;
				case Status.guessed:
					ref.current.classList.add("bg-gray-400");
					ref.current.classList.add("dark:bg-slate-700");
					dispatch(addGuessedLetter([getLetter(x, y), Status.guessed]));
					break;
				default:
					break;
			}
		}
	}, [currentGuess, dispatch, guessIndex, guessedWords, status, x, y]);

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

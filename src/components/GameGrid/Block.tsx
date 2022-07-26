import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

type Props = {
	x: number;
	y: number;
};

enum Status {
	empty,
	guessed,
	yellow,
	green,
}

const Block: React.FC<Props> = ({ x, y }) => {
	const ref = useRef<HTMLDivElement>(null);
	const { guessIndex, currentGuess, guessedWords, correctWord } = useSelector(
		(state: RootState) => state.word
	);

	const [status, updateStatus] = useState(Status.empty);

	const getLetter = (x: number, y: number): string => {
		if (guessIndex === y) {
			return currentGuess.split("")[x]?.toUpperCase();
		} else if (guessIndex > y) {
			return guessedWords[y].split("")[x]?.toUpperCase();
		} else {
			return "";
		}
	};

	useEffect(() => {
		const getStatus = () => {
			const currentLetter = guessedWords[y].split("")[x].toLowerCase();
			const correctWordList = correctWord.toLowerCase().split("");

			for (let i = 0; i < correctWordList.length; i++) {
				if (currentLetter === correctWordList[i] && x === i) {
					return Status.green;
				}
			}
			if (correctWord.includes(currentLetter)) {
				return Status.yellow;
			} else {
				return Status.guessed;
			}
		};

		if (guessIndex > y) {
			updateStatus(getStatus());
		}
	}, [correctWord, guessIndex, guessedWords, x, y]);

	useEffect(() => {
		if (ref && ref.current) {
			if (status !== undefined && status !== Status.empty) {
				ref.current.classList.add("border-none");
			}

			switch (status) {
				case Status.yellow:
					ref.current.classList.add("bg-yellow-300/75");
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
	}, [status]);

	return (
		<div
			className="h-10 w-10 sm:h-12 sm:w-12 border-solid border-gray-600 border-2 relative select-none"
			ref={ref}
			onClick={() => {
				console.log(`X: ${x}, Y: ${y}`);
			}}
		>
			<p className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] text-4xl font-semibold">
				{getLetter(x, y)}
			</p>
		</div>
	);
};

export default Block;

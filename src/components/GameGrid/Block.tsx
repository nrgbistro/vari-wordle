import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

type Props = {
	status?: "empty" | "guessed" | "yellow" | "green";
	x: number;
	y: number;
};

const Block: React.FC<Props> = ({ status, x, y }) => {
	const ref = useRef<HTMLDivElement>(null);
	const { guessIndex, currentGuess, guessedWords } = useSelector(
		(state: RootState) => state.word
	);

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
		if (ref && ref.current) {
			if (status !== undefined && status !== "empty") {
				ref.current.classList.add("border-none");
			}

			switch (status) {
				case "yellow":
					ref.current.classList.add("bg-yellow-300/75");
					break;
				case "green":
					ref.current.classList.add("bg-green-300/600");
					break;
				case "guessed":
					ref.current.classList.add("bg-slate-700");
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

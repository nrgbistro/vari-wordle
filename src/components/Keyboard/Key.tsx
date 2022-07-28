import { PropsWithChildren, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Status } from "../GameGrid/Block";

type Props = PropsWithChildren<{
	action?: Function;
}>;

const Key: React.FC<Props> = ({ action, children }) => {
	const { guessedLetters } = useSelector((state: RootState) => state.word);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		let status: Status = Status.empty;
		for (let i = 0; i < guessedLetters.length; i++) {
			if (children === guessedLetters[i][0]) {
				status = guessedLetters[i][1];
			}
		}

		console.log(status);

		if (ref && ref.current) {
			if (status !== Status.empty) {
				ref.current.classList.add("text-white");
				ref.current.classList.remove("bg-gray-300");
				ref.current.classList.remove("dark:bg-gray-500");
			}

			switch (status) {
				case Status.yellow:
					ref.current.classList.add("bg-yellow-400");
					break;
				case Status.green:
					ref.current.classList.add("bg-green-600");
					break;
				case Status.guessed:
					ref.current.classList.add("bg-gray-600");
					ref.current.classList.add("dark:bg-slate-600/50");
					break;
				default:
					ref.current.classList.add("bg-gray-300");
					ref.current.classList.add("dark:bg-gray-500");
					break;
			}
		}
	}, [guessedLetters, children]);

	return (
		<div
			className="rounded-md sm:min-w-[40px] sm:grow-0 grow items-center"
			ref={ref}
		>
			<button
				onClick={() => {
					action ? action() : console.log("No action defined");
				}}
				className="w-full"
			>
				<h1 className="my-4 mx-2 font-bold">{children}</h1>
			</button>
		</div>
	);
};

export default Key;

import { PropsWithChildren, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Status } from "../../utilities/types";

type Props = PropsWithChildren<{
	action?: () => void;
	accessibleLabel: string;
}>;

const Key: React.FC<Props> = ({ action, children, accessibleLabel }) => {
	const { guessedLetters } = useSelector((state: RootState) => state.word);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		let status: Status = Status.empty;
		for (let i = 0; i < guessedLetters.length; i++) {
			if (children === guessedLetters[i][0]) {
				status = guessedLetters[i][1];
			}
		}

		if (ref && ref.current) {
			let newClassName = "";

			switch (status) {
				case Status.green:
					newClassName = "dark:bg-correct-100 bg-correct-900";
					break;
				case Status.yellow:
					newClassName = "dark:bg-present-100 bg-present-900";
					break;
				case Status.guessed:
					newClassName = "bg-gray-600 dark:bg-slate-600/50";
					break;
				default:
					newClassName = "bg-gray-300 dark:bg-gray-500";
					break;
			}
			ref.current.className =
				"rounded-md sm:min-w-[40px] sm:grow-0 grow items-center".concat(
					" ",
					newClassName
				);
			if (status !== Status.empty) {
				ref.current.classList.add("text-white");
			}
		}
	}, [guessedLetters, children]);

	return (
		<div ref={ref}>
			<button
				onClick={() => {
					action ? action() : console.log("No action defined");
				}}
				className="w-full h-full"
				aria-label={accessibleLabel}
			>
				<h1 className="my-4 sm:mx-2 font-bold font-mono mx-auto">{children}</h1>
			</button>
		</div>
	);
};

export default Key;

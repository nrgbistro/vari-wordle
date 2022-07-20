import { ReactElement, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Block from "./Block";

const Grid = () => {
	const ref = useRef<HTMLDivElement>(null);
	const { correctWord } = useSelector((state: RootState) => state.word);
	const NUMBER_OF_TRIES = [5, 6, 7, 9, 10];

	let grid: ReactElement[] = [];

	for (let i = 0; i < NUMBER_OF_TRIES[correctWord.length - 4]; i++) {
		for (let j = 0; j < correctWord.length; j++) {
			grid.push(<Block key={i + "" + j} x={j} y={i} />);
		}
	}

	useEffect(() => {
		if (ref && ref.current) {
			ref.current.style.gridTemplateColumns = `repeat(${correctWord.length},minmax(0,1fr))`;
		}
	});

	return (
		<div
			className="grid gap-1 grid-cols-5 h-full grow items-center content-center"
			ref={ref}
		>
			{grid}
		</div>
	);
};

export default Grid;

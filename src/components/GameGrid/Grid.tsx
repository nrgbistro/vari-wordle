import { ReactElement } from "react";
import Row from "./Row";

const GameGrid = ({ wordLength }: { wordLength: 4 | 5 | 6 | 7 | 8 }) => {
	const NUMBER_OF_TRIES = [5, 6, 7, 9, 10];

	let grid: ReactElement[] = [];

	for (let i = 0; i < NUMBER_OF_TRIES[wordLength - 4]; i++) {
		grid.push(<Row wordLength={wordLength} key={i} />);
	}

	return (
		<div className="flex flex-col items-center m-6 gap-1 grow">{grid}</div>
	);
};

export default GameGrid;

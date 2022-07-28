import { ReactElement } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Row from "./Row";

const Grid = () => {
	const { correctWord } = useSelector((state: RootState) => state.word);
	const NUMBER_OF_TRIES = [5, 6, 7, 9, 10];

	let grid: ReactElement[] = [];

	for (let i = 0; i < NUMBER_OF_TRIES[correctWord.length - 4]; i++) {
		grid.push(<Row y={i} key={i} />);
	}

	return (
		<div className="flex flex-col h-full w-full md:w-[500px] gap-1 grow items-center content-center p-2">
			{grid}
		</div>
	);
};

export default Grid;

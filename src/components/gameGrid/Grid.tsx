import { ReactElement } from "react";
import { useSelector } from "react-redux";
import { NUMBER_OF_TRIES } from "../../redux/slices/statisticsSlice";
import { RootState } from "../../redux/store";
import Row from "./Row";

const Grid = () => {
	const { correctWord } = useSelector((state: RootState) => state.word);

	let grid: ReactElement[] = [];

	for (let i = 0; i < NUMBER_OF_TRIES[correctWord.word.length - 4]; i++) {
		grid.push(<Row y={i} key={i} />);
	}

	return (
		<div className="flex flex-col h-full w-full sm:w-[30rem] gap-1 grow items-center content-center p-2">
			{correctWord !== null ? grid : null}
		</div>
	);
};

export default Grid;

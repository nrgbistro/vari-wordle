import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Block from "./Block";

const Row = ({ y }: { y: number }) => {
	const row = [];
	const { correctWord } = useSelector((state: RootState) => state.word);

	for (let j = 0; j < correctWord.word.length; j++) {
		row.push(<Block y={y} x={j} key={j + "" + y} />);
	}
	return (
		<div className="w-full h-full grow flex flex-row gap-1 justify-center">
			{row}
		</div>
	);
};

export default Row;

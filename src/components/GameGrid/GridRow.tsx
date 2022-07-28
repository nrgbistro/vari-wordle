import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Block, { Status } from "./Block";

const Row = ({ y }: { y: number }) => {
	let ret = [];
	const { correctWord } = useSelector((state: RootState) => state.word);

	for (let j = 0; j < correctWord.length; j++) {
		ret.push(<Block status={Status.empty} y={y} x={j} key={j + "" + y} />);
	}
	return (
		<div className="w-full h-full grow flex flex-row gap-1 justify-center">
			{ret}
		</div>
	);
};

export default Row;

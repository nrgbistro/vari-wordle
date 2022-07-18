import { ReactElement } from "react";
import Block from "./Block";

const Row = ({ wordLength, type }: { wordLength: number; type?: string }) => {
	let boxes: ReactElement[] = [];
	for (let i = 0; i < wordLength; i++) {
		boxes.push(<Block key={i} />);
	}
	return <div className="flex flex-row gap-1">{boxes}</div>;
};

export default Row;

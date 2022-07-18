import { PropsWithChildren } from "react";

type Props = PropsWithChildren<{}>;

const KeyRow: React.FC<Props> = (props) => {
	return (
		<div className="flex flex-row justify-center gap-1">{props.children}</div>
	);
};

export default KeyRow;

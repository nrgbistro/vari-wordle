import { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
	action?: Function;
}>;

const Key: React.FC<Props> = ({ action, children }) => {
	return (
		<button
			onClick={() => {
				action ? action() : console.log("No action defined");
			}}
			className="bg-gray-300 rounded-md min-w-[20px]"
		>
			<h1 className="my-4 mx-2 font-bold">{children}</h1>
		</button>
	);
};

export default Key;

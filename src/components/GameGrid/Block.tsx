import { useEffect, useRef } from "react";

type Props = {
	status?: "empty" | "guessed" | "yellow" | "green";
	letter?: string;
};

const Block: React.FC<Props> = ({ status, letter }) => {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (ref && ref.current) {
			if (status !== undefined && status !== "empty") {
				ref.current.classList.add("border-none");
			}

			switch (status) {
				case "yellow":
					ref.current.classList.add("bg-yellow-300/75");
					break;
				case "green":
					ref.current.classList.add("bg-green-300/600");
					break;
				case "guessed":
					ref.current.classList.add("bg-slate-700");
					break;
			}
		}
	}, [status]);

	return (
		<div
			className="h-14 w-14 md:h-18 md:w-18 border-solid border-gray-600 border-2 relative"
			ref={ref}
		>
			<p className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] text-4xl font-semibold">
				{letter}
			</p>
		</div>
	);
};

export default Block;

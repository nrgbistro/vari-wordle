import { PropsWithChildren, useEffect, useRef } from "react";

type Props = PropsWithChildren<{
	className?: string;
}>;

const KeyRow: React.FC<Props> = ({ className, children }) => {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (ref && ref.current && className) {
			ref.current.classList.add(className);
		}
	});

	return (
		<div className={"flex flex-row justify-center gap-1 w-full"} ref={ref}>
			{children}
		</div>
	);
};

export default KeyRow;

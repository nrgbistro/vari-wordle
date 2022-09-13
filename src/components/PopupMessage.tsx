import { useEffect } from "react";

const DURATION = 2000;

interface Props {
	setVisible: React.Dispatch<React.SetStateAction<boolean>>;
	setDuration?: React.Dispatch<React.SetStateAction<number>>;
	message: string;
	duration?: number;
}

const Popup: React.FC<Props> = ({
	setVisible,
	setDuration,
	message,
	duration = DURATION,
}) => {
	useEffect(() => {
		setTimeout(() => {
			setVisible(false);
			if (setDuration) {
				setDuration(DURATION);
			}
		}, duration);
	}, [duration, setDuration, setVisible]);

	return (
		<div className="absolute top-14 z-50 left-[50%] -translate-x-[50%] bg-gray-800/95 dark:bg-white/95 rounded-md flex justify-center">
			<h2 className="my-2 mx-4 text-xl text-white dark:text-black font-bold whitespace-nowrap">
				{message}
			</h2>
		</div>
	);
};

export default Popup;

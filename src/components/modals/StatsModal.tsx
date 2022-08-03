import { useRef } from "react";
import { toggleModal } from "../../redux/slices/wordSlice";
import { useAppDispatch } from "../../redux/store";

const Modal = () => {
	const dispatch = useAppDispatch();
	const ref = useRef<HTMLDivElement>(null);
	return (
		<div
			className="absolute z-20 top-0 bottom-0 right-0 left-0 bg-gray-600/50"
			ref={ref}
			onClick={(e) => {
				if (e.target === ref.current) dispatch(toggleModal());
			}}
		>
			<div className="absolute z-30 top-10 bottom-10 left-4 right-4 md:left-[50%] md:-translate-x-[50%] md:w-[500px] bg-slate-800 rounded-md">
				WIP - click outside to close
			</div>
		</div>
	);
};

export default Modal;

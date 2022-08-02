import { toggleModal } from "../../redux/slices/wordSlice";
import { useAppDispatch } from "../../redux/store";

const Modal = () => {
	const dispatch = useAppDispatch();
	return (
		<div
			className="absolute z-20 top-0 bottom-0 right-0 left-0 bg-gray-600/50"
			onClick={() => dispatch(toggleModal())}
		></div>
	);
};

export default Modal;

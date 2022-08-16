import { toggleModal } from "../redux/slices/wordSlice";
import { useAppDispatch } from "../redux/store";
import ThemeToggle from "./ThemeToggle";
import { GiHamburgerMenu } from "react-icons/gi";

const Navbar = () => {
	const dispatch = useAppDispatch();
	return (
		<header className="border-b-black/50 border-b-2 h-12 sm:h-14 w-full">
			<button
				onClick={() => dispatch(toggleModal())}
				className="text-3xl absolute top-2 md:top-3 left-2"
			>
				<GiHamburgerMenu />
			</button>
			<h1 className="absolute top-1 left-[50%] -translate-x-[50%] text-2xl md:text-4xl font-bold whitespace-nowrap">
				VARI-WORDLE
			</h1>
			<ThemeToggle />
		</header>
	);
};

export default Navbar;

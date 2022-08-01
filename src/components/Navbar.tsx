import { useAppSelector } from "../redux/store";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
	const wordleCount = useAppSelector((state) => state.word.correctWord.count);
	console.log(`wordle count: ${wordleCount}`);
	return (
		<header className="border-b-black/50 border-b-2 h-12 sm:h-14 w-full">
			<h1 className="absolute top-1 left-[50%] -translate-x-[50%] text-2xl md:text-4xl font-bold">
				VARI-WORDLE
			</h1>
			<ThemeToggle />
		</header>
	);
};

export default Navbar;

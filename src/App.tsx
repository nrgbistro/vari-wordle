import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Grid from "./components/GameGrid/Grid";
import Keyboard from "./components/Keyboard/Keyboard";
import Navbar from "./components/Navbar";
import { typeLetter, removeLetter } from "./redux/slices/wordSlice";

const App = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		const keyHandler = (event: KeyboardEvent) => {
			if (event.code === "Backspace") {
				dispatch(removeLetter());
			}
			if (event.key.length > 1) return;
			const keyCode = event.key.charCodeAt(0);
			if (
				(keyCode >= 65 && keyCode <= 90) ||
				(keyCode >= 97 && keyCode <= 122)
			) {
				dispatch(typeLetter(event.key.toUpperCase()));
			}
		};

		window.addEventListener("keyup", keyHandler);

		return () => {
			window.removeEventListener("keyup", keyHandler);
		};
	}, [dispatch]);

	return (
		<div className="min-h-screen dark:bg-gray-800 flex flex-col items-center">
			<Navbar />
			<Grid />
			<Keyboard />
		</div>
	);
};

export default App;

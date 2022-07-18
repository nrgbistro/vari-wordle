import GameGrid from "./components/GameGrid/Grid";
import Keyboard from "./components/Keyboard/Keyboard";
import Navbar from "./components/Navbar";

const App = () => {
	return (
		<div className="h-screen w-screen dark:bg-gray-800 flex flex-col items-center">
			<Navbar />
			<GameGrid wordLength={5} />
			<Keyboard />
		</div>
	);
};

export default App;

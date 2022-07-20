import Grid from "./components/GameGrid/Grid";
import Keyboard from "./components/Keyboard/Keyboard";
import Navbar from "./components/Navbar";

const App = () => {
	return (
		<div className="min-h-screen dark:bg-gray-800 flex flex-col items-center">
			<Navbar />
			<Grid />
			<Keyboard />
		</div>
	);
};

export default App;

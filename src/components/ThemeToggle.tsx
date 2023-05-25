import useDarkMode from "use-dark-mode";
import { BsMoonFill, BsSunFill } from "react-icons/bs";

const ThemeToggle = () => {
	const darkModeConfig = { classNameDark: "dark" };
	const darkMode = useDarkMode(true, darkModeConfig);

	return (
		<button
			onClick={darkMode.toggle}
			className="absolute right-6 top-[10px] text-2xl hoverscale"
		>
			{darkMode.value ? <BsMoonFill /> : <BsSunFill />}
		</button>
	);
};

export default ThemeToggle;

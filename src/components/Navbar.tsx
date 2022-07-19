import ThemeToggle from "./ThemeToggle";

const Navbar = () => (
	<header className="border-b-black/50 border-b-2 h-16 sm:h-18 w-screen">
		<ThemeToggle />
		<h1 className="absolute top-0 left-[50%] -translate-x-[50%] text-4xl font-bold">
			WORDL
		</h1>
	</header>
);

export default Navbar;

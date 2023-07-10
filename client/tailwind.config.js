/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			gridTemplateColumns: {
				"auto-fit": "repeat(auto-fit, minmax(0, 1fr))",
				"auto-fill": "repeat(auto-fit, minmax(0, 1fr))",
			},
			gridTemplateRows: {
				"auto-fit": "repeat(auto-fit, minmax(0, 1fr))",
				"auto-fill": "repeat(auto-fit, minmax(0, 1fr))",
			},
			colors: {
				correct: {
					100: "#538d4e",
					900: "#6aaa64",
				},
				present: {
					100: "#b59f3b",
					900: "#c9b458",
				},
			},
		},
	},
	plugins: [],
	darkMode: "class",
};

module.exports = {
	transform: {
		"^.+\\.(t|j)s$": ["ts-jest", "./tsconfig.json"],
	},
	testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
	testEnvironment: "node",
};

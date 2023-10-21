import { generateNewWord, generateNewWordHelper } from "../src/gameHelpers";

describe("Game Helpers", () => {
	it("generates a word", async () => {
		const word = await generateNewWordHelper();
		expect(typeof word).toBe("string");
	});

	it("generates a word with a new count", async () => {
		const word = await generateNewWord(5, false);
		console.log(word);
		expect(word.length).toBeGreaterThan(3);
		expect(word.length).toBeLessThan(9);
	});
});

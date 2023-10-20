import { generateNewWordHelper } from "../src/gameHelpers";

describe("Game Helpers", () => {
	it("generates a word", async () => {
		const word = await generateNewWordHelper();
		expect(typeof word).toEqual("string");
	});
});

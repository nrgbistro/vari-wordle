import { initializeServer } from "../index";
import type { Server, IncomingMessage, ServerResponse } from "http";
import request from "supertest";

let app: Server<typeof IncomingMessage, typeof ServerResponse>;

beforeAll(async () => {
	try {
		app = await initializeServer(55, false);
	} catch (error) {
		console.error(error);
		throw error;
	}
});

describe("Server Init", () => {
	it("Responds with text", async () => {
		const response = await request(app).get("/");
		expect(response.text).toEqual("Vari-Wordle Backend Up!");
	});

	it("Responds with word", async () => {
		const response = await request(app).get("/api/word");
		expect(typeof response.body.word).toEqual("string");
	});

	it("Responds with validWords", async () => {
		const response = await request(app).get("/api/validWords");
		expect(Array.isArray(response.body)).toEqual(true);
	});
});

afterAll(async () => {
	await new Promise((resolve) => app.close(resolve));
});

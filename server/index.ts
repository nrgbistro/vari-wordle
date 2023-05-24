import cors from "cors";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { validWords, currentWord, wordleCount, gameLoop } from "./gameLogic.js";

const app = express();
const port = process.env.PORT || 3001;

// This displays message that the server running and listening to specified port
app.listen(port, () =>
	console.log(
		`Development server can be accessed here: http://localhost:${port}`
	)
);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, "../build")));

const whitelist = [
	"http://localhost:3000",
	"http://localhost:3001",
	"https://vari-wordle.nrgserver.me/",
];
const corsOptions = {
	origin: (origin: any, cb: any) => {
		if (whitelist.includes(origin) || !origin) {
			cb(null, true);
		} else {
			console.log(`origin: ${origin}`);
			cb(new Error("Not allowd by CORS"));
		}
	},
	optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.get("/api/word", (req, res) => {
	res.json({ word: currentWord, count: wordleCount });
});

app.get("/api/validWords", (req, res) => {
	res.json(validWords);
});

app.get("/", (req, res) => {
	res.sendFile(path.resolve(__dirname, "../build", "index.html"));
});

gameLoop();

const fs = require("fs");
const readline = require("readline");

const rl = readline.createInterface({
	input: fs.createReadStream("./words_alpha.txt"),
	output: process.stdout,
	terminal: false,
});

rl.on("line", (line) => {
	if (line.length >= 4 && line.length <= 8) {
		fs.appendFile("words_filtered.txt", line + ",", function (err) {
			if (err) throw err;
		});
	}
});
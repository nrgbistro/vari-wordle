const supabase = require("./supabase.ts");

async function insert() {
	const res = await supabase
		.from("wordData")
		.insert({ word: "test", count: 2 });
	if (res.error) console.log(res.error);
	console.log(res);
}

insert();

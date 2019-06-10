import fs from "fs";
import path from "path";

export const libraryLists: string = fs.readFileSync(
	path.resolve(__dirname, "lists.pl"),
	"utf-8");

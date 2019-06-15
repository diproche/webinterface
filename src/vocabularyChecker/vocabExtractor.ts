import { anyWord } from "./detectWrongSyntax";

export default function generateVocabList(text: string) {
	return text.match(anyWord);
}

export function printArray<T>(input: T[]) {
	for (const iterator of input) {
		console.log(iterator);
	}
}

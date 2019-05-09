import json from "./AllowedVocab.json";
import Issue from "./Issue";
const anyWord = new RegExp(/\b(\w*\S)\b/g);
const allowedWords = json;
interface Position { fromIndex: number; toIndex: number; }

/**
 * @param text
 * @param invalidWords
 * Returns a map of invalid words (consisted in @param invalidWords) and their corresponding
 * positions (starting position and end position) inside of a string.
 */

export function createMapOfInvalidWords(text: string, invalidWords: string[]): Map<string, [number, number]> {
	const positions = new Map<string, [number, number]>();
	for (const word of invalidWords) {
		positions.set(word, [text.indexOf(word), text.indexOf(word) + word.length - 1]);
	}
	return positions;
}

export function createErrorMessages(text: string, invalidWords: string[]): string|undefined {
	const wrongWords = logInvalidWords(createMapOfInvalidWords(text, invalidWords));
	return wrongWords;
}

export function preprocessText(text: string): string[] {
	return removeDuplicates(collectAllInvalidWords(text));
}

/**
 * The following function is my new idea to replace a huge
 * part of the pipeline. Right now it only finds any word.
 * This needs to be filteres with the words from allowedVocab.json
 */
export function collectAllInvalidWords(text: string): string[] {
	const temp = text.match(anyWord) || [];
	const result: string[] = [];
	temp.forEach(element => {
		if (!allowedWords.includes(element)) {
		result.push(element);
		}
	});
 return result;
}

function removeDuplicates(invalidWords: string[]): string[] {
	return invalidWords.filter((value, item) => invalidWords.indexOf(value) === item);
}

/**
 * (input:) @param invalidWords.
 * Prints out a error message on the console (later to the user),
 * iff there are invalid Words.
 */

function logInvalidWords(invalidWords: Map<string, [number, number]>) {
	return invalidWords.size > 0 ? `${invalidWords.forEach(logMapElement)}` : undefined;
}

export function logMapElement(value: [number, number], key: string): Issue {
	return {message: `${key} an Stelle ${value} ist ein unerlaubtes Wort! \n`,
		position: {
			fromIndex: value[0],
			toIndex: value[1]
		},
		};
	}

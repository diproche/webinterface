import json from "./AllowedVocab.json";
/**
 * Interface containing @param fromIndex: number, @param toIndex: number, @param message: string
 */
import Issue from "./Issue";
/**
 * Regular expression that looks for any and all words. A word is defined as some sequence of
 * characters (\w*S) betweeen wordbarriers (\b)
 */
const anyWord = new RegExp(/\b(\w*\S)\b/g);
/**
 * Predefined dictionary containing all allowed Words
 */
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

/**
 * @param text
 * @param invalidWords
 * Returns message that tells the user which words are not allowed and on which
 * position those are within @param text.
 */
export function createErrorMessages(text: string, invalidWords: string[]): string|undefined {
	const wrongWords = logInvalidWords(createMapOfInvalidWords(text, invalidWords));
	return wrongWords;
}

/**
 * @param text
 * Just a function to bundle the functionalities of @function collectAllInvalidWords and
 * @function removeDuplicates.
 * @returns a Stringarray containing exactly one copy of each wrong word in @param text.
 */
export function preprocessText(text: string): string[] {
	return removeDuplicates(collectAllInvalidWords(text));
}

/**
 * @param text
 * @returns a Stringarray containing every occurrence of each wrong word in @param text.
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

/**
 * @param invalidWords
 * @returns a Stringarray containing the same elements as @param invalidWords
 * minus duplicate elements.
 */
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

/**
 * @param value consisting of value[0], the fromIndex and value[1], the toIndex
 * @param key
 * returns an Issue-like object, telling the user which word is not allowed and on which position it is.
 */

export function logMapElement(value: [number, number], key: string): Issue {
	return {message: `${key} an Stelle ${value} ist ein unerlaubtes Wort! \n`,
		position: {
			fromIndex: value[0],
			toIndex: value[1],
		},
		};
	}

import { Interface } from "readline";
import json from "./AllowedVocab.json";
import Issue from "./Issue";
/**
 * Regular expression that looks for any and all words. A word is defined as some sequence of
 * characters (\w*S) betweeen wordbarriers (\b)
 */
const anyWord = new RegExp(/\b\w+\b/g);
/**
 * Predefined dictionary containing all allowed Words
 */
const allowedWords = json;
export interface Position { fromIndex: number; toIndex: number; }

/**
 * @param text
 * @param invalidWords
 * Returns a map of invalid words (consisted in @param invalidWords) and their corresponding
 * positions (starting position and end position) inside of a string.
 */

export function createMapOfInvalidWords(text: string, invalidWords: string[]): Map<string, Position[]> {
	const positions = new Map<string, Position[]>();
	let pos: Position[] = [];
	for (const word of invalidWords) {
		const temp: Position = {fromIndex: text.indexOf(word), toIndex: (text.indexOf(word) + word.length - 1)};
		pos.push(temp);
		positions.set(word, pos);
		pos = [];
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
export function getInvalidWords(text: string): string[] {
	return removeDuplicates(collectAllInvalidWords(text));
}

/**
 * @param text
 * @returns a Stringarray containing every occurrence of each wrong word in @param text.
 */
export function collectAllInvalidWords(text: string): string[] {
	const words = text.match(anyWord) || [];
	return words.filter(word => !(allowedWords.includes(word)));
}

/**
 * @param invalidWords
 * @returns a Stringarray containing the same elements as @param invalidWords
 * minus duplicate elements.
 */
function removeDuplicates<T>(invalidWords: T[]): T[] {
	return invalidWords.filter((value, item) => invalidWords.indexOf(value) === item);
}

/**
 * (input:) @param invalidWords.
 * Prints out a error message on the console (later to the user),
 * iff there are invalid Words.
 */

function logInvalidWords(invalidWords: Map<string, Position[]>) {
	return invalidWords.size > 0 ? `${invalidWords.forEach(logMapElement)}` : undefined;
}

/**
 * @param value consisting of value[0], the fromIndex and value[1], the toIndex
 * @param key
 * returns an Issue-like object, telling the user which word is not allowed and on which position it is.
 */

export function logMapElement(position: Position, word: string): Issue {
	return {message: `${word} an Stelle ${position.fromIndex} ist ein unerlaubtes Wort! \n`,
		position: {
			fromIndex: position.fromIndex,
			toIndex: position.toIndex,
			},
		};
	}

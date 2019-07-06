import Issue from "../issueHandling/issue";
import { addIssue } from "../issueHandling/issueMapping";
import issueJson from "../issueHandling/knownIssues.json";
import json from "./allowedVocab.json";
import uniqueValues from "./Iterators";

/**
 * Regular expression that looks for any and all words. A word is defined as some sequence of
 * characters (\w+) betweeen wordbarriers (\b)
 */
export const anyWord = new RegExp(/\b\w+\b/g);
/**
 * Predefined dictionary containing all allowed Words
 */
const allowedWords = json;
export interface Position { fromIndex: number; toIndex: number; }

export function collectInvalidWordsInIssues(text: string) {
	const invalidWords = getInvalidWords(text);
	for (const word of invalidWords) {
		if (!(allowedWords.includes(word.toLowerCase()))) {
			const allPositionsOfInvalidWord = getPositionsOfInvalidWord(word, text);
			for (const pos of allPositionsOfInvalidWord) {
				addIssue("INVALID_WORD", pos, {word});
			}
		}
	}
}

export function getPositionsOfInvalidWord(invalidWord: string, text: string): Position[] {
	const result: Position[] = [];
	let offSet: number = 0;

	let foundIndex: number;
	while ((foundIndex = text.indexOf(invalidWord, offSet)) !== -1) {
	console.log(foundIndex);
	offSet = foundIndex + 1;
	result.push({
			fromIndex: foundIndex,
			toIndex: foundIndex + invalidWord.length,
		});
	}
 return result;
}

/**
 * Bundling the functionalities of @function collectAllInvalidWords and
 * @function removeDuplicates.
 * @returns a Stringarray containing exactly one copy of each wrong word in a text.
 */
export function getInvalidWords(text: string): string[] {
	return removeDuplicates(collectAllInvalidWords(text));
}

/**
 * @returns a Stringarray containing every occurrence of each wrong word in a text.
 */
export function collectAllInvalidWords(text: string): string[] {
	const words = text.match(anyWord) || [];
	return words.filter(word => !(allowedWords.includes(word.toLowerCase())));
}

function removeDuplicates<T>(invalidWords: T[]): T[] {
	return Array.from(uniqueValues(invalidWords));
}

/**
 * The next three functions print a Message for every occurence of every invalid word.
 */

export function logMultipleWords(words: string[], positions: Position[]): Issue[][] {
	return words.map(word => logMultipleOccurences(word, positions));
}

export function logMultipleOccurences(word: string, position: Position[]): Issue[] {
	return position.map(pos => logSingleWord(word, pos));
}

export function logSingleWord(word: string, position: Position): Issue {
	return {
		message: `${word} von Stelle ${position.fromIndex} bis ${position.toIndex} ist ein unerlaubtes Wort! \n`,
		position: {
			fromIndex: position.fromIndex,
			toIndex: position.toIndex,
		},
		severity: issueJson.INVALID_WORD.severity,
		code: issueJson.INVALID_WORD.message,
	};
}

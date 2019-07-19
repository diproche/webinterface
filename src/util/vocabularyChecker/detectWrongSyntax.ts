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

/**
 * Adds an Issue for every invalid word.
 * @param text the user-input
 */
export function collectInvalidWordsInIssues(text: string): void {
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

/**
 * Creates a Array of each occurence of a given word in a text.
 * @param invalidWord - A word that is not listed in allowedVocab.json
 * @param text - the userinput
 */
function getPositionsOfInvalidWord(invalidWord: string, text: string): Position[] {
	const result: Position[] = [];
	let offSet: number = 0;

	let foundIndex: number;
	text = " " + text + " ";
	while ((foundIndex = text.indexOf(" " + invalidWord + " ", offSet)) !== -1) {
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
 * Bundling the functionalities of collectAllInvalidWords and removeDuplicates.
 * @returns a Stringarray containing exactly one copy of each wrong word in a text.
 */
export function getInvalidWords(text: string): string[] {
	return removeDuplicates(collectAllInvalidWords(text));
}

/**
 * Collects all words that are invalid.
 * @param text - the userinput
 */
function collectAllInvalidWords(text: string): string[] {
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

function logMultipleOccurences(word: string, position: Position[]): Issue[] {
	return position.map(pos => logSingleWord(word, pos));
}

/**
 * Creates an Issue of one word.
 * @param word - a word that is invalid
 * @param position - the position of the word
 */
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

import Issue, { Severity } from "../checking/issue";
import { IssueCode } from "../checking/issueCodes";
import json from "./allowedVocab.json";
import uniqueValues from "./Iterators";

const vocabularyIssueSeverity = Severity.FatalError;
const vocabIssueCode = IssueCode.VocabularyIssue;

/**
 * Regular expression that looks for any and all words. A word is defined as some sequence of
 * characters (\w+) betweeen wordbarriers (\b)
 */
const anyWord = new RegExp(/\b\w+\b/g);
/**
 * Predefined dictionary containing all allowed Words
 */
const allowedWords = json;
export interface Position { fromIndex: number; toIndex: number; }

/**
 * Takes all wrong words of a text and puts them into an array of Issues.
 * For example: "WrongWord RightWord" should result in an
 * result Issue[] = {message = "wrongWord", position: {fromIndex = 0, toIndex = 9}}
 */

export function getAllIssues(text: string): Issue[] {
	return collectInvalidWordsInIssues(text, collectAllInvalidWords(text));
}

export function collectInvalidWordsInIssues(text: string, invalidWords: string[]): Issue[] {
	const issues = [];
	const positions: Position[] = [];
	for (const word of invalidWords) {
		const temp: Position = {
			fromIndex: text.indexOf(word),
			toIndex: (text.indexOf(word) + word.length),
		};
		positions.push(temp);
		issues.push({
			message: word,
			position: temp,
			severity: vocabularyIssueSeverity,
			code: vocabIssueCode,
		});
	}
	return issues;
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
	return words.filter(word => !(allowedWords.includes(word)));
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
		severity: vocabularyIssueSeverity,
		code: vocabIssueCode,
	};
}

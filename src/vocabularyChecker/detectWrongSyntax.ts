import json from "./AllowedVocab.json";
import Issue from "./Issue";
const anyWord = new RegExp(/\b(\w*\S)\b/g);
const allowedWords = json;
interface Position { fromIndex: number; toIndex: number; }

/**
 * (input:) @param text
 * This method takes the user input as a parameter.
 * At first it prepocesses @param text by calling
 * @function preprocessText thus calls the two
 * functions @function eliminatePunctuation and @function splitIntoWords.
 * For their functionality see the corresponding comments.
 * @function checkInput then filters out all wrong @param word
 * from @param text and puts them all into @param allWrongWords,
 * which is printed in the console log by calling @function logInvalidWords.
 * This is for debugging purposes and should later be changed to
 * be displayed to the user. For further postprocessing all wrong
 * words are collected in a @returns @param invalidWords of
 * @type string array.
 */

export function checkInput(text: string): string[] {
		const preprocessedText: string[] = preprocessText(text);
		const invalidWords = preprocessedText.filter(word => !allowedWords.includes(word));
		// TODO: Make logInvalidWords dependent on this posOfInvalidWords.
		const mapOfInvalidWords = createMapOfInvalidWords(text, invalidWords);
		logInvalidWords(mapOfInvalidWords);
		return invalidWords;
}

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

function preprocessText(text: string) {
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

function removeDuplicates(invalidWords: string[]) {
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

function logMapElement(value: [number, number], key: string) {
	return {message: `${key} an Stelle ${value} ist ein unerlaubtes Wort! \n`,
		startPos: value[0],
		endPos: value[1] };
	}

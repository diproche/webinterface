import json from "./AllowedVocab.json";
import Issue from "./Issue";
const punctuation = new RegExp(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]/g);
const space = new RegExp(/\s+/g);
const allExceptSpace = new RegExp(/^(?!\s*$).+/g);
const allowedWords = json;

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

export function checkInput(text: string) {
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

export function createMapOfInvalidWords(text: string, invalidWords: string[]) {
	const positions = new Map();
	for (const word of invalidWords) {
		positions.set(word, [text.indexOf(word), text.indexOf(word) + word.length - 1]);
	}
	return positions;
}

/**
 * (input:) @param text
 * This method deletes all UNICODE-characters \u2000-\u206F\u2E00-\u2E7F
 * as well as '!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]/. and
 * replaces them with whitespaces. A word is afterwards (in @function splitIntoWords)
 * considered as a substring with has at least a whitespace on the right
 * or on the left.
 * The exact symbols that can be deleted may have to be overthought,
 * since brackets, commas and fullstops seem to be necessary to make the user input Prolog-readable.
 */

export function eliminatePunctuation(text: string) {
		return text.replace(punctuation, " ").replace(space, " ");
}

/**
 * (input:) @param text
 * This method first deletes and leading or trailing whitespaces off of the
 * input string. It then calls @function findSpacePositionsInStringArray, to
 * create an array containing the positions where a new word begins.
 * Currently this adds a whitespace to every word after the first one.
 * After doing some corrections to the text, the method @returns @param result,
 * which is an array containing as entries the single words filtered out
 * of the text.
 */

export function splitIntoWords(text: string) {
		text = text.trim();
		const spacePositions = findSpacePositionsInStringArray(text);
		let tempPos = 0;
		const result: string[] = [];
				// this loop is problematic. Adds a whitespace to the beginning of each word after the second one.
		spacePositions.forEach(element => {
				result.push(text.substring(tempPos, element));
				tempPos = element;
		});
						// the substring after the last whitespace seems to miss, if this substring is not empty. Fix in next line.
		if (text.substring(spacePositions[spacePositions.length - 1], text.length) !== " ") {
		result.push(text.substring(spacePositions[spacePositions.length - 1], text.length));
		}
		for (let index = 0; index < result.length; index++) {
				if (result[index].startsWith(" ")) {
						result[index] = result[index].substring(1, result[index].length); // delete the wrong whitespaces in the beginning
				}
		}
		if (!text.replace(/\s/g, "").length) {
			return [];
		}
		return result;
}

/**
 * (input:) @param text
 * Just a function bundling @function eliminatePunctuation and
 * @function splitIntoWords together for better readibility
 * and in case, those two methods need to be called more
 * often in conjunction.
 */

function preprocessText(text: string) {
	return removeDuplicates(splitIntoWords(eliminatePunctuation(text)));
}

/**
 * Collects all positions where there is a whitespace in a string.
 */

function findSpacePositionsInStringArray(text: string) {
	let index = 0;
	const spacePositions = [];
	while ((index = text.indexOf(" ", index + 1)) > 0) {
			spacePositions.push(index);
	}
	return spacePositions;
}

/**
 * (input:) @param invalidWords.
 * Prints out a error message on the console (later to the user),
 * iff there are invalid Words.
 */

function logInvalidWords(invalidWords: Map<string, [number, number]>) {
	return invalidWords.size > 0 ? `${invalidWords.forEach(logMapElement)}` : undefined;
}

function removeDuplicates(invalidWords: string[]) {
	return invalidWords.filter((value, item) => invalidWords.indexOf(value) === item);
}

function logMapElement(value: [number, number], key: string, map: Map<string, [number, number]>) {
	return {message: `${key} an Stelle ${value} ist ein unerlaubtes Wort! \n`,
		startPos: value[0],
		endPos: value[1] };
	}

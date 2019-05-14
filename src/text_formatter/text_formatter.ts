import { formatExpressionElements, replaceInputCaractersToReadablePrologCharacter } from "./allowed_Expression_Detectors";

/**
* format the input of a user into a full list of senteces including a list of words, formatted expressions, and paragraph marker
* ---------------------------------------
* @param
* @return
*
*/

// List of Separators that are used to format the whole input into lists;
const inputSeparator = /([.!?$]|\n)+/g;                                      // List all the values the input will get splitted; \n will split paragraphs, $ will split expressions, the rest split sentences
const wordSeparator = /[ ,]+/; // List all the values where the content of a sentence will get splitted: whitespace[ ] and comma[,]
const expressionSeparator = /[,]+/g; // expression elements get splitted at each comma;

export function textFormatter(input: String) {

	input = input.replace("$", "$EXPRESSIONMARKER");                            // prepare expressionsdetector; this is needed as marker to finde the expressions after the $ disappear by calling the split-method

	const splittedText = input.split(inputSeparator);
	const formattedText = [];                                           //  |optional
	for (let index = 0; index < splittedText.length; index++) {
		let element = splittedText[index];                            // whitespaces between sentences are not needed

		// if (element.match(/[$]/g)) {
		if (element.match(/(EXPRESSIONMARKER)/g)) {						   // DETECT AND ADD EXPRESSIONS TO LIST
			element = element.replace("EXPRESSIONMARKER", "");
			const formattedExpression = expressionFormatter(element);
			formattedText.push(formattedExpression);
		} else if (element.match(/\n/)) {										// detect paragraphs in build a own empty list for them
			formattedText.push([]);
		} else if (element.match(/([A-Za-zäöü]+)/g)) {						// If words are detected build a List of it;
			const ListOfWords = sentenceIntoWordList(element.trim());
			formattedText.push(ListOfWords);
		}

	}
	return formattedText;
}

/**
 * format the words from a sentence-string into a list of words
 * ---------------------------------------
 * @param a string including words
 * @return a string-array where each element is one word
 */
export function sentenceIntoWordList(input: String) {

	const splittedSentenceIntoListOfWords = input.split(wordSeparator);
	const listOfWords = [];
	for (let index = 0; index < splittedSentenceIntoListOfWords.length; index++) {
		if (splittedSentenceIntoListOfWords[index].trim() == "") {	// remove all elements(senteces) which are a empty String after splitting
			splittedSentenceIntoListOfWords.splice(index, 1);
		} else {
			listOfWords.push(splittedSentenceIntoListOfWords[index].trim());
		}
	}
	return listOfWords;

}

/**
* this function is the formatter for expressions; it calls "formatExpressionElements", "removeWhiteSpaces" and "replaceInputCaractersToReadablePrologCharacter";
* ---------------------------------------
* @param a input string of an expression where all operator has been formatted
* @return a string array where each element is a element of the expression
*/
export function expressionFormatter(input: string) {
	const detectedExpression = formatExpressionElements(input);

	const splittedExpression = detectedExpression.split(expressionSeparator);
	const expression = [];
	for (let index = 0; index < splittedExpression.length; index++) {
		let tempString = removeWhiteSpaces(splittedExpression[index]);
		if (tempString !== "") {
			tempString = replaceInputCaractersToReadablePrologCharacter(tempString);
			expression.push(tempString);
		}
	}
	return expression;
}

/**
* remove every type of whitespace inside the expression
* ---------------------------------------
* @param a string
* @return same string without any whitespaces left
*/
export function removeWhiteSpaces(input: string) {
	const output = input.replace(/\s+/g, ""); // delete all white spaces
	return output;
}




/**
* check the expression if the amount of opened and closed brackets is correct; it can detect user mistakes; RETURN true if the user made a mistake;
* ---------------------------------------
* @param
* @return
*/
export function detectBracketErrors(formattedExpression: string[]) {
	let bracketCount = 0;
	let index = 0;
	while (index < formattedExpression.length && bracketCount >= 0) {

		if (formattedExpression[index].match(/(\[|bracketLeft)/)) {
			bracketCount++;
		} else if (formattedExpression[index].match(/(\]|bracketRight)/)) {
			bracketCount--;
		}
		index++;
	}
	if (bracketCount > 0) {
		// THROW EXCEPTION HERE: Bracket Error; some brackets are not closed;
		return true;
	} else if (bracketCount < 0) {
		// THROW EXCEPTION HERE: Bracket Error; too much brackets has been closed or has been closed to early;
		return true;
	}
	return false;
}


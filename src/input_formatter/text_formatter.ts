import { expressionFormatter } from "./expression_formatter";

/**
	* format the input of a user into a full list of senteces including a list of words,
	* formatted expressions, and paragraph marker
	* ---------------------------------------
	* @param
	* @return
	*
	*/

// List of Separators that are used to format the whole input into lists;
// List all the values the input will get splitted; \n will split paragraphs,
// $ will split expressions, the rest split sentences
const inputSeparator = /([.!?$]|\n)+/g;
// List all the values where the content of a sentence will get splitted: whitespace[ ] and comma[,]
const wordSeparator = /[ ,]+/;

export function textFormatter(input: string) {
	// prepare expressionsdetector; this is needed as marker to finde the expressions
	// after the $ disappear by calling the split - method
	input = input.replace("$", "$EXPRESSIONMARKER");

	const splittedText = input.split(inputSeparator);
	const formattedText = [];                                           //  |optional
	for (let element of splittedText) {
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
export function sentenceIntoWordList(input: string) {

	const splittedSentenceIntoListOfWords = input.split(wordSeparator);
	const listOfWords: string[] = [];
	for (let index = 0; index < splittedSentenceIntoListOfWords.length; index++) {
		if (splittedSentenceIntoListOfWords[index].trim() === "") {
			// remove all elements(senteces) which are a empty String after splitting
			splittedSentenceIntoListOfWords.splice(index, 1);
		} else {
			listOfWords.push(splittedSentenceIntoListOfWords[index].trim());
		}
	}
	return listOfWords;

}

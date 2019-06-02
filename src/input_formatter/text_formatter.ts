import { expressionFormatter } from "./expression_formatter";

const inputSeparator = /([.!?$]|\n)+/g;
const wordSeparator = /[ ,]+/;

export function textFormatter(input: string) {
	// prepare expressionsdetector; this is needed as marker to finde the expressions
	// after the $ disappear by calling the split - method
	input = input.replace("$", "$EXPRESSIONMARKER");

	const splittedText = input.split(inputSeparator);
	const formattedText = [];
	for (let element of splittedText) {
		if (element.match(/(EXPRESSIONMARKER)/g)) {
			element = element.replace("EXPRESSIONMARKER", "");
			const formattedExpression = expressionFormatter(element);
			formattedText.push(formattedExpression);
		} else if (element.match(/\n/)) {
			formattedText.push([]);
		} else if (element.match(/([A-Za-zäöüß]+)/g)) {
			//} else if (element.match(/\b\w+\b/g)) {

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
			splittedSentenceIntoListOfWords.splice(index, 1);
		} else {
			listOfWords.push(splittedSentenceIntoListOfWords[index].trim());
		}
	}
	return listOfWords;

}

import { expressionFormatter } from "./expression_formatter";

const inputSeparator = /([.!?]|\n|\$[^$]*\$)+/g;
const wordSeparator = /[ ,]+/;

/**
 * this functions is the main function to format the full input string
 * into a Array of string[]
 * @param input from user
 * @return the formatted text as a Array of string[] inculding
 * formatted expressions, list of words (setences) and paragraph marker (empty Array)
 */
export function textFormatter(input: string): string[][] {
	const splittedText = input.split(inputSeparator);
	const formattedText = [];
	let position: number = 0;
	for (const element of splittedText) {
		position = position + element.length;
		if (element.match(/(\$)/g)) {
			const formattedExpression = expressionFormatter(element, position);
			formattedText.push(formattedExpression);
		} else if (element.match(/\n/)) {
			formattedText.push([]);
		} else if (element.match(/([A-Za-zäöüß]+)/g)) {
			const ListOfWords = sentenceIntoWordList(element.trim());
			formattedText.push(ListOfWords);
		}
	}
	return formattedText;
}

/**
 * format the words from a sentence-string into a list of words
 * @param a string including words
 * @return a string[] where each element is one word
 */
export function sentenceIntoWordList(input: string): string[] {
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

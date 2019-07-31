import { expressionFormatter } from "./expressionFormatter";
import { Regexes } from "./regexes";

/**
 * this functions is the main function to format the full input string
 * into a Array of string[]
 * @param input from user
 * @return the formatted text as a Array of string[] inculding
 * formatted expressions, list of words (setences) and paragraph marker (empty Array)
 */
export function textFormatter(input: string): string {
	let splittedSentence: string[] = input.split(Regexes.inputSeparator);
	splittedSentence = splittedSentence.filter(x => x);
	const formattedText: string[][] = [];
	let position: number = 0;
	splittedSentence.forEach(element => {
		if (element.match(Regexes.annotationMarker)) {
			formattedText.push([element]);
		} else if (element.match(Regexes.paragraphMarker)) {
			formattedText.push(["abs"]);
		} else if (element.match(Regexes.expressionMarker)) {
			let formattedSentence: string = "";
			let splittedElement: string[] = element.split(Regexes.expressionSeparator);
			splittedElement = splittedElement.filter(x => x);
			splittedElement.forEach(innerElement => {
				if (innerElement.match(Regexes.expressionMarker)) {
					const formattedExpression: string = expressionFormatter(innerElement, position);
					formattedSentence = formattedSentence + formattedExpression + ",";
				} else if (innerElement.match(Regexes.wordMarker)) {
					const ListOfWords: string = sentenceIntoWordList(innerElement.trim());
					formattedSentence = formattedSentence + ListOfWords + ",";
				}
			});
			if (formattedSentence.match(Regexes.wordEndsWithComma)) {
				formattedSentence = formattedSentence.slice(0, formattedSentence.length - 1);
			}
			formattedText.push([formattedSentence]);
		} else if (element.match(Regexes.wordMarker)) {
			const ListOfWords: string = sentenceIntoWordList(element.trim());
			formattedText.push([ListOfWords]);
		}
		position = position + element.length;
	});
	const output = formattedTextIntoString(formattedText);
	return output;
}

/**
 * format the words from a sentence-string into a list of words
 * @param input string including words
 * @return a string[] where each element is one word
 */
export function sentenceIntoWordList(input: string): string {
	const splittedSentenceIntoListOfWords = input.split(Regexes.wordSeparator);
	const listOfWords: string[] = [];
	for (let index = 0; index < splittedSentenceIntoListOfWords.length; index++) {
		if (splittedSentenceIntoListOfWords[index].trim() === "") {
			splittedSentenceIntoListOfWords.splice(index, 1);
		} else {
			listOfWords.push(splittedSentenceIntoListOfWords[index].trim());
		}
	}
	let listOfWordsString = "";
	listOfWords.forEach(element => {
		listOfWordsString = listOfWordsString + element + ",";
	});
	if (listOfWordsString.match(Regexes.wordEndsWithComma)) {
		listOfWordsString = listOfWordsString.slice(0, listOfWordsString.length - 1);
	}

	return listOfWordsString;
}

/**
 * Returns a string which consists of the formatted text.
 */
export function formattedTextIntoString(formattedText: string[][]): string {
	let output = "[";
	formattedText.forEach(element => {
		output = output + "[";
		element.forEach(innerElement => {
			innerElement = innerElement.toLowerCase();
			if (innerElement.match(Regexes.bracketLeft)) {
				output = output + innerElement;
			} else if (innerElement.match(Regexes.bracketRight)) {
				if (output.match(Regexes.wordEndsWithComma)) {
					output = output.slice(0, output.length - 1);
				}
				output = output + innerElement + ",";
			} else {
				output = output + innerElement + ",";
			}
		});
		if (output.match(Regexes.wordEndsWithComma)) {
			output = output.slice(0, output.length - 1);
		}
		output = output + "],";
	});
	if (output.match(Regexes.wordEndsWithComma)) {
		output = output.slice(0, output.length - 1);
	}
	output = output + "]";

	return output;
}

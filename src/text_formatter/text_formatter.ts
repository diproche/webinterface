import { newExpression, stringLiteral } from "@babel/types";
import { elementType } from "prop-types";
import React, { Component } from "react";
import { createPortal } from "react-dom";
import { ProofEditor } from "../components/proofEditor/proofEditor";
import { detectExpressionElements } from "./allowed_Expression_Detectors";


/**
 * --------------------------------------
 * @author: Ronja K.
 * ---------------------------------------
 */


/**
* format the input of a user into a full list of senteces including a list of words, formatted expressions, and paragraph marker
* ---------------------------------------
* @param //{string} n - A string param
* @return //{string} A good string
*
*/
export function textToListFormat(input: String) {

	input = input.replace("$", "$EXPRESSIONMARKER");                            // prepare expressionsdetector; this is needed as marker to finde the expressions after the $ disappear by calling the split-method
	//input = input.replace("\n", "\nPARAGRAPHMARKER.");                         // prepare paragraphmarker

	const separator = /([.!?$]|\n|$)+/g;
	//const separator = /(\n|\.|\!|\?|\$)+/g;                                              // List all the values the input will get splitted; \n will split paragraphs, $ will split expressions, the rest split sentences

	const splittedText = input.split(separator);
	const listOfLists = [];
	//let sentenceCount = 0;                                                  //  |optional
	//let expressionCount = 0;                                                //  |optional                                             //  |optional
	for (let index = 0; index < splittedText.length; index++) {
		let element = splittedText[index];                            // whitespaces between sentences are not needed

		//if (element.match(/[$]/g)) {
		if (element.match(/(EXPRESSIONMARKER)/g)) {						   // DETECT AND ADD EXPRESSIONS TO LIST
			//listOfLists.push("Expression_" + (expressionCount + 1));           //  |optional
			//expressionCount++;                                          //  |optional
			element = element.replace("EXPRESSIONMARKER", "");
			const formattedExpression = expressionFormatter(element);
			listOfLists.push(formattedExpression);
		}
		else if (element.match(/\n/)) {										//detect ans mark paragraphs in a own List
			listOfLists.push([]);
		}
		else if (element.match(/([A-Za-zäöü]+)/g)) {						// If words are detected build a List of it;
			//listOfLists.push("Sentence_" + (sentenceCount + 1));             // |optional
			//sentenceCount++;                                            	 // |optional
			const ListOfWords = sentenceIntoWordList(element.trim());
			listOfLists.push(ListOfWords);
		}


	}
	const listFormat = listOfLists;
	return listFormat;
}

//(/[A-Za-zäöü]+/g) //scan for words


/**
 * format the words from a sentence-string into a list of words
 * ---------------------------------------
 * @param
 * @return
 */
export function sentenceIntoWordList(input: String) {
	const separator = /[ ,]+/; // List all the values where the content of a sentence will get splitted: whitespace[ ] and comma[,]
	const splittedSentenceIntoListOfWords = input.split(separator);
	const temp = [];
	for (let index = 0; index < splittedSentenceIntoListOfWords.length; index++) {
		// remove all elements(senteces) which are a empty String after splitting
		if (splittedSentenceIntoListOfWords[index].trim() == "") {
			splittedSentenceIntoListOfWords.splice(index, 1);
		} else {
			temp.push(splittedSentenceIntoListOfWords[index].trim());
		}
	}
	const ListOfWords = temp;
	return ListOfWords;

}

/**
* this function is the formatter for expressions; it calls "detectExpressionElements", "removeWhiteSpaces" and "replaceInputCaractersToReadablePrologCharacter";
* ---------------------------------------
* @param
* @return
*/
export function expressionFormatter(input: string) {
	const detectedExpression = detectExpressionElements(input);
	const separators = /(bracketLeft|bracketRight|equivalence|implication|negation|conjunction|disjunction)+/g;
	const splittedExpression = detectedExpression.split(separators);
	const temp = [];
	for (let index = 0; index < splittedExpression.length; index++) {
		let tempString = removeWhiteSpaces(splittedExpression[index]);
		if (tempString !== "") {
			tempString = replaceInputCaractersToReadablePrologCharacter(tempString);
			temp.push(tempString);
		}
	}
	const finalExpressionArray = temp;
	return finalExpressionArray;
}



/**
* remove every type of whitespace inside the expression
* ---------------------------------------
* @param
* @return
*/
export function removeWhiteSpaces(input: string) {
	const output = input.replace(/\s+/g, ""); // delete all white spaces
	//const output = input.replace(/(?!\n)\s/g, "");

	return output;
}

/**
* replace expression elements into readable prolog Code
* ---------------------------------------
* @param
* @return
*/

export function replaceInputCaractersToReadablePrologCharacter(input: string) {
	input = input.replace(/(bracketLeft)/g, "\[");
	input = input.replace(/(bracketRight)/g, "\]");
	input = input.replace(/(equivalence)/g, "<->");
	input = input.replace(/(implication)/g, "->");
	input = input.replace(/(negation)/g, "neg");
	input = input.replace(/(conjunction)/g, "and");
	input = input.replace(/(disjunction)/g, "or");
	return input;
}

/**
* check the expression if the amount of opened and closed brackets is correct; it can detect user mistakes; RETURN true if the user made a mistake;
* ---------------------------------------
* @param
* @return
*/
export function checkAmountOfBrackets(formattedExpression: string[]) {
	let bracketLeftCount = 0;
	let bracketRightCount = 0;
	formattedExpression.forEach(element => {
		if (element.match(/(\[)/)) {
			bracketLeftCount++;
		}
		if (element.match(/(\])/)) {
			bracketRightCount++;
		}
	});
	if (bracketLeftCount !== bracketRightCount) {
		if (bracketLeftCount > bracketRightCount) {
			const numberOfForgottenRightBrackets = bracketLeftCount - bracketRightCount;
			// THROW EXCEPTION HERE;
			// "USER FORGOT TO CLOSE numberOfForgottenRightBrackets "
			return true;
		} else {
			const numberOfForgottenLeftBrackets = bracketRightCount - bracketLeftCount;
			// THROW EXCEPTION HERE;
			// "USER FORGOT TO OPEN numberOfForgottenLeftBrackets "
			return true;
		}
	}
	return false;
}


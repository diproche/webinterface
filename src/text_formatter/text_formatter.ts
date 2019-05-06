import { newExpression, stringLiteral } from "@babel/types";
import { elementType } from "prop-types";
import React, { Component } from "react";
import { createPortal } from "react-dom";
import { ProofEditor } from "../components/proofEditor/proofEditor";

// --------------------------------------
// @author: Ronja K.
// ---------------------------------------

// ---------format the input of a user into a full list of senteces including a list of words, formatted expressions, and paragraph marker-------
export function textToListFormat(input: String) {

	input = input.replace("$", "$EXPRESSIONMARKER");                            // prepare expressionsdetector; this is needed as marker to finde the expressions after the $ disappear by calling the split-method
	input = input.replace("\n", "\n PARAGRAPHMARKER.");                         // prepare paragraphmarker

	const separator = /[\n.!?$]+/;                                              // List all the values the input will get splitted; \n will split paragraphs, $ will split expressions, the rest split sentences

	const splittedText = input.split(separator);
	const temp = [];
	// let sentenceCount = 0;                                                  //  |optional
	// let expressionCount = 0;                                                //  |optional
	// let paragraphCount = 0;                                                 //  |optional
	for (let index = 0; index < splittedText.length; index++) {
		let element = splittedText[index].trim();                               // whitespaces between sentences are not needed
		if (element != "") {

			if (element.match(/(EXPRESSIONMARKER)/)) {						   // DETECT AND ADD EXPRESSIONS TO LIST
				// temp.push("Expression_" + (expressionCount + 1));           //  |optional
				// expressionCount++;                                          //  |optional
				element = element.replace("EXPRESSIONMARKER", "");
				const formattedExpression = expressionFormatter(element);
				temp.push(formattedExpression);
			} else if (element.match(/(PARAGRAPHMARKER)/)) {				   // DETECT AND ADD PARAGRAPH TO LIST
				// temp.push("Paragraph_" + (paragraphCount + 1));             // |optional
				// paragraphCount = 0;                                         // |optional
				element = element.replace("PARAGRAPHMARKER", "abs");
				const ListWithparagraph = [];										// store paragraph marker in a own list
				ListWithparagraph.push(element);
				temp.push(ListWithparagraph);
			} else {															// DETECT AND ADD WORDS TO LIST
				// temp.push("Sentence_" + (sentenceCount + 1));                // |optional
				// sentenceCount++;                                             // |optional
				const ListOfWords = sentenceIntoWordList(element);
				temp.push(ListOfWords);
			}

		}

	}
	const listFormat = temp;
	return listFormat;
}

// ---------format the words from a sentence-string into a list of words-------
export function sentenceIntoWordList(input: String) {
	const separator = /[ ,$]+/; // List all the values where the content of a sentence will get splitted: whitespace[ ] and comma[,]
	const splittedSentenceIntoListOfWords = input.split(separator);
	const temp = [];
	const index = 0;
	for (let index = 0; index < splittedSentenceIntoListOfWords.length; index++) {
		// remove all elements(senteces) which are a empty String after splitting
		if (splittedSentenceIntoListOfWords[index] == "") {
			splittedSentenceIntoListOfWords.splice(index, 1);
		} else {
			const word = splittedSentenceIntoListOfWords[index].trim();
			word.trim();
			splittedSentenceIntoListOfWords[index] = word;
			temp.push(splittedSentenceIntoListOfWords[index]);
		}
	}
	const ListOfWords = temp;
	return ListOfWords;

}
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

// ---------CurrentExpressionDetector------------
// ---------every element have their own detect-function--------
export function detectExpressionElements(input: string) {
	input = detectBracketLeft(input);
	input = detectBracketRight(input);
	input = detectEquivalence(input);
	input = detectImplication(input);
	input = detectImplication(input);
	input = detectNegation(input);
	input = detectConjunction(input);
	input = detectDisjunction(input);
	return input;
}

export function removeWhiteSpaces(input: string) {
	const output = input.replace(/\s+/g, ""); // delete all white spaces
	return output;
}




export function detectBracketLeft(input: string) {
	input = input.replace(/(\[|\()/g, " bracketLeft ");
	return input;
}

export function detectBracketRight(input: string) {
	input = input.replace(/(\]|\))/g, " bracketRight ");
	return input;
}

export function detectEquivalence(input: string) {

	input = input.replace(/(<-->|<==>|<=>|<->)/g, " equivalence ");
	return input;
}

export function detectImplication(input: string) {
	input = input.replace(/(->|-->|=>|==>)/g, " implication ");
	return input;
}

export function detectNegation(input: string) {
	input = input.replace(/(neq|NEQ|Neq|NOT|Not|not|NICHT|Nicht|nicht|¬)/g, " negation ");
	return input;
}

export function detectConjunction(input: string) {
	input = input.replace(/(and|And|AND|und|Und|UND|&|∧)/g, " conjunction ");
	/*input = input.replace(/And/g, " conjunction ");
	input = input.replace(/AND/g, " conjunction ");
	input = input.replace(/und/g, " conjunction ");
	input = input.replace(/Und/g, " conjunction ");
	input = input.replace(/UND/g, " conjunction ");
	input = input.replace(/&/g, " conjunction ");
	input = input.replace(/∧/g, " conjunction ");
	*/
	return input;
}

export function detectDisjunction(input: string) {
	input = input.replace(/(or|Or|OR|oder|Oder|ODER|\||∨)/g, " disjunction ");
	/*	input = input.replace(/Or/g, " disjunction ");
		input = input.replace(/OR/g, " disjunction ");
		input = input.replace(/oder/g, " disjunction ");
		input = input.replace(/Oder/g, " disjunction ");
		input = input.replace(/ODER/g, " disjunction ");
		input = input.replace(/[|]+/g, " disjunction ");
		input = input.replace(/∨/g, " disjunction ");
		*/
	return input;
}

// --------replace expression elements into readable prolog Code---------
export function replaceInputCaractersToReadablePrologCharacter(input: string) {
	//input = detectExpressionElements(input);
	input = input.replace(/(bracketLeft)/g, "\[");
	input = input.replace(/(bracketRight)/g, "\]");
	input = input.replace(/(equivalence)/g, "<->");
	input = input.replace(/(implication)/g, "->");
	input = input.replace(/(negation)/g, "neg");
	input = input.replace(/(conjunction)/g, "and");
	input = input.replace(/(disjunction)/g, "or");
	return input;
}


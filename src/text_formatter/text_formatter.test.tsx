import React from "react";
import ReactDOM from "react-dom";

// --------------------------------------
// @author: Ronja K.
// ---------------------------------------
// IMPORT FUNCTIONS
import {textToListFormat, sentenceIntoWordList, functionFormatter,removeWhiteSpaces} from "./text_formatter";

// ---------------------------------------
// TESTS FOR SPLITTING TEXT
// ---------------------------------------
/*test("Test splitting full text into List of sentences: ", () => {
	const result = textToSentencesList("Hello, this is a test! Is it Working? I hope so.");
	const expectedResult = ["Hello, this is a test", "Is it Working", "I hope so"];
	expect(result).toEqual(expectedResult);
});*/

test("Test splitting a single sentences into List of words: ", () => {
	const result = sentenceIntoWordList("Hello, this is a test");
	const expectedResult = ["Hello", "this", "is", "a", "test"];
	expect(result).toEqual(expectedResult);
});


test("Test splitting full text into full listFormat excluding expressions: ", () => {
	const result = textToListFormat("Hello, this is a test! Is it Working? I               hope so. \n Here is also a expression: $[A UND [B <==> C] -> D ODER NOT E]$");
	const expectedResult = [["Hello", "this", "is", "a", "test"], ["Is", "it", "Working"], ["I", "hope", "so"],["abs"], ["Here", "is", "also", "a", "expression:"],["[", "A", "UND", "[", "B", "<==>", "C", "]", "->", "D", "ODER", "NOT", "E", "]"]];
	//expect(result).toEqual(expectedResult);
	expect(result).toEqual(expectedResult);
});

// ---------------------------------------
// TESTS FOR EXPRESSIONS-LOGIK
// ---------------------------------------


test("Test white Space remover between expressions.", () => {
	const result = removeWhiteSpaces("(5 + 6       = 11=>89F  allFOR, orf <-> test*h)");
	const expectedResult = "(5+6=11=>89FallFOR,orf<->test*h)";
	expect(result).toEqual(expectedResult);
});

// TO DO
test("Test if a expression is splitted correctly: [A UND B <==> C -> D ODER NOT E]]", () => {
	const result = functionFormatter("[A UND [B<==>C  ]   ->D ODER NOTE]");
	const expectedResult = ["[", "A", "UND", "[", "B", "<==>", "C", "]", "->", "D", "ODER", "NOT", "E", "]"];
	expect(result).toEqual(expectedResult);
});

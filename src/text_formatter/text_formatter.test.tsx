import React from "react";
import ReactDOM from "react-dom";

// --------------------------------------
// @author: Ronja K.
// ---------------------------------------
// IMPORT FUNCTIONS
//import { detectExpressionElements, textToListFormat, sentenceIntoWordList, expressionFormatter, removeWhiteSpaces, replaceInputCaractersToReadablePrologCharacter } from "./text_formatter";
import { textToListFormat, sentenceIntoWordList, detectExpressionElements, replaceInputCaractersToReadablePrologCharacter, removeWhiteSpaces, expressionFormatter } from "./text_formatter";

// ---------------------------------------
// TESTS FOR SPLITTING TEXT
// ---------------------------------------

test("Test: splitting a single sentences into List of words: ", () => {
	const result = sentenceIntoWordList("Hello, this is a test");
	const expectedResult = ["Hello", "this", "is", "a", "test"];
	expect(result).toEqual(expectedResult);
});



// ---------------------------------------
// TESTS FOR EXPRESSIONS-LOGIK
// ---------------------------------------
test("Test if the elements of a expression is detected correctly:", () => {
	const result = detectExpressionElements("[AUNDTest[B<==>C]->DODERNOTNOTE]");
	const expectedResult = " bracketLeft A conjunction Test bracketLeft B equivalence C bracketRight  implication D disjunction  negation  negation E bracketRight ";
	expect(result).toEqual(expectedResult);
});

test("replace detected expression-elements into readable prolog commands", () => {
	const result = replaceInputCaractersToReadablePrologCharacter("bracketLeft A conjunction RANDOMTEXTHERE bracketLeft B equivalence C bracketRight bracketRight");
	const expectedResult = "[ A and RANDOMTEXTHERE [ B <-> C ] ]";
	expect(result).toEqual(expectedResult);
});




test("Test: white Space remover between expressions.", () => {
	const result = removeWhiteSpaces("(5 + 6       = 11=>89F  allFOR, orf <-> test*h)");
	const expectedResult = "(5+6=11=>89FallFOR,orf<->test*h)";
	expect(result).toEqual(expectedResult);
});

test("Test: splitting full text into full listFormat including expressions and paragraph marker: ", () => {
	const result = textToListFormat("Hello, this is a test! Is it Working? I               hope so. \n Here is also a expression: $[A UND [B <==> C] -> D ODER NOT E]$");
	const expectedResult = [["Hello", "this", "is", "a", "test"], ["Is", "it", "Working"], ["I", "hope", "so"], ["abs"], ["Here", "is", "also", "a", "expression:"], ["[", "A", "and", "[", "B", "<->", "C", "]", "->", "D", "or", "neg", "E", "]"]];
	expect(result).toEqual(expectedResult);
});


//-------TO DO: count if amount of brackets is correct---------
//-------TO DO: format expressions into prolog format----------
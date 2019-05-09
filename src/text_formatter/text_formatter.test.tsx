
/**
 * --------------------------------------
 * @author: Ronja K.
 * ---------------------------------------
 */

// IMPORTS
import { textToListFormat, sentenceIntoWordList, replaceInputCaractersToReadablePrologCharacter, removeWhiteSpaces, checkAmountOfBrackets } from "./text_formatter";
import { detectExpressionElements } from "./allowed_Expression_Detectors";

test("splitting a single sentences into List of words: ", () => {
	const result = sentenceIntoWordList("Hello, this is a test");
	const expectedResult = ["Hello", "this", "is", "a", "test"];
	expect(result).toEqual(expectedResult);
});

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

test("white Space remover between expressions.", () => {
	const result = removeWhiteSpaces("(5 + 6       = 11=>89F  allFOR, orf <-> test*h)");
	const expectedResult = "(5+6=11=>89FallFOR,orf<->test*h)";
	expect(result).toEqual(expectedResult);
});

test("splitting full text into full listFormat including expressions and paragraph marker: ", () => {
	const result = textToListFormat("Hello, this is a test! Is it Working? I               hope so. \n Paragraphs are marked with an empty List: \n \n \n Here is also an expression: $[A UND [B <==> C] -> D ODER NOT E]$");
	const expectedResult = [["Hello", "this", "is", "a", "test"], ["Is", "it", "Working"], ["I", "hope", "so"], [], ["Paragraphs", "are", "marked", "with", "an", "empty", "List:"], [], [], [], ["Here", "is", "also", "an", "expression:"], ["[", "A", "and", "[", "B", "<->", "C", "]", "->", "D", "or", "neg", "E", "]"]];
	expect(result).toEqual(expectedResult);
});

test("count if amount of brackets is correct.", () => {
	const bracketList = ["[", "]", "[", "[", "]", "[", "]", "]"];
	const result = checkAmountOfBrackets(bracketList);
	const expectedResult = false;
	expect(result).toEqual(expectedResult);
});

test("if amount of left and right brackets are different.", () => {
	const bracketList = ["[", "[", "[", "[", "[", "]", "]"];
	const result = checkAmountOfBrackets(bracketList);
	const expectedResult = true;
	expect(result).toEqual(expectedResult);
});

//-------TO DO: format expressions into prolog format----------2
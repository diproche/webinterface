// IMPORTS
import { preFormatExpressionFromImput, replaceExpressionElementsIntoPrologCode, detectBracketErrors} from "./expression_formatter";
import { sentenceIntoWordList, textFormatter } from "./text_formatter";

test("splitting a single sentences into List of words: ", () => {
	const result = sentenceIntoWordList("Hello, this is a test");
	const expectedResult = ["Hello", "this", "is", "a", "test"];
	expect(result).toEqual(expectedResult);
});

test("Test if the elements of a expression is detected and formatted correctly:", () => {
	const result = preFormatExpressionFromImput("[AUNDTest[B<==>C]->DODERNOTNOTE]");
	const expectedResult = ["bracketLeft", "A", "conjunction","Test", "bracketLeft", "B", "equivalence", "C", "bracketRight", "implication", "D", "disjunction", "negation", "negation", "E", "bracketRight"];
	expect(result).toEqual(expectedResult);
});

test("replace detected expression-elements into readable prolog commands", () => {
	const result = replaceExpressionElementsIntoPrologCode(["bracketLeft", "A", "conjunction", "RANDOMTEXTHERE", "bracketLeft", "B", "equivalence", "C", "bracketRight", "bracketRight"]);
	const expectedResult = ["[", "A", "and", "RANDOMTEXTHERE", "[", "B", "<->", "C", "]", "]"];
	expect(result).toEqual(expectedResult);
});

test("splitting full text into full listFormat including expressions and paragraph marker: ", () => {
	const result = textFormatter("Hello, this is a test! Is it Working? I               hope so. \n Paragraphs are marked with an empty List: \n \n \n Here is also an expression: $[A UND [B <==> C] -> D ODER NOT E]$");
	const expectedResult = [["Hello", "this", "is", "a", "test"], ["Is", "it", "Working"], ["I", "hope", "so"], [], ["Paragraphs", "are", "marked", "with", "an", "empty", "List:"], [], [], [], ["Here", "is", "also", "an", "expression:"], ["[", "A", "and", "[", "B", "<->", "C", "]", "->", "D", "or", "neg", "E", "]"]];
	expect(result).toEqual(expectedResult);
});

test("scan for bracket errors - test 1", () => {
	const bracketList = ["[", "]", "[", "[", "]", "[", "]", "]"];
	const result = detectBracketErrors(bracketList);
	const expectedResult = false;
	expect(result).toEqual(expectedResult);
});

test("scan for bracket errors - test 2", () => {
	const bracketList = ["[", "[", "bracketLeft", "[", "[", "]", "]"];
	const result = detectBracketErrors(bracketList);
	const expectedResult = true;
	expect(result).toEqual(expectedResult);
});

test("scan for bracket errors - test 3", () => {
	const bracketList = ["]", "bracketLeft"];
	const result = detectBracketErrors(bracketList);
	const expectedResult = true;
	expect(result).toEqual(expectedResult);
});

// -------TO DO: format expressions into prolog format----------2

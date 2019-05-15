// IMPORTS
import { addErrorToErrorMap, emptyErrorList, findErrorMessage, listCollectedErrors } from "../error_map/error_map";
import { detectBracketErrors, detectMissingStatementsOrConnector, preFormatExpressionFromImput, replaceExpressionElementsIntoPrologCode} from "./expression_formatter";
import { sentenceIntoWordList, textFormatter } from "./text_formatter";

test("splitting a single sentences into List of words: ", () => {
	emptyErrorList();
	const result = sentenceIntoWordList("Hello, this is a test");
	const expectedResult = ["Hello", "this", "is", "a", "test"];
	expect(result).toEqual(expectedResult);
});

test("Test if the elements of a expression is detected and formatted correctly:", () => {
	emptyErrorList();
	const result = preFormatExpressionFromImput("[AUNDTest[B<==>C]->DODERNOTNOTE]");
	const expectedResult = ["bracketLeft", "A", "conjunction", "Test", "bracketLeft", "B", "equivalence", "C", "bracketRight", "implication", "D", "disjunction", "negation", "negation", "E", "bracketRight"];
	expect(result).toEqual(expectedResult);
});

test("replace detected expression-elements into readable prolog commands", () => {
	emptyErrorList();
	const result = replaceExpressionElementsIntoPrologCode(["bracketLeft", "A", "conjunction", "RANDOMTEXTHERE", "bracketLeft", "B", "equivalence", "C", "bracketRight", "bracketRight"]);
	const expectedResult = ["[", "A", "and", "RANDOMTEXTHERE", "[", "B", "<->", "C", "]", "]"];
	expect(result).toEqual(expectedResult);
});

test("splitting full text into full listFormat including expressions and paragraph marker: ", () => {
	emptyErrorList();
	const result = textFormatter("Hello, this is a test! Is it Working? I               hope so. \n Paragraphs are marked with an empty List: \n \n \n Here is also an expression: $[A UND [B <==> C] -> D ODER NOT E]$");
	const expectedResult = [
	["Hello", "this", "is", "a", "test"],
	["Is", "it", "Working"],
	["I", "hope", "so"],
	[],
	["Paragraphs", "are", "marked", "with", "an", "empty", "List:"],
	[],
	[],
	[],
	["Here", "is", "also", "an", "expression:"],
	["[", "A", "and", "[", "B", "<->", "C", "]", "->", "D", "or", "neg", "E", "]"]];
	expect(result).toEqual(expectedResult);
});

test("scan for bracket errors - test 1", () => {
	emptyErrorList();
	const bracketList = ["bracketLeft", "bracketRight", "bracketLeft",
	"bracketRight", "bracketLeft", "bracketLeft", "bracketRight", "bracketRight"];
	const result = detectBracketErrors(bracketList);
	const expectedResult = false;
	expect(result).toEqual(expectedResult);
	const result2 = listCollectedErrors();
	const expectedResult2: string[] = [];
	expect(result2).toEqual(expectedResult2);
});

test("scan for bracket errors - test 2; also test error pipeline", () => {
	emptyErrorList();
	const bracketList = ["bracketLeft", "bracketLeft", "bracketLeft",
	"bracketLeft", "bracketLeft", "bracketRight", "bracketRight"];
	const result = detectBracketErrors(bracketList);
	const expectedResult = true;
	expect(result).toEqual(expectedResult);
	const result2 = listCollectedErrors();
	const expectedResult2: string[] = ["200|Bracket Error: some brackets are not closed."];
	expect(result2).toEqual(expectedResult2);
});

test("scan for bracket errors - test 3; also test error pipeline", () => {
	emptyErrorList();
	const bracketList = ["bracketRight", "bracketLeft"];
	const result = detectBracketErrors(bracketList);
	const expectedResult = true;
	expect(result).toEqual(expectedResult);
	const result2 = listCollectedErrors();
	const expectedResult2: string[] = ["201|Bracket Error: too much brackets has been closed or has been closed before a bracket were opened."];
	expect(result2).toEqual(expectedResult2);
});

test("scan for missing Statements or missing connectors - test 1: [ <-> ]; also test error pipeline", () => {
	emptyErrorList();
	const testExpression = ["bracketLeft", "implication", "bracketRight"];
	const result = detectMissingStatementsOrConnector(testExpression);
	const expectedResult = true;
	expect(result).toEqual(expectedResult);
	const result2 = listCollectedErrors();
	const expectedResult2: string[] = ["202|Missing Statement Error: It seems, you forgot some statements inside your logic expression."];
	expect(result2).toEqual(expectedResult2);
});

test("scan for missing Statements or missing connectors - test 2: [ C <-> ]", () => {
	emptyErrorList();
	const testExpression = ["bracketLeft", "C", "implication", "bracketRight"];
	const result = detectMissingStatementsOrConnector(testExpression);
	const expectedResult = true;
	expect(result).toEqual(expectedResult);
	const result2 = listCollectedErrors();
	const expectedResult2: string[] = ["203|Missing Statement Error: It seems, you forgot to add a statement at the end of your logic expression."];
	expect(result2).toEqual(expectedResult2);
});

test("scan for missing Statements or missing connectors - test 3: [ and X ]", () => {
	emptyErrorList();
	const testExpression = ["bracketLeft",  "conjunction", "X", "bracketRight"];
	const result = detectMissingStatementsOrConnector(testExpression);
	const expectedResult = true;
	expect( result).toEqual(expectedResult);
	const result2 = listCollectedErrors();
	const expectedResult2: string[] = ["202|Missing Statement Error: It seems, you forgot some statements inside your logic expression."];
	expect(result2).toEqual(expectedResult2);
});

test("scan for missing Statements or missing connectors - test 4 [ A ]; also test error pipeline", () => {
	emptyErrorList();
	const testExpression = ["bracketLeft", "A", "bracketRight"];
	const result = detectMissingStatementsOrConnector(testExpression);
	const expectedResult = false;
	expect(result).toEqual(expectedResult);
	const result2 = listCollectedErrors();
	const expectedResult2: string[] = [];
	expect(result2).toEqual(expectedResult2);
});
test("scan for missing Statements or missing connectors - test 5: [ not A [ ] A ]; also test error pipeline", () => {
	emptyErrorList();
	const testExpression = ["bracketLeft", "not", "A", "bracketLeft", "bracketRight", "A", "bracketRight"];
	const result = detectMissingStatementsOrConnector(testExpression);
	const expectedResult = true;
	expect(result).toEqual(expectedResult);
	const result2 = listCollectedErrors();
	const expectedResult2: string[] = ["204|Missing Connector Error: It seems, you forgot some connector between your statements inside your logic expression."];
	expect(result2).toEqual(expectedResult2);

});
test("scan for missing Statements or missing connectors - test 6: [ A -> B ]; also test error pipeline", () => {
	emptyErrorList();
	const testExpression = ["bracketLeft", "A", "implication", "B", "bracketRight"];
	const result = detectMissingStatementsOrConnector(testExpression);
	const expectedResult = false;
	expect(result).toEqual(expectedResult);
	const result2 = listCollectedErrors();
	const expectedResult2: string[] = [];
	expect(result2).toEqual(expectedResult2);
});

test("test if finding of error messages out from the referenc map works correctly;", () => {
	emptyErrorList();
	const testErrorMessage = 104;
	const result = findErrorMessage(testErrorMessage);
	const expectedResult = "Error 104";
	expect(result).toEqual(expectedResult);

});
test("test if finding of error messages out from the referenc map works correctly", () => {
	emptyErrorList();
	const testErrorMessage = 999;
	const result = findErrorMessage(testErrorMessage);
	const expectedResult = undefined;
	expect(result).toEqual(expectedResult);
});

test("test if adding and returning of error messages works correctly", () => {
	emptyErrorList();
	addErrorToErrorMap(101);
	addErrorToErrorMap(104);
	addErrorToErrorMap(104);
	addErrorToErrorMap(103);
	const result = listCollectedErrors();
	const expectedResult = ["Error 101", "Error 104", "Error 104", "Error 103"];
	expect(result).toEqual(expectedResult);
});

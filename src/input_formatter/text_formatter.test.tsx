import { emptyIssueList } from "../issueHandling/issueMapping";
import {
	detectBracketErrors,
	detectMissingStatementsOrConnector,
	preFormatExpressionFromImput,
	replaceExpressionElementsIntoPrologCode,
} from "./expression_formatter";
import { sentenceIntoWordList, textFormatter } from "./text_formatter";

test("splitting a single sentences into List of words: ", () => {
	emptyIssueList();
	const result = sentenceIntoWordList("Hello, this is a test");
	const expectedResult = ["Hello", "this", "is", "a", "test"];
	expect(result).toEqual(expectedResult);
});

test("Test if the elements of a expression is detected and formatted correctly:", () => {
	emptyIssueList();
	const result = preFormatExpressionFromImput(
		"[AUNDTest[B<==>C]->DODERNOTNOTE]",
	);
	const expectedResult = [
		"bracketLeft",
		"A",
		"conjunction",
		"Test",
		"bracketLeft",
		"B",
		"equivalence",
		"C",
		"bracketRight",
		"implication",
		"D",
		"disjunction",
		"negation",
		"negation",
		"E",
		"bracketRight",
	];
	expect(result).toEqual(expectedResult);
});

test("replace detected expression-elements into readable prolog commands", () => {
	emptyIssueList();
	const result = replaceExpressionElementsIntoPrologCode([
		"bracketLeft",
		"A",
		"conjunction",
		"RANDOMTEXTHERE",
		"bracketLeft",
		"B",
		"equivalence",
		"C",
		"bracketRight",
		"bracketRight",
	]);
	const expectedResult = [
		"[",
		"A",
		"and",
		"RANDOMTEXTHERE",
		"[",
		"B",
		"<->",
		"C",
		"]",
		"]",
	];
	expect(result).toEqual(expectedResult);
});

test("splitting full text into full listFormat including expressions and paragraph marker: ", () => {
	emptyIssueList();
	const result = textFormatter(
		"Hello, this is a test! Is it Working? I               hope so. \n Paragraphs are marked with an " +
		"empty List: \n \n \n Here is also an expression: $[A UND[B <==> C]-> D ODER NOT E]$",
	);
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
		[
			"[",
			"A",
			"and",
			"[",
			"B",
			"<->",
			"C",
			"]",
			"->",
			"D",
			"or",
			"neg",
			"E",
			"]",
		],
	];
	expect(result).toEqual(expectedResult);
});

test("scan for bracket errors - test 1", () => {
	emptyIssueList();
	const bracketList = [
		"bracketLeft",
		"bracketRight",
		"bracketLeft",
		"bracketRight",
		"bracketLeft",
		"bracketLeft",
		"bracketRight",
		"bracketRight",
	];
	const result = detectBracketErrors(bracketList);
	const expectedResult = false;
	expect(result).toEqual(expectedResult);
});

test("scan for bracket errors - test 2", () => {
	emptyIssueList();
	const bracketList = [
		"bracketLeft",
		"bracketLeft",
		"bracketLeft",
		"bracketLeft",
		"bracketLeft",
		"bracketRight",
		"bracketRight",
	];
	const result = detectBracketErrors(bracketList);
	const expectedResult = true;
	expect(result).toEqual(expectedResult);
});

test("scan for bracket errors - test 3", () => {
	emptyIssueList();
	const bracketList = ["bracketRight", "bracketLeft"];
	const result = detectBracketErrors(bracketList);
	const expectedResult = true;
	expect(result).toEqual(expectedResult);
});

test("scan for missing Statements or missing connectors - test 1: [ <-> ]", () => {
	emptyIssueList();
	const testExpression = ["bracketLeft", "implication", "bracketRight"];
	const result = detectMissingStatementsOrConnector(testExpression);
	const expectedResult = true;
	expect(result).toEqual(expectedResult);
});

test("scan for missing Statements or missing connectors - test 2: [ C <-> ]", () => {
	emptyIssueList();
	const testExpression = ["bracketLeft", "C", "implication", "bracketRight"];
	const result = detectMissingStatementsOrConnector(testExpression);
	const expectedResult = true;
	expect(result).toEqual(expectedResult);
});

test("scan for missing Statements or missing connectors - test 3: [ and X ]", () => {
	emptyIssueList();
	const testExpression = ["bracketLeft", "conjunction", "X", "bracketRight"];
	const result = detectMissingStatementsOrConnector(testExpression);
	const expectedResult = true;
	expect(result).toEqual(expectedResult);
});

test("scan for missing Statements or missing connectors - test 4 [ A ]", () => {
	emptyIssueList();
	const testExpression = ["bracketLeft", "A", "bracketRight"];
	const result = detectMissingStatementsOrConnector(testExpression);
	const expectedResult = false;
	expect(result).toEqual(expectedResult);
});

test("scan for missing Statements or missing connectors - test 5: [ not A [ ] A ]", () => {
	emptyIssueList();
	const testExpression = [
		"bracketLeft",
		"not",
		"A",
		"bracketLeft",
		"bracketRight",
		"A",
		"bracketRight",
	];
	const result = detectMissingStatementsOrConnector(testExpression);
	const expectedResult = true;
	expect(result).toEqual(expectedResult);
});

test("scan for missing Statements or missing connectors - test 6: [ A -> B ]", () => {
	emptyIssueList();
	const testExpression = [
		"bracketLeft",
		"A",
		"implication",
		"B",
		"bracketRight",
	];
	const result = detectMissingStatementsOrConnector(testExpression);
	const expectedResult = false;
	expect(result).toEqual(expectedResult);
});

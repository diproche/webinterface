import { emptyIssueList, listAllIssues } from "../issueHandling/issueMapping";
import {
	detectBracketIssues,
	expressionIssueDetector,
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
		"implicationRight",
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
		"empty List: \n \n \n Here is also an expression: $[A UND[B <==> ]-> D ODER NOT E]$ " +
		"And a second one: $[5 add 12 equal 3 mal 5 plus 2]$",
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
			"]",
			"->",
			"D",
			"or",
			"neg",
			"E",
			"]",
		],
		["And", "a", "second", "one:"],
		[
			"[",
			"5",
			"+",
			"12",
			"=",
			"3",
			"*",
			"5",
			"+",
			"2",
			"]",
		],
	];
	expect(result).toEqual(expectedResult);
	const issue = listAllIssues().find(i => i.code === "MISSING_STATEMENT_INSIDE");
	expect(issue).toEqual({
		code: "MISSING_STATEMENT_INSIDE",
		message: "Es fehlt mindestens ein Argument zwischen zwei logischen Operatoren.",
		severity: "WARNING",
	});

});

test("scan for bracket errors - test 1: [][][[]]", () => {
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
	detectBracketIssues(bracketList);
	const issue = listAllIssues();
	expect(issue).toEqual([]);
});

test("scan for bracket errors - test 2: ][[[[[[]]", () => {
	emptyIssueList();
	const bracketList = [
		"bracketRight",
		"bracketLeft",
		"bracketLeft",
		"bracketLeft",
		"bracketLeft",
		"bracketLeft",
		"bracketRight",
		"bracketRight",
	];
	detectBracketIssues(bracketList);
	const issue1 = listAllIssues().find(i => i.code === "BRACKET_UNDERCLOSING");
	const issue2 = listAllIssues().find(i => i.code === "BRACKET_OVERCLOSING");
	expect(issue1).toEqual({
		code: "BRACKET_UNDERCLOSING",
		message: "Es wurden Klammern geöffnet, die nicht geschlossen wurden.",
		severity: "WARNING",
	});
	expect(issue2).toEqual({
		code: "BRACKET_OVERCLOSING",
		message: "Es wurden Klammern geschlossen, die nicht geöffnet wurden.",
		severity: "WARNING",
	});
});

test("scan for bracket errors - test 3: ][", () => {
	emptyIssueList();
	const bracketList = ["bracketRight", "bracketLeft"];
	detectBracketIssues(bracketList);
	const issue = listAllIssues().find(i => i.code === "BRACKET_OVERCLOSING");
	expect(issue).toEqual({
		code: "BRACKET_OVERCLOSING",
		message: "Es wurden Klammern geschlossen, die nicht geöffnet wurden.",
		severity: "WARNING",
	});
});

test("scan for missing Statements or missing connectors - test 1: [ <-> ]", () => {
	emptyIssueList();
	const testExpression = ["bracketLeft", "implicationRight", "bracketRight"];
	expressionIssueDetector(testExpression);
	const issue1 = listAllIssues().find(i => i.code === "MISSING_STATEMENT_INSIDE");
	const issue2 = listAllIssues().find(i => i.code === "MISSING_STATEMENT_AT_THE_END");
	expect(issue1).toEqual({
		code: "MISSING_STATEMENT_INSIDE",
		message: "Es fehlt mindestens ein Argument zwischen zwei logischen Operatoren.",
		severity: "WARNING",
	});
	expect(issue2).toEqual({
		code: "MISSING_STATEMENT_AT_THE_END",
		message: "Am Ende des Ausdrucks fehlt ein Argument. Dieser darf nicht mit einem logischen Operator enden.",
		severity: "WARNING",
	});
});

test("scan for missing Statements or missing connectors - test 2: [ C <-> ]]", () => {
	emptyIssueList();
	const testExpression = ["bracketLeft", "C", "implicationRight", "bracketRight", "bracketRight"];
	expressionIssueDetector(testExpression);
	const issue1 = listAllIssues().find(i => i.code === "MISSING_STATEMENT_AT_THE_END");
	const issue2 = listAllIssues().find(i => i.code === "BRACKET_OVERCLOSING");
	expect(issue1).toEqual({
		code: "MISSING_STATEMENT_AT_THE_END",
		message: "Am Ende des Ausdrucks fehlt ein Argument. Dieser darf nicht mit einem logischen Operator enden.",
		severity: "WARNING",
	});
	expect(issue2).toEqual({
		code: "BRACKET_OVERCLOSING",
		message: "Es wurden Klammern geschlossen, die nicht geöffnet wurden.",
		severity: "WARNING",
	});
});

test("scan for missing Statements or missing connectors - test 3: [ and X ]", () => {
	emptyIssueList();
	const testExpression = ["bracketLeft", "conjunction", "X", "bracketRight"];
	expressionIssueDetector(testExpression);
	const issue = listAllIssues().find(i => i.code === "MISSING_STATEMENT_INSIDE");
	expect(issue).toEqual({
		code: "MISSING_STATEMENT_INSIDE",
		message: "Es fehlt mindestens ein Argument zwischen zwei logischen Operatoren.",
		severity: "WARNING",
	});
});

test("scan for missing Statements or missing connectors - test 4 [ A ]", () => {
	emptyIssueList();
	const testExpression = ["bracketLeft", "A", "bracketRight"];
	expressionIssueDetector(testExpression);
	const issue = listAllIssues();
	expect(issue).toEqual([]);
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
	expressionIssueDetector(testExpression);
	const issue = listAllIssues().find(i => i.code === "MISSING_CONNECTOR");
	expect(issue).toEqual({
		code: "MISSING_CONNECTOR",
		message: "Es fehlen logische Operatoren in der Formel.",
		severity: "WARNING",
	});

});

test("scan for missing Statements or missing connectors - test 6: [ A <- B ]", () => {
	emptyIssueList();
	const testExpression = [
		"bracketLeft",
		"A",
		"implicationLeft",
		"B",
		"bracketRight",
	];
	expressionIssueDetector(testExpression);
	const issue = listAllIssues();
	expect(issue).toEqual([]);
});

test("scan for missing Statements or missing connectors - test 7: [ not not A ]", () => {
	emptyIssueList();
	const testExpression = [
		"bracketLeft",
		"negation",
		"negation",
		"negation",
		"A",
		"bracketRight",
	];
	expressionIssueDetector(testExpression);
	const issue = listAllIssues();
	expect(issue).toEqual([]);
});
test("scan for missing Statements or missing connectors - test 8: [ not not <= A]", () => {
	emptyIssueList();
	const testExpression = [
		"bracketLeft",
		"negation",
		"negation",
		"implicationLeft",
		"A",
		"bracketRight",
	];
	expressionIssueDetector(testExpression);
	const issue = listAllIssues().find(i => i.code === "MISSING_STATEMENT_AFTER_NEGATION");
	expect(issue).toEqual({
		code: "MISSING_STATEMENT_AFTER_NEGATION",
		message: "Nach einer Negation muss ein Argument folgen.",
		severity: "WARNING",
	});
});

test("scan for missing Statements or missing connectors - test 9: [ not not not ]", () => {
	emptyIssueList();
	const testExpression = [
		"negation",
		"negation",
		"negation",
	];
	expressionIssueDetector(testExpression);
	const issue = listAllIssues().find(i => i.code === "MISSING_STATEMENT_AT_THE_END");
	expect(issue).toEqual({
		code: "MISSING_STATEMENT_AT_THE_END",
		message: "Am Ende des Ausdrucks fehlt ein Argument. Dieser darf nicht mit einem logischen Operator enden.",
		severity: "WARNING",
	});
});

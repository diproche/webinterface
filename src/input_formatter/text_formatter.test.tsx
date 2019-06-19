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

test("Test if the elements of a expression is detected and preformatted correctly:", () => {
	emptyIssueList();
	const result = preFormatExpressionFromImput(
		"[AUNDTest[B<==>C]->DODERNOT   NOTE]",
	);
	const expectedResult = [
		"[",
		"A",
		"UND",
		"Test",
		"[",
		"B",
		"<==>",
		"C",
		"]",
		"->",
		"D",
		"ODER",
		"NOT",
		"   ",
		"NOT",
		"E",
		"]",
	];
	expect(result).toEqual(expectedResult);
});

test("replace detected expression-elements into readable prolog commands", () => {
	emptyIssueList();
	const result = replaceExpressionElementsIntoPrologCode([
		"bracketLeft",
		"A",
		"conjunction",
		"TEXTHERE",
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
		"TEXTHERE",
		"[",
		"B",
		"<->",
		"C",
		"]",
		"]",
	];
	expect(result).toEqual(expectedResult);
});

test("expression formatter testcase", () => {
	emptyIssueList();
	const result: string = textFormatter("Es gilt: $((a&b)<->(b&a))$");
	const expectedResult = "[[es,gilt:],[[[a,and,b],<->,[b,and,a]]]].";
	expect(result).toEqual(expectedResult);
});

test("splitting full text into readable prolog format including formatted expressions and paragraph marker: ", () => {
	emptyIssueList();
	const result = textFormatter(
		"Hello, this is a test! Is it Working? I     hope so. \n Paragraphs are marked with an " +
		"abs List: \n \n \n Here is also an expression: $[AUNDbracketLEFTB<-->]-> D ODERNOT E]$ " +
		"And a second one: $[5 ADD 12 equal 3 mal 5 plus 2]$");
	const expectedResult = "[[hello,this,is,a,test],[is,it,working]," +
		"[i,hope,so],[abs],[paragraphs,are,marked,with,an,abs,list:]," +
		"[abs],[abs],[abs],[here,is,also,an,expression:],[[a,and,[b,<->],->," +
		"d,or,neg,e]],[and,a,second,one:],[[5,+,12,=,3,*,5,+,2]]].";
	expect(result).toEqual(expectedResult);
	const issue = listAllIssues().find(i => i.code === "MISSING_STATEMENT_INSIDE");
	expect(issue).toEqual({
		code: "MISSING_STATEMENT_INSIDE",
		message: "Es fehlt ein Argument.",
		severity: "WARNING",
		position: {
			fromIndex: 150,
			toIndex: 150,
		},
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
	detectBracketIssues(bracketList, 0);
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
	detectBracketIssues(bracketList, 0);
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
		position: {
			fromIndex: 0,
			toIndex: 12,
		},
	});
});

test("scan for bracket errors - test 3: )]", () => {
	emptyIssueList();
	const bracketList = ["bracketLeft", ")", "]"];
	detectBracketIssues(bracketList, 0);
	const issue = listAllIssues().find(i => (i.code === "BRACKET_OVERCLOSING"));
	expect(issue).toEqual({
		code: "BRACKET_OVERCLOSING",
		message: "Es wurden Klammern geschlossen, die nicht geöffnet wurden.",
		severity: "WARNING",
		position: {
			fromIndex: 12,
			toIndex: 13,
		},
	});
});

test("scan for missing Statements or missing connectors - test 1: [ <-> k]", () => {
	emptyIssueList();
	const testExpression = ["bracketLeft", "implicationRight", "bracketRight"];
	expressionIssueDetector(testExpression, 0);
	const issue = listAllIssues().find(i => i.code === "MISSING_STATEMENT_INSIDE");
	expect(issue).toEqual({
		code: "MISSING_STATEMENT_INSIDE",
		message: "Es fehlt ein Argument.",
		severity: "WARNING",
		position: {
			fromIndex: 11,
			toIndex: 11,
		},
	});
});

test("scan for missing Statements or missing connectors - test 2: [ C -> ]]", () => {
	emptyIssueList();
	const testExpression = ["bracketLeft", "C", "implicationRight", "bracketRight", "bracketRight"];
	expressionIssueDetector(testExpression, 0);
	const issue1 = listAllIssues().find(i => i.code === "MISSING_STATEMENT_INSIDE");
	const issue2 = listAllIssues().find(i => i.code === "BRACKET_OVERCLOSING");
	expect(issue1).toEqual({
		code: "MISSING_STATEMENT_INSIDE",
		message: "Es fehlt ein Argument.",
		severity: "WARNING",
		position: {
			fromIndex: 28,
			toIndex: 28,
		},
	});
	expect(issue2).toEqual({
		code: "BRACKET_OVERCLOSING",
		message: "Es wurden Klammern geschlossen, die nicht geöffnet wurden.",
		severity: "WARNING",
		position: {
			fromIndex: 40,
			toIndex: 52,
		},
	});
});

test("scan for missing Statements or missing connectors - test 3: [ and X ]", () => {
	emptyIssueList();
	const testExpression = ["bracketLeft", "conjunction", "X", "bracketRight"];
	expressionIssueDetector(testExpression, 0);
	const issue = listAllIssues().find(i => i.code === "MISSING_STATEMENT_INSIDE");
	expect(issue).toEqual({
		code: "MISSING_STATEMENT_INSIDE",
		message: "Es fehlt ein Argument.",
		severity: "WARNING",
		position: {
			fromIndex: 11,
			toIndex: 11,
		},
	});
});

test("scan for missing Statements or missing connectors - test 4 [ A ]", () => {
	emptyIssueList();
	const testExpression = ["bracketLeft", "A", "bracketRight"];
	expressionIssueDetector(testExpression, 0);
	const issue = listAllIssues();
	expect(issue).toEqual([]);
});

test("scan for missing Statements or missing connectors - test 5: [ not A [ ] B ]", () => {
	emptyIssueList();
	const testExpression = [
		"bracketLeft",
		"not",
		"A",
		"[",
		")",
		"B",
		"bracketRight",
	];
	expressionIssueDetector(testExpression, 0);
	const issue = listAllIssues().find(i => i.code === "MISSING_CONNECTOR");
	expect(issue).toEqual({
		code: "MISSING_CONNECTOR",
		message: "Es fehlen logische Operatoren in der Formel.",
		severity: "WARNING",
		position: {
			fromIndex: 17,
			toIndex: 18,
		},
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
	expressionIssueDetector(testExpression, 0);
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
	expressionIssueDetector(testExpression, 0);
	const issue = listAllIssues();
	expect(issue).toEqual([]);
});
test("scan for missing Statements or missing connectors - test 8: [ not not <= A]", () => {
	emptyIssueList();
	const testExpression = [
		"(",
		"not",
		"neg",
		"<--",
		"A",
		"bracketRight",
	];
	expressionIssueDetector(testExpression, 0);
	const issue = listAllIssues().find(i => i.code === "MISSING_STATEMENT_AFTER_NEGATION");
	expect(issue).toEqual({
		code: "MISSING_STATEMENT_AFTER_NEGATION",
		message: "Nach einer Negation muss ein Argument folgen.",
		severity: "WARNING",
		position: {
			fromIndex: 7,
			toIndex: 7,
		},
	});
});

test("scan for missing Statements or missing connectors - test 9: [ not not not ]", () => {
	emptyIssueList();
	const testExpression = [
		"[",
		"neg",
		"neg",
		"neg",
		"]",
	];
	expressionIssueDetector(testExpression, 0);
	const issue = listAllIssues().find(i => i.code === "MISSING_STATEMENT_INSIDE");
	expect(issue).toEqual({
		code: "MISSING_STATEMENT_INSIDE",
		message: "Es fehlt ein Argument.",
		severity: "WARNING",
		position: {
			fromIndex: 10,
			toIndex: 10,
		},
	});
});

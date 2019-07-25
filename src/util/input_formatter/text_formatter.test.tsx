import { emptyIssueList, listAllIssues } from "../issueHandling/issueMapping";
import {
	detectBracketIssues,
	expressionIssueDetector,
	preFormatExpressionFromImput,
	replaceExpressionElementsIntoPrologCode,
} from "./expression_formatter";
import { sentenceIntoWordList, textFormatter } from "./text_formatter";

beforeEach(() => {
	emptyIssueList();
});

test("splitting a single sentences into List of words: ", () => {
	const result = sentenceIntoWordList("Hello, this is a test");
	const expectedResult = "Hello,this,is,a,test";
	expect(result).toEqual(expectedResult);
});

test("Test if the elements of a expression is detected and preformatted correctly:", () => {
	const result = textFormatter(
		"Es seien a, b und c Aussagen." +
		"Angenommen $a ->(b -> c)$." +
		"Angenommen ferner es gilt $(a und b)$." +
		"Dann folgt a." +
		"Ausserdem folgt b." +
		"Damit gilt $(b -> c)$." +
		"Ferner folgt c." +
		"Also gilt $a -> (b -> c) -> (a und b) -> c$.",
	);
	const expectedResult =
		"[[es,seien,a,b,und,c,aussagen]," +
		"[angenommen,[a,->,[b,->,c]]]," +
		"[angenommen,ferner,es,gilt,[[a,and,b]]]," +
		"[dann,folgt,a]," +
		"[ausserdem,folgt,b]," +
		"[damit,gilt,[[b,->,c]]]," +
		"[ferner,folgt,c]," +
		"[also,gilt,[a,->,[b,->,c],->,[a,and,b],->,c]]]";
	expect(result).toEqual(expectedResult);
});

test("Test if the elements of a expression is detected and preformatted correctly:", () => {
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

test("Test if the elements of a expression is detected and preformatted correctly:", () => {
	const result = preFormatExpressionFromImput("df       test ( nicht sonne) ");
	const expectedResult = ["df       test ", "(", " ", "nicht", " sonne", ")", " "];
	expect(result).toEqual(expectedResult);
});

test("Test if the elements of a expression is detected and preformatted correctly:", () => {
	const result = preFormatExpressionFromImput("df       test ( nicht sonne) ");
	const expectedResult = [
		"df test",
		"[",
		"neg",
		"sonne",
		"]",
	];
	const result2 = replaceExpressionElementsIntoPrologCode(result);
	expect(result2).toEqual(expectedResult);
});

test("replace detected expression-elements into readable prolog commands", () => {
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
	const result: string = textFormatter("Just another test $(a and a)$. test $test2$.$test3$.");
	const expectedResult = "[[just,another,test,[[a,and,a]]],[test,[test2]],[[test3]]]";
	expect(result).toEqual(expectedResult);
});

test("expression formatter testcase", () => {
	const result: string = textFormatter("Es gilt $((a&b)<->(b&a))$");
	const expectedResult = "[[es,gilt,[[[a,and,b],<->,[b,and,a]]]]]";
	expect(result).toEqual(expectedResult);
});

test("splitting full text into readable prolog format including formatted expressions and paragraph marker: ", () => {
	const result = textFormatter(
		"Hello, this is a test! => Is it Working? <= I     hope so. \n Paragraphs are marked with an " +
		"abs List \n \n \n Here is also an expression $[AUNDbracketLEFTB<-->]-> D ODERNOT E]$. " +
		"And a second one $[5 ADD 12 equal 3 mal 5 plus 2]$");
	const expectedResult = "[[hello,this,is,a,test],[=>],[is,it,working],[<=]," +
		"[i,hope,so],[abs],[paragraphs,are,marked,with,an,abs,list]," +
		"[abs],[abs],[abs],[here,is,also,an,expression,[[a,and,[b,<->],->," +
		"d,or,neg,e]]],[and,a,second,one,[[5,+,12,=,3,*,5,+,2]]]]";
	expect(result).toEqual(expectedResult);
	const issue = listAllIssues().find(i => i.code === "MISSING_STATEMENT_INSIDE");
	expect(issue).toEqual({
		code: "MISSING_STATEMENT_INSIDE",
		message: "Es fehlt ein Argument.",
		severity: "WARNING",
		position: {
			fromIndex: 126,
			toIndex: 126,
		},
	});

});

test("scan for bracket errors - test 1: []", () => {
	const bracketList = [
		"bracketLeft",
		"bracketRight",

	];
	expressionIssueDetector(bracketList, 0);
	const issue = listAllIssues().find(i => i.code === "EMPTY_BRACKET");
	expect(issue).toEqual({
		code: "EMPTY_BRACKET",
		message: "Die gesetzten Klammern enthalten keine Elemente.",
		severity: "WARNING",
		position: {
			fromIndex: 11,
			toIndex: 11,
		},
	});
});

test("scan for bracket errors - test 2: ][[[[[[]]", () => {
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
	const testExpression = ["bracketLeft", "A", "bracketRight"];
	expressionIssueDetector(testExpression, 0);
	const issue = listAllIssues();
	expect(issue).toEqual([]);
});

test("scan for missing Statements or missing connectors - test 5: [ not A [ ] B ]", () => {
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
	const issue = listAllIssues().find(i => i.code === "EMPTY_BRACKET");
	expect(issue).toEqual({
		code: "EMPTY_BRACKET",
		message: "Die gesetzten Klammern enthalten keine Elemente.",
		severity: "WARNING",
		position: {
			fromIndex: 16,
			toIndex: 16,
		},
	});

});

test("scan for missing Statements or missing connectors - test 6: [ A <- B ]", () => {
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

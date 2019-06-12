import { addIssue } from "../issueHandling/issueMapping";
import Position from "../issueHandling/position";
import { setPosition } from "../issueHandling/position";

const Regexes = {
	whiteSpace: /\s/,
	expressionmarker: /\$/,
	bracketLeft: /(\[|\(|bracketLeft)/,
	bracketRight: /(\]|\)|bracketRight)/,
	equivalence: /(<-->|<==>|<=>|<->|equivalence)/,
	implicationRight: /(->|-->|=>|==>|\\rightarrow|implicationRight)/,
	implicationLeft: /(<-|<--|<=|<==|\/leftarrow|implicationLeft)/,
	negation: /(neq|not|nicht|¬|neg)/i,
	conjunction: /(and|und|&|\/\\|conjunction)/i,
	disjunction: /(or|oder|\||\\\/|disjunction)/i,
	equal: /(=|==|===|gleich|equal)/,
	addition: /(\+|plus|add|sum)/,
	subtraction: /(-|minus)/,
	division: /(:|\/|div|geteilt)/,
	multiplication: /(\*|mal|mult)/,
};

const orRegex = (...regexes: RegExp[]) =>
	new RegExp(regexes.map(r => r.source).join("|"));

const bracket = orRegex(
	Regexes.bracketLeft,
	Regexes.bracketRight,
);
const implication = orRegex(
	Regexes.implicationRight,
	Regexes.implicationLeft,
);
const logicConnector = orRegex(
	Regexes.conjunction,
	Regexes.disjunction,
	Regexes.equivalence,
	implication,
);
const functionalConnector = orRegex(
	Regexes.equal,
	Regexes.addition,
	Regexes.subtraction,
	Regexes.multiplication,
	Regexes.division,
);

let allowedExpressionToken = orRegex(
	Regexes.expressionmarker,
	bracket,
	Regexes.equivalence,
	implication,
	Regexes.negation,
	Regexes.conjunction,
	Regexes.disjunction,
	functionalConnector,
);
allowedExpressionToken = new RegExp(allowedExpressionToken, "ig");

/**
 * main method to format expressions
 * @param expression written by user
 * @return a formatted expression as string[];
 * each element of the expression gets formatted into prolog readable code
 */
export function expressionFormatter(expression: string, expressionPosition: number): string[] {
	const preFormattedExpression: string[] = preFormatExpressionFromImput(expression);
	expressionIssueDetector(preFormattedExpression, expressionPosition);
	const finalFormattedExpression: string[] = replaceExpressionElementsIntoPrologCode(preFormattedExpression);
	return finalFormattedExpression;
}

/**
 * @param expression written by user
 * @return a preformatted expression where some different
 * input styles for logical vocabulary gets formatted into one single style
 */
export function preFormatExpressionFromImput(expression: string): string[] {
	const splittedExpression: string[] = expression.split(allowedExpressionToken);
	const filtered = splittedExpression.filter(x => x !== undefined && x != null && x !== "");
	return filtered;
}

/**
 * @return finalExpression where expression elements got replaced with readable prolog code elements
 */
export function replaceExpressionElementsIntoPrologCode(preFormattedExpression: string[]): string[] {
	const finalFormattedExpression: string[] = [];
	for (let element of preFormattedExpression) {
		element = element.trim();
		if (element.match(allowedExpressionToken)) {
			let newElement: string = replaceASingleExpressionElementIntoPrologCode(element);
			newElement = newElement.trim();
			finalFormattedExpression.push(newElement);
		} else if (element.match(Regexes.whiteSpace)) {
			continue;
		} else {
			finalFormattedExpression.push(element);
		}
	}
	const filtered = finalFormattedExpression.filter(x => x !== "");
	return filtered;
}

/**
 * helper function for replaceExpressionElementsIntoPrologCode
 * @return finalExpressionElement
 */
export function replaceASingleExpressionElementIntoPrologCode(preformattedExpressionElement: string): string {
	const finalExpression: string = preformattedExpressionElement;
	return finalExpression
		.replace(Regexes.expressionmarker, "")
		.replace(Regexes.whiteSpace, "")
		.replace(new RegExp(Regexes.bracketLeft, "i"), "\[")
		.replace(new RegExp(Regexes.bracketRight, "i"), "\]")
		.replace(new RegExp(Regexes.equivalence, "i"), "<->")
		.replace(new RegExp(Regexes.implicationRight, "i"), "->")
		.replace(new RegExp(Regexes.implicationLeft, "i"), "<-")
		.replace(new RegExp(Regexes.negation, "i"), "neg")
		.replace(new RegExp(Regexes.conjunction, "i"), "and")
		.replace(new RegExp(Regexes.disjunction, "i"), "or")
		.replace(new RegExp(Regexes.equal, "i"), "=")
		.replace(new RegExp(Regexes.addition, "i"), "+")
		.replace(new RegExp(Regexes.subtraction, "i"), "-")
		.replace(new RegExp(Regexes.multiplication, "i"), "*")
		.replace(new RegExp(Regexes.division, "i"), ":")
		;
}

export function expressionIssueDetector(preFormattedExpression: string[], expressionPosition: number) {
	detectBracketIssues(preFormattedExpression, expressionPosition);
	detectMissingStatementsOrConnector(preFormattedExpression, expressionPosition);
}

/**
 * Check the expression for an equal amount of opened and closed brackets.; it can detect wrong input
 */
export function detectBracketIssues(expression: string[], expressionPosition: number) {
	let bracketCount = 0;
	const position: Position = {
		fromIndex: expressionPosition,
		toIndex: expressionPosition,
	};
	expression.forEach(element => {
		position.toIndex = position.fromIndex + element.length;
		if (element.match(Regexes.bracketLeft)) {
			bracketCount++;
		} else if (element.match(Regexes.bracketRight)) {
			bracketCount--;
		}
		if (bracketCount < 0) {
			addIssue("BRACKET_OVERCLOSING", setPosition(position.fromIndex, position.toIndex));
			bracketCount = 0;
		}
		position.fromIndex = position.toIndex;
	});
	if (bracketCount > 0) {
		addIssue("BRACKET_UNDERCLOSING");
	}
}

/**
 * check the expression for correctness that no logic operators or statements is forgotten; it can detect wrong input
 */
export function detectMissingStatementsOrConnector(expression: string[], expressionPosition: number) {
	let foundConnector = true;
	let foundStatement = false;
	let foundNegation = false;
	let fromPos: number = expressionPosition;
	for (const expr of expression) {
		if (expr.match(bracket)) {
			fromPos = fromPos + expr.length;
		} else if (expr.match(Regexes.whiteSpace)) {
			fromPos = fromPos + expr.length;
		} else if (expr.match(Regexes.negation)) {
			foundNegation = true;
			fromPos = fromPos + expr.length;
		} else if (expr.match(logicConnector)) {
			if (foundNegation === true) {
				addIssue("MISSING_STATEMENT_AFTER_NEGATION", setPosition(fromPos, fromPos + expr.length));
			} else if (foundConnector === true) {
				addIssue("MISSING_STATEMENT_INSIDE", setPosition(fromPos, fromPos + expr.length));
			}
			fromPos = fromPos + expr.length;
			foundConnector = true;
			foundStatement = false;
			foundNegation = false;
		} else {
			if (foundStatement === true) {
				addIssue("MISSING_CONNECTOR", setPosition(fromPos, fromPos + expr.length));
			}
			fromPos = fromPos + expr.length;
			foundConnector = false;
			foundStatement = true;
			foundNegation = false;
		}
	}
	if (foundStatement === false || foundConnector === true || foundNegation === true) {
		addIssue("MISSING_STATEMENT_AT_THE_END", setPosition(fromPos, fromPos));
	}

}

import { addIssue } from "../issueHandling/issueMapping";

const Regexes = {
	whiteSpace: /\s/,
	expressionmarker: /\$/,
	bracketLeft: new RegExp(/(\[|\(|bracketLeft)/, "ig"),
	bracketRight: new RegExp(/(\]|\)|bracketRight)/, "ig"),
	equivalence: new RegExp(/(<-->|<==>|<=>|<->|equivalence)/, "ig"),
	implicationRight: new RegExp(/(->|-->|=>|==>|\\rightarrow|implicationRight)/, "ig"),
	implicationLeft: new RegExp(/(<-|<--|<=|<==|\/leftarrow|implicationLeft)/, "ig"),
	negation: new RegExp(/(neq|not|nicht|¬|neg)/, "ig"),
	conjunction: new RegExp(/(and|und|&|\/\\|conjunction)/, "ig"),
	disjunction: new RegExp(/(or|oder|\||\\\/|disjunction)/, "ig"),
	equal: new RegExp(/(=|==|===|gleich|equal)/, "ig"),
	addition: new RegExp(/(\+|plus|add|sum)/, "ig"),
	subtraction: new RegExp(/(-|minus)/, "ig"),
	division: new RegExp(/(:|\/|div|geteilt)/, "ig"),
	multiplication: new RegExp(/(\*|mal|mult)/, "ig"),
};

const orRegex = (...regexes: RegExp[]) =>
	new RegExp(regexes.map(r => r.source).join("|"));

const bracket = new RegExp(orRegex(
	Regexes.bracketLeft,
	Regexes.bracketRight,
), "ig");

const implication = new RegExp(orRegex(
	Regexes.implicationRight,
	Regexes.implicationLeft,
), "ig");
const logicConnector = new RegExp(orRegex(
	Regexes.conjunction,
	Regexes.disjunction,
	Regexes.equivalence,
	implication,
), "ig");
const functionalConnector = new RegExp(orRegex(
	Regexes.equal,
	Regexes.addition,
	Regexes.subtraction,
	Regexes.multiplication,
	Regexes.division,
), "ig");

const allowedExpressionToken = new RegExp(orRegex(
	Regexes.expressionmarker,
	bracket,
	Regexes.equivalence,
	implication,
	Regexes.negation,
	Regexes.conjunction,
	Regexes.disjunction,
	functionalConnector,
), "ig");
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
		.replace(Regexes.bracketLeft, "\[")
		.replace(Regexes.bracketRight, "\]")
		.replace(Regexes.equivalence, "<->")
		.replace(Regexes.implicationRight, "->")
		.replace(Regexes.implicationLeft, "<-")
		.replace(Regexes.negation, "neg")
		.replace(Regexes.conjunction, "and")
		.replace(Regexes.disjunction, "or")
		.replace(Regexes.equal, "=")
		.replace(Regexes.addition, "+")
		.replace(Regexes.subtraction, "-")
		.replace(Regexes.multiplication, "*")
		.replace(Regexes.division, ":")
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
	let bracketCount: number = 0;
	let fromPos: number = expressionPosition;
	let toPos: number = expressionPosition;

	expression.forEach(element => {
		toPos = fromPos + element.length;
		if (element.match(Regexes.bracketLeft)) {
			bracketCount++;
		} else if (element.match(Regexes.bracketRight)) {
			bracketCount--;
		}
		if (bracketCount < 0) {
			addIssue("BRACKET_OVERCLOSING", { fromIndex: fromPos, toIndex: fromPos + element.length });
			bracketCount = 0;
		}
		fromPos = toPos;
	});
	if (bracketCount > 0) {
		addIssue("BRACKET_UNDERCLOSING");
	}
}

/**
 * check the expression for correctness that no logic operators or statements is forgotten; it can detect wrong input
 */
export function detectMissingStatementsOrConnector(expression: string[], expressionPosition: number) {
	let foundConnector: boolean = true;
	let foundStatement: boolean = false;
	let foundNegation: boolean = false;
	let fromPos: number = expressionPosition;
	for (const element of expression) {
		if (element.match(bracket)) {
			fromPos = fromPos + element.length;
		} else if (element.match(Regexes.whiteSpace)) {
			fromPos = fromPos + element.length;
		} else if (element.match(Regexes.negation)) {
			foundNegation = true;
			fromPos = fromPos + element.length;
		} else if (element.match(logicConnector)) {
			if (foundNegation === true) {
				addIssue("MISSING_STATEMENT_AFTER_NEGATION", { fromIndex: fromPos, toIndex: fromPos + element.length });
			} else if (foundConnector === true) {
				addIssue("MISSING_STATEMENT_INSIDE", { fromIndex: fromPos, toIndex: fromPos + element.length });
			}
			fromPos = fromPos + element.length;
			foundConnector = true;
			foundStatement = false;
			foundNegation = false;
		} else {
			if (foundStatement === true) {
				addIssue("MISSING_CONNECTOR", { fromIndex: fromPos, toIndex: fromPos + element.length });
			}
			foundConnector = false;
			foundStatement = true;
			foundNegation = false;
			fromPos = fromPos + element.length;
		}
	}
	if (foundStatement === false || foundConnector === true || foundNegation === true) {
		addIssue("MISSING_STATEMENT_AT_THE_END", { fromIndex: fromPos, toIndex: fromPos });
	}

}

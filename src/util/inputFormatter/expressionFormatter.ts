import { addIssue } from "../issueHandling/issueMapping";
import { allowedExpressionToken, bracket, logicConnector, Regexes } from "./regexes";

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
 *  * Returns a preformatted expression where some different
 * input styles for logical vocabulary gets formatted into one single style
 * @param expression written by user
 */
export function preFormatExpressionFromImput(expression: string): string[] {
	const splittedExpression: string[] = expression.split(allowedExpressionToken);
	const filtered = splittedExpression.filter(x => x);
	return filtered;
}

/**
 * Returns finalExpression where expression elements got replaced with readable prolog code elements
 */
export function replaceExpressionElementsIntoPrologCode(preFormattedExpression: string[]): string[] {
	const finalFormattedExpression: string[] = [];
	for (let element of preFormattedExpression) {
		element = element.trim();
		if (element.match(allowedExpressionToken)) {
			element = replaceASingleExpressionElementIntoPrologCode(element).trim();
			finalFormattedExpression.push(element);
		} else {
			element = element.trim();
			element = element.replace(Regexes.allWhiteSpace, " ");
			finalFormattedExpression.push(element);
		}
	}
	const filtered = finalFormattedExpression.filter(x => x);
	return filtered;
}

/**
 * helper function for replaceExpressionElementsIntoPrologCode
 * @return finalExpressionElement
 */
export function replaceASingleExpressionElementIntoPrologCode(preformattedExpressionElement: string): string {
	const finalExpression: string = preformattedExpressionElement;
	return finalExpression
		.replace(Regexes.expressionMarker, "")
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

/**
 * Detects issues with an expression
 */
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
	let isEmpty: boolean = true;
	expression.forEach(element => {
		toPos = fromPos + element.length;
		if (element.match(Regexes.bracketLeft)) {
			bracketCount++;
			isEmpty = true;
		} else if (element.match(Regexes.bracketRight)) {
			bracketCount--;
			if (isEmpty === true) {
				addIssue("EMPTY_BRACKET", { fromIndex: fromPos, toIndex: fromPos });
			}
		} else {
			isEmpty = false;
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
		if (/\S/.test(element)) {
			if (element.match(bracket)) {
				if (element.match(Regexes.bracketRight) &&
					foundStatement === false && (foundConnector === true || foundNegation === true)) {
					addIssue("MISSING_STATEMENT_INSIDE", { fromIndex: fromPos, toIndex: fromPos });
				}
				fromPos = fromPos + element.length;
			} else if (element.match(Regexes.negation)) {
				foundNegation = true;
				foundConnector = false;
				foundStatement = false;
				fromPos = fromPos + element.length;
			} else if (element.match(logicConnector)) {
				if (foundNegation === true) {
					addIssue("MISSING_STATEMENT_AFTER_NEGATION", { fromIndex: fromPos, toIndex: fromPos });
				} else if (foundConnector === true || element.match(Regexes.bracketLeft)) {
					addIssue("MISSING_STATEMENT_INSIDE", { fromIndex: fromPos, toIndex: fromPos });
				}
				fromPos = fromPos + element.length;
				foundConnector = true;
				foundStatement = false;
				foundNegation = false;
			} else {
				let i;
				let temp = 0;
				for (i = 0; i < element.length; i++) {
					const char = element.charAt(i);
					if (char.match(Regexes.whiteSpace)) {
						temp++;
					} else {
						if (foundStatement === true && temp > 0) {
							addIssue("MISSING_CONNECTOR", { fromIndex: fromPos, toIndex: fromPos + temp });
						}
						foundConnector = false;
						foundStatement = true;
						foundNegation = false;
						fromPos = fromPos + temp + 1;
						temp = 0;
					}
				}
				fromPos = fromPos + temp;
			}
		} else {
			fromPos = fromPos + element.length;
		}

	}
	if (foundStatement === false && (foundConnector === true || foundNegation === true)) {
		addIssue("MISSING_STATEMENT_INSIDE", { fromIndex: fromPos, toIndex: fromPos });
	}
}

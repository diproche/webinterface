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
	for (let element of expression) {
		element = element.trim();
		if (element.match(bracket) || element.match(Regexes.whiteSpace)) {
			if (element.match(Regexes.bracketRight ) &&
			foundStatement === false && (foundConnector === true || foundNegation === true)) {
				addIssue("MISSING_STATEMENT_INSIDE", { fromIndex: fromPos, toIndex: fromPos });
			}
			fromPos = fromPos + element.length;
		} else if (element.match(Regexes.negation)) {
			foundNegation = true;
			fromPos = fromPos + element.length;
		} else if (element.match(logicConnector)) {
			if (foundNegation === true) {
				addIssue("MISSING_STATEMENT_AFTER_NEGATION", { fromIndex: fromPos, toIndex: fromPos});
			} else if (foundConnector === true || element.match(Regexes.bracketLeft)) {
				addIssue("MISSING_STATEMENT_INSIDE", { fromIndex: fromPos, toIndex: fromPos});
			}
			fromPos = fromPos + element.length;
			foundConnector = true;
			foundStatement = false;
			foundNegation = false;
		} else {
			if (foundStatement === true && foundNegation === false) {
				addIssue("MISSING_CONNECTOR", { fromIndex: fromPos, toIndex: fromPos + element.length });
			}
			foundConnector = false;
			foundStatement = true;
			foundNegation = false;
			fromPos = fromPos + element.length;
		}
	}
}

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
 * seperate the written expression into a array structure
 * @param expression written by user
 * @return the formatted expression
 */
export function preFormatExpressionFromImput(expression: string): string[] {
	const splittedExpression: string[] = expression.split(allowedExpressionToken);
	const filtered = splittedExpression.filter(x => x);
	return filtered;
}

/**
 * format the different
 * input styles for logical vocabulary into one single style supported by SWI prolog
 * @param the expression that could still including different input styles
 * @return finalExpression where expression elements got replaced with readable prolog code elements
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
 * @return a formatted expression element
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
 * This function just calls all the other function with the abilaty to detect wrong user input.
 * @param the pre formatted expression
 * @param expressionPosition where to match issueCodes with the right position
 */
export function expressionIssueDetector(preFormattedExpression: string[], expressionPosition: number) {
	detectBracketIssues(preFormattedExpression, expressionPosition);
	detectMissingStatementsOrConnector(preFormattedExpression, expressionPosition);
}

/**
 * Check the expression for an equal amount of opened find closed brackets.
 * It can detect wrong user input and push issueCodes if it's needed.
 * @param the pre formatted expression
 * @param expressionPosition where to match issueCodes with the right position
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
 * Check the expression for correctness that no logic operators or statements is forgotten.
 * It can detect wrong user input and push issueCodes if it's needed.
 * @param the pre formatted expression
 * @param expressionPosition where to match issueCodes with the right position
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

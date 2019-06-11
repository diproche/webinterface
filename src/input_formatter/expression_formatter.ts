import { addIssue } from "../issueHandling/issueMapping";
const allowedExpressionToken =
	// tslint:disable-next-line: max-line-length
	/(bracketLeft|bracketRight|equivalence|implicationRight|implicationLeft|negation|conjunction|disjunction|equal|addition|subtraction|division|multiplication)+/;
const logicConnector = /(conjunction|disjunction|equivalence|implicationRight|implicationLeft)+/;
const bracket = /(bracketLeft|bracketRight)+/;
const negation = /(negation)+/;

/**
 * main method to format expressions
 * @param expression written by user
 * @return a formatted expression as string[];
 * each element of the expression gets formatted into prolog readable code
 */
export function expressionFormatter(expression: string): string[] {
	const preFormattedExpression: string[] = preFormatExpressionFromImput(expression);
	expressionIssueDetector(preFormattedExpression);
	const finalFormattedExpression: string[] = replaceExpressionElementsIntoPrologCode(preFormattedExpression);
	return finalFormattedExpression;
}

/**
 * @param expression written by user
 * @return a preformatted expression where some different
 * input styles for logical vocabulary gets formatted into one single style
 */
export function preFormatExpressionFromImput(expression: string): string[] {
	const formattedInputExpression: string = expression
		.replace(/(\$)/g, "")
		.replace(/(\[|\()/g, " bracketLeft ")
		.replace(/(\]|\))/g, " bracketRight ")
		.replace(/(<-->|<==>|<=>|<->)/g, " equivalence ")
		.replace(/(->|-->|=>|==>|\\rightarrow)/g, " implicationRight ")
		.replace(/(<-|<--|<=|<==|\/leftarrow)/g, " implicationLeft ")
		.replace(/(neq|not|nicht|¬|-|\\neg)/ig, " negation ")
		.replace(/(and|und|&|∧|\/\\)/ig, " conjunction ")
		.replace(/(or|oder|\||∨|\\\/)/ig, " disjunction ")
		.replace(/(=|==|===|gleich)/g, " equal ")
		.replace(/(\+|plus|add|sum)/g, " addition ")
		.replace(/(-|minus)/g, " subtraction ")
		.replace(/(:|\/|div|geteilt)/g, " division ")
		.replace(/(\*|mal|mult)/g, " multiplication ")
		.trim()
		.replace(/\s{1,}/g, ",");
	const splittedExpression: string[] = formattedInputExpression.split(/[,]+/g);
	return splittedExpression;

}

/**
 * @return finalExpression where expression elements got replaced with readable prolog code elements
 */
export function replaceExpressionElementsIntoPrologCode(preFormattedExpression: string[]): string[] {
	const finalFormattedExpression: string[] = [];
	preFormattedExpression.forEach(element => {
		if (element.match(allowedExpressionToken)) {
			const newElement: string = replaceASingleExpressionElementIntoPrologCode(element);
			finalFormattedExpression.push(newElement);
		} else {
			finalFormattedExpression.push(element);
		}
	});
	return finalFormattedExpression;
}

/**
 * helper function for replaceExpressionElementsIntoPrologCode
 * @return finalExpressionElement
 */
export function replaceASingleExpressionElementIntoPrologCode(preformattedExpressionElement: string): string {
	const finalExpression: string = preformattedExpressionElement;
	return finalExpression
		.replace(/(bracketLeft)/g, "\[")
		.replace(/(bracketRight)/g, "\]")
		.replace(/(equivalence)/g, "<->")
		.replace(/(implicationRight)/g, "->")
		.replace(/(implicationLeft)/g, "<-")
		.replace(/(negation)/g, "neg")
		.replace(/(conjunction)/g, "and")
		.replace(/(disjunction)/g, "or")
		.replace(/(equal)/g, "=")
		.replace(/(addition)/g, "+")
		.replace(/(subtraction)/g, "-")
		.replace(/(multiplication)/g, "*")
		.replace(/(division)/g, ":")
		;
}

export function expressionIssueDetector(preFormattedExpression: string[]) {
	detectBracketIssues(preFormattedExpression);
	detectMissingStatementsOrConnector(preFormattedExpression);
}

/**
 * Check the expression for an equal amount of opened and closed brackets.; it can detect wrong input
 */
export function detectBracketIssues(formattedExpression: string[]) {
	let bracketCount = 0;

	formattedExpression.forEach(element => {
		if (element.match(/(\[|bracketLeft)/)) {
			bracketCount++;
		} else if (element.match(/(\]|bracketRight)/)) {
			bracketCount--;
		}
		if (bracketCount < 0) {
			addIssue("BRACKET_OVERCLOSING");
			bracketCount = 0;
		}
	});
	if (bracketCount > 0) {
		addIssue("BRACKET_UNDERCLOSING");
	} else if (bracketCount < 0) {
		addIssue("BRACKET_OVERCLOSING");
	}
}

/**
 * check the expression for correctness that no logic operators or statements is forgotten; it can detect wrong input
 */
export function detectMissingStatementsOrConnector(formattedExpression: string[]) {
	let foundConnector = true;
	let foundStatement = false;
	let foundNegation = false;
	for (const expr of formattedExpression) {
		if (expr.match(bracket)) {
			continue;
		} else if (expr.match(negation)) {
			foundNegation = true;
		} else if (expr.match(logicConnector)) {
			if (foundNegation === true) {
				addIssue("MISSING_STATEMENT_AFTER_NEGATION");
			} else if (foundConnector === true) {
				addIssue("MISSING_STATEMENT_INSIDE");
			}
			foundConnector = true;
			foundStatement = false;
			foundNegation = false;
		} else {
			if (foundStatement === true) {
				addIssue("MISSING_CONNECTOR");
			}
			foundConnector = false;
			foundStatement = true;
			foundNegation = false;
		}
	}
	if (foundStatement === false || foundConnector === true || foundNegation === true) {
		addIssue("MISSING_STATEMENT_AT_THE_END");
	}

}

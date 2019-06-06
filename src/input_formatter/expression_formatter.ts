import { addIssue } from "../issueHandling/issueMapping";
const allowedExpressionToken = /(bracketLeft|bracketRight|equivalence|implicationRight|implicationLeft|negation|conjunction|disjunction|equal|addition|subtraction|division|multiplication)+/;
const logicConnector = /(conjunction|disjunction|equivalence|implicationRight|implicationLeft)+/;
const bracket = /(bracketLeft|bracketRight)+/;
const negation = /(negation)+/;

/**
* main method to format expressions
* @param expression written by user
* @return a formatted expression
*/
export function expressionFormatter(expression: string) {
	const preFormattedExpression: string[] = preFormatExpressionFromImput(expression);
	expressionIssueDetector(preFormattedExpression);
	const finalFormattedExpression: string[] = replaceExpressionElementsIntoPrologCode(preFormattedExpression);
	return finalFormattedExpression;
}

/**
* 
* @param expression written by user
* @return a preformatted expression where some different input styles for logical vocabulary gets formatted into one single style
*/
export function preFormatExpressionFromImput(expression: string) {
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
* @return finalExpression where exrpession elements got replaced with readable prolog code elements
*/
export function replaceExpressionElementsIntoPrologCode(preFormattedExpression: string[]) {
	const finalFormattedExpression: string[] = [];
	let index = 0;
	while (index < preFormattedExpression.length) {
		if (preFormattedExpression[index].match(allowedExpressionToken)) {
			const element: string = replaceASingleExpressionElementIntoPrologCode(preFormattedExpression[index]);
			finalFormattedExpression.push(element);
		} else {
			finalFormattedExpression.push(preFormattedExpression[index]);
		}
		index++;
	}
	return finalFormattedExpression;

}

/**
* helper function for replaceExpressionElementsIntoPrologCode
* @return finalExpressionElement
*/
export function replaceASingleExpressionElementIntoPrologCode(preformattedExpressionElement: string) {
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
	let index = 0;
	while (index < formattedExpression.length && bracketCount >= 0) {

		if (formattedExpression[index].match(/(\[|bracketLeft)/)) {
			bracketCount++;
		} else if (formattedExpression[index].match(/(\]|bracketRight)/)) {
			bracketCount--;
		}
		index++;
	}
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
	let index = 0;
	let foundConnector = true;
	let foundStatement = false;
	let foundNegation = false;
	while (index < formattedExpression.length) {
		if (formattedExpression[index].match(bracket)) {
			index++;
		} else if (formattedExpression[index].match(negation)) {
			foundNegation = true;
			index++;
		} else if (formattedExpression[index].match(logicConnector)) {
			if (foundNegation === true) {
				addIssue("MISSING_STATEMENT_AFTER_NEGATION");
			} else if (foundConnector === true) {
				addIssue("MISSING_STATEMENT_INSIDE");
			}
			foundConnector = true;
			foundStatement = false;
			foundNegation = false;
			index++;
		} else {
			if (foundStatement === true) {
				addIssue("MISSING_CONNECTOR");
			}
			foundConnector = false;
			foundStatement = true;
			foundNegation = false;
			index++;
		}
	}
	if (foundStatement === false || foundConnector === true || foundNegation === true) {
		addIssue("MISSING_STATEMENT_AT_THE_END");
	}
}

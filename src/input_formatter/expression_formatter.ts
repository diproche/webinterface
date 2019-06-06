import { addIssue } from "../issueHandling/issueMapping";
const allowedExpressionToken = /(bracketLeft|bracketRight|equivalence|implicationRight|implicationLeft|negation|conjunction|disjunction|equal|addition|subtraction|division|multiplication)+/;
const logicConnector = /(conjunction|disjunction|equivalence|implicationRight|implicationLeft)+/;
const nonLogicToken = /(bracketLeft|bracketRight|negation)+/;

/**
	* ---------CurrentExpressionFormatter------------
	* @param expression written by a user
	* @return a formatted expression as String
	*/
export function expressionFormatter(expression: string) {
	const preFormattedExpression: string[] = preFormatExpressionFromImput(expression);
	errorDetector(preFormattedExpression);
	// TO DO SOME STUFF WITH THE TOKENS AND THE ARRAY; FORMAT THE ARRAY AND CATCH ERRORS
	const finalFormattedExpression: string[] =
		replaceExpressionElementsIntoPrologCode(preFormattedExpression);
	return finalFormattedExpression;
}

/**
 * 
 * @param expression as a input string typed by user
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
	* @param formattedExpression
	* @return finalExpression where exrpession elements got replaced with readable prolog code elements
	*/
export function replaceExpressionElementsIntoPrologCode(formattedExpression: string[]) {
	const finalFormattedExpression: string[] = [];
	let index = 0;
	while (index < formattedExpression.length) {
		if (formattedExpression[index].match(allowedExpressionToken)) {
			const element2: string = replaceASingleExpressionElementIntoPrologCode(formattedExpression[index]);
			finalFormattedExpression.push(element2);
		} else {
			finalFormattedExpression.push(formattedExpression[index]);
		}
		index++;
	}
	return finalFormattedExpression;

}

/**
	* helper function for replaceExpressionElementsIntoPrologCode
	* @param formattedExpression
	* @return finalExpression
	*/
export function replaceASingleExpressionElementIntoPrologCode(formattedExpression: string) {
	const finalExpression: string = formattedExpression;
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

export function errorDetector(preFormattedExpression: string[]) {
	detectBracketErrors(preFormattedExpression);
	detectMissingStatementsOrConnector(preFormattedExpression);
}

/**
	* check the expression if the amount of opened and closed brackets is correct; it can detect user mistakes;
	* @param
	* @return
	*/
export function detectBracketErrors(formattedExpression: string[]) {
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

export function detectMissingStatementsOrConnector(formattedExpression: string[]) {
	let index = 0;
	let connector = true;
	let statement = false;
	while (index < formattedExpression.length) {
		if (formattedExpression[index].match(nonLogicToken)) {
			index++;
		} else if (formattedExpression[index].match(logicConnector)) {
			if (connector === true) {
				addIssue("MISSING_STATEMENT_INSIDE");
			}
			connector = true;
			statement = false;
			index++;
		} else {
			if (statement === true) {
				addIssue("MISSING_CONNECTOR");
			}
			connector = false;
			statement = true;
			index++;
		}
	}
	if (statement === false || connector === true) {
		addIssue("MISSING_STATEMENT_AT_THE_END");
	}
}

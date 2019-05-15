const allowedExpressionToken = /(bracketLeft|bracketRight|equivalence|implication|negation|conjunction|disjunction)+/;
const logicConnector = /(conjunction|disjunction|equivalence|implication)+/;
const negation = /(negation)+/;
const bracket = /(bracketLeft|bracketRight)+/;
const test = /(bracketLeft|bracketRight|negation)+/;

/**
* ---------CurrentExpressionFormatter------------
* @param expression written by a user
* @return a formatted expression as String
*/
export function expressionFormatter(expression: string) {
	const preFormattedExpression: string[] = preFormatExpressionFromImput(expression);
	// errorDetector(preFormattedExpression); //TO DO SOME STUFF WITH THE TOKENS AND THE ARRAY; FORMAT THE ARRAY AND CATCH ERRORS
	const finalFormattedExpression: string[] =
		replaceExpressionElementsIntoPrologCode(preFormattedExpression);
	return finalFormattedExpression;
}

export function preFormatExpressionFromImput(expression: string) {
	const formattedInputExpression: string = expression
		.replace(/(\[|\()/g, " bracketLeft ")
		.replace(/(\]|\))/g, " bracketRight ")
		.replace(/(<-->|<==>|<=>|<->)/g, " equivalence ")
		.replace(/(->|-->|=>|==>)/g, " implication ")
		.replace(/(neq|not|nicht|¬|-)/ig, " negation ")
		.replace(/(and|und|&|∧)/ig, " conjunction ")
		.replace(/(or|oder|\||∨)/ig, " disjunction ")
		.trim()								// delete white spaces at the beginn and the end of an expression
		.replace(/\s{1,}/g, ",");			// each element of an expression should seperated with a comma so every left white space are replaced with comma here
	const splittedExpression: string[] = formattedInputExpression.split(/[,]+/g);
	return splittedExpression;

}

/**
* replace expression elements into readable prolog Code
* ---------------------------------------
* @param formattedExpression
* @return finalExpression
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
* replace expression elements into readable prolog Code
* ---------------------------------------
* @param formattedExpression
* @return finalExpression
*/
export function replaceASingleExpressionElementIntoPrologCode(formattedExpression: string) {
	const finalExpression: string = formattedExpression;
	return finalExpression
		.replace(/(bracketLeft)/g, "\[")
		.replace(/(bracketRight)/g, "\]")
		.replace(/(equivalence)/g, "<->")
		.replace(/(implication)/g, "->")
		.replace(/(negation)/g, "neg")
		.replace(/(conjunction)/g, "and")
		.replace(/(disjunction)/g, "or")
		;
}

// i know its not really useful to return a boolean list actually but i will work on it soon to make this function some more usefull;
// im planning to improve this into a exception detector soon and export it into a own ts file
//TO DO: USE THE INDEX AS MARKER WHERE THE ERROR WAS DETECTED AND BUILD A ERROR HASH MAP instead of returning a boolean
export function errorDetector(preFormattedExpression: string[]) {

	const detectedErrors: boolean[] = [];
	if (detectBracketErrors(preFormattedExpression) === true) {
		detectedErrors.push(detectBracketErrors(preFormattedExpression));
	}
	if (detectMissingStatementsOrConnector(preFormattedExpression) === true) {
		detectedErrors.push(detectMissingStatementsOrConnector(preFormattedExpression));
	}

	// maybe do something with the errorlist or not....TO DO STUFF HERE
}


//TO DO: USE THE INDEX AS MARKER WHERE THE ERROR WAS DETECTED AND BUILD A ERROR HASH MAP instead of returning a boolean
/**
* check the expression if the amount of opened and closed brackets is correct; it can detect user mistakes; RETURN true if the user made a mistake;
* ---------------------------------------
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
		// THROW EXCEPTION HERE: Bracket Error; some brackets are not closed; ADD ERROR NUMBER
		return true;
	} else if (bracketCount < 0) {
		// THROW EXCEPTION HERE: Bracket Error; too much brackets has been closed or has been closed before a bracket were opened; ADD ERROR NUMBER
		return true;
	}
	return false;
}

//TO DO: USE THE INDEX AS MARKER WHERE THE ERROR WAS DETECTED AND BUILD A ERROR HASH MAP instead of returning a boolean
export function detectMissingStatementsOrConnector(formattedExpression: string[]) {
	let index = 0;
	let connector = true;
	let statement = false;
	while (index < formattedExpression.length) {
		if (formattedExpression[index].match(test)) {	// ignore negations and brackets here
			index++;
		} else if (formattedExpression[index].match(logicConnector)) {
			if (connector === true) {
				return true; // ERROR: missing statement; ADD ERROR NUMBER
			}
			connector = true;											// mark, that a connector was found
			statement = false;											// unmark statement marker
			index++;
		} else {														//else case means that a statement was found
			if (statement === true) {
				return true; // ERROR: missing connector; ADD ERROR NUMBER
			}
			connector = false;											// unmark connector marker
			statement = true;											// mark, that a statement was found
			index++;
		}
		
	}
	if (statement === false || connector === true){
		return true; // ERROR: missing statement at the end of the expression; ADD ERROR NUMBER
	}

	return false;			// no error detected;
}

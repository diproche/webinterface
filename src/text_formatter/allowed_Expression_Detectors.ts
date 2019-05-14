// TO DO: USE TOKENIZATION INSTEAD OF INPUT

/**
* ---------CurrentExpressionFormatter------------
* @param expression written by a user
* @return a formatted expression as String
*/
export function formatExpressionElements(expression: string) {
	const formattedInputExpression: string = expression;
	return formattedInputExpression
		.replace(/(\[|\()/g, " bracketLeft ")
		.replace(/(\]|\))/g, " bracketRight ")
		.replace(/(<-->|<==>|<=>|<->)/g, " equivalence ")
		.replace(/(->|-->|=>|==>)/g, " implication ")
		.replace(/(neq|not|nicht|¬|-)/ig, " negation ")
		.replace(/(and|und|&|∧)/ig, " conjunction ")
		.replace(/(or|oder|\||∨)/ig, " disjunction ")
		.trim()								// delete white spaces at the beginn and the end of an expression
		.replace(/\s{1,}/g, ","); 			// each element of an expression should seperated with a comma
}

/**
* replace expression elements into readable prolog Code
* ---------------------------------------
* @param formattedExpression 
* @return finalExpression 
*/
export function replaceInputCaractersToReadablePrologCharacter(formattedExpression: string) {
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

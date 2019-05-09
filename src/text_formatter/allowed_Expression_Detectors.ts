/**
* --------------------------------------
* @author: Ronja K.
* ---------------------------------------
*/


// TO DO: USE TOKENIZATION INSTEAD OF INPUT


/**
* ---------CurrentExpressionDetector------------
* ---------every element have their own detect-function--------
* @param
* @return
*/

export function detectExpressionElements(input: string) {
	var formattedInputExpression; // this one should get formatted

	input = detectBracketLeft(input);
	input = detectBracketRight(input);
	input = detectEquivalence(input);
	input = detectImplication(input);
	input = detectNegation(input);
	input = detectConjunction(input);
	input = detectDisjunction(input);
	return input;
}

/** 
* detect and mark left brackets
* ---------------------------------------
* @param
* @return
*/
function detectBracketLeft(input: string) {
	input = input.replace(/(\[|\()/g, " bracketLeft ");
	return input;
}

/** 
* detect and mark right brackets
* ---------------------------------------
* @param
* @return
*/
function detectBracketRight(input: string) {
	input = input.replace(/(\]|\))/g, " bracketRight ");
	return input;
}

/** 
* detect and mark equivalences
* ---------------------------------------
* @param
* @return
*/
function detectEquivalence(input: string) {
	input = input.replace(/(<-->|<==>|<=>|<->)/g, " equivalence ");
	return input;
}

/** 
* detect and mark implications
* ---------------------------------------
* @param
* @return
*/
function detectImplication(input: string) {
	input = input.replace(/(->|-->|=>|==>)/g, " implication ");
	return input;
}

/** 
* detect and mark negations
* ---------------------------------------
* @param
* @return
*/
function detectNegation(input: string) {
	input = input.replace(/(neq|NEQ|Neq|NOT|Not|not|NICHT|Nicht|nicht|¬)/g, " negation ");
	return input;
}

/** 
* detect and mark conjunctions
* ---------------------------------------
* @param
* @return
*/
function detectConjunction(input: string) {
	input = input.replace(/(and|And|AND|und|Und|UND|&|∧)/g, " conjunction ");
	return input;
}

/** 
* detect and mark disjunctions
* ---------------------------------------
* @param
* @return
*/
function detectDisjunction(input: string) {
	input = input.replace(/(or|Or|OR|oder|Oder|ODER|\||∨)/g, " disjunction ");
	return input;
}

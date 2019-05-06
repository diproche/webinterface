// --------------------------------------
// @author: Ronja K.
// ---------------------------------------


// ---------CurrentExpressionDetector------------
// ---------every element have their own detect-function--------
export function detectExpressionElements(input: string) {
	input = detectBracketLeft(input);
	input = detectBracketRight(input);
	input = detectEquivalence(input);
	input = detectImplication(input);
	input = detectImplication(input);
	input = detectNegation(input);
	input = detectConjunction(input);
	input = detectDisjunction(input);
	return input;
}

//detect and mark left brackets
function detectBracketLeft(input: string) {
	input = input.replace(/(\[|\()/g, " bracketLeft ");
	return input;
}

//detect and mark right brackets
function detectBracketRight(input: string) {
	input = input.replace(/(\]|\))/g, " bracketRight ");
	return input;
}

//detect and mark equivalences
function detectEquivalence(input: string) {
	input = input.replace(/(<-->|<==>|<=>|<->)/g, " equivalence ");
	return input;
}

//detect and mark implications
function detectImplication(input: string) {
	input = input.replace(/(->|-->|=>|==>)/g, " implication ");
	return input;
}

//detect and mark negations
function detectNegation(input: string) {
	input = input.replace(/(neq|NEQ|Neq|NOT|Not|not|NICHT|Nicht|nicht|¬)/g, " negation ");
	return input;
}

//detect and mark conjunctions
function detectConjunction(input: string) {
	input = input.replace(/(and|And|AND|und|Und|UND|&|∧)/g, " conjunction ");
	return input;
}

//detect and mark disjunctions
function detectDisjunction(input: string) {
	input = input.replace(/(or|Or|OR|oder|Oder|ODER|\||∨)/g, " disjunction ");
	return input;
}

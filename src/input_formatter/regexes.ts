export const Regexes = {
	// inputSeparator: new RegExp(/(\!|\?|\.|\n)+/, "ig"),
	inputSeparator: new RegExp(/(\!|\?|\.|\n|\$[^$]*\$)+/, "ig"),
	// expressionMarker: new RegExp(/(\$[^$]*\$)+/, "ig"),
	expressionMarker: new RegExp(/\$/, "ig"),
	endProofMarker: new RegExp(/qed/, "ig"),
	wordSeparator: new RegExp(/[ ,]+/, "ig"),
	wordMarker: new RegExp(/([A-Za-zäöüß]+)/, "ig"),
	paragraphMarker: new RegExp(/\n/, "ig"),
	whiteSpace: new RegExp(/\s/, "ig"),
	bracketLeft: new RegExp(/(\[|\(|bracketLeft)/, "ig"),
	bracketRight: new RegExp(/(\]|\)|bracketRight)/, "ig"),
	equivalence: new RegExp(/(<-->|<==>|<=>|<->|equivalence)/, "ig"),
	implicationRight: new RegExp(/(->|-->|=>|==>|\\rightarrow|implicationRight)/, "ig"),
	implicationLeft: new RegExp(/(<-|<--|<=|<==|\/leftarrow|implicationLeft)/, "ig"),
	negation: new RegExp(/(neq|not|nicht|¬|neg)/, "ig"),
	conjunction: new RegExp(/(and|und|&|\/\\|conjunction)/, "ig"),
	disjunction: new RegExp(/(or|oder|\||\\\/|disjunction)/, "ig"),
	equal: new RegExp(/(=|==|===|gleich|equal)/, "ig"),
	addition: new RegExp(/(\+|plus|add|sum)/, "ig"),
	subtraction: new RegExp(/(-|minus)/, "ig"),
	division: new RegExp(/(:|\/|div|geteilt)/, "ig"),
	multiplication: new RegExp(/(\*|mal|mult)/, "ig"),
	wordEndsWithComma: new RegExp(/^(.+),$/, "ig"),
};

export const orRegex = (...regexes: RegExp[]) =>
	new RegExp(regexes.map(r => r.source).join("|"));

export const bracket = new RegExp(orRegex(
	Regexes.bracketLeft,
	Regexes.bracketRight,
), "ig");

export const implication = new RegExp(orRegex(
	Regexes.implicationRight,
	Regexes.implicationLeft,
), "ig");
export const logicConnector = new RegExp(orRegex(
	Regexes.conjunction,
	Regexes.disjunction,
	Regexes.equivalence,
	implication,
), "ig");
export const functionalConnector = new RegExp(orRegex(
	Regexes.equal,
	Regexes.addition,
	Regexes.subtraction,
	Regexes.multiplication,
	Regexes.division,
), "ig");

export const allowedExpressionToken = new RegExp(orRegex(
	Regexes.expressionMarker,
	bracket,
	Regexes.equivalence,
	implication,
	Regexes.negation,
	Regexes.conjunction,
	Regexes.disjunction,
	functionalConnector,
), "ig");

/**
	* Converts a string to an array of numbers
	* @param integerArrayAsString - A string representing a array of integers (i.e. [16, 87, 27])
	* @return An array of integers represented by the string
	*/
export default function parseStringToIntegerArray(integerArrayAsString: string) {

	if (integerArrayAsString === "[]") {
		return [];
	}

	if (
		integerArrayAsString.substr(0, 1) !== "[" ||
		integerArrayAsString.substr(integerArrayAsString.length - 1, 1) !== "]"
	) {
		throw new Error("The given string is not contained in brackets '[]'");
	}

	// Removing the outter brackets
	integerArrayAsString = integerArrayAsString.substr(1, integerArrayAsString.length - 2);

	const arrayOfInteger = integerArrayAsString.split(",").map(s => Number.parseInt(s, 10));

	return arrayOfInteger;

}

 /**
  * Converts a string to an array of numbers
  * @param integerArrayString - A string representing a array of integers (i.e. [16, 87, 27])
	* @return An array of integers represented by the string
	*/
export function parseStringToIntegerArray(integerArrayString: string) {

	if (integerArrayString === "[]") {
		return [];
	}

	if (
		integerArrayString.substr(0, 1) !== "[" ||
		integerArrayString.substr(integerArrayString.length - 1, 1) !== "]"
	) {
		throw new Error("The given string is not contained in brackets '[]'");
	}
	console.log("HI");

	// Removing the outter brackets
	integerArrayString = integerArrayString.substr(1, integerArrayString.length - 2);

	console.log(integerArrayString);

	const arrayOfStrings: string[] = integerArrayString.split(",");
	const arrayOfInteger: number[] = [];

	arrayOfStrings.forEach((numberString: string) => {
		arrayOfInteger.push(Number.parseInt(numberString, 10));
	});

	return arrayOfInteger;

}

export default parseStringToIntegerArray;

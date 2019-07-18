/**
	* Adds a string at a certain position, but the position doesn't increase with HTML tags
	* @param basisString - The string which a string shall be added into
	* @param stringToAdd - The string to be inserted
	* @param position - At what position the strings should be added. Can take multiple position as an array too.
	* @param doubleUP - If true it will put the stringToAdd there even if it already exists at this location
	* @return The initial string with the added string (according to the doubleUP parameter)
	*/
function addStringIgnoringHTML(
	basisString: string,
	stringToAdd: string,
	initialPosition: number | number[],
	doubleUp: boolean = false,
): string {
	if (stringToAdd === "") {
		return basisString;
	}

	let copiedBasisString = basisString;
	let position: number[];

	if (!Array.isArray(initialPosition)) {
		position = [initialPosition];
	} else {
		position = initialPosition;
	}

	checkErrorCases(position, basisString);

	// Smallest numbers first
	let sortedPositionArray = position.sort((p1, p2) => p1 - p2);

	// Will be in the order of the index number. Smaller index first
	const htmlTags: Array<[number, string]> = [];

	let matches: RegExpExecArray | null;
	while (matches = htmlRegExp.exec(copiedBasisString)) {
		htmlTags.push([matches.index, matches[0]]);
	}

	let firstTag: [number, string] | undefined;

	while ( firstTag = htmlTags.shift() ) {
		const spanishInquisition: boolean = !firstTag;
		if (spanishInquisition) {
			throw new Error("Unexpected Spanish Inquisition.");
		}

		sortedPositionArray = sortedPositionArray.map((indexForInsertion: number) => {
			if (firstTag![0] >= indexForInsertion) {
				return indexForInsertion;
			}

			return indexForInsertion + firstTag![1].length;
		});
	}

	// Increasing the positions of the other indeces for previous insertions
	sortedPositionArray = sortedPositionArray.map((indexForInsertion: number) => {
			const previousInsertions: number[] = sortedPositionArray.filter((index: number) => index < indexForInsertion);
			return indexForInsertion + (previousInsertions.length * stringToAdd.length);
	});

	// Inserting the stringToAdd at the specified and adjusted positions
	sortedPositionArray.forEach((indexForInsertion: number) => {
			// Preventing the doubling up of strings if specified
			if (doubleUp || copiedBasisString.substr(indexForInsertion, stringToAdd.length) !== stringToAdd) {
				copiedBasisString = insertAt(indexForInsertion, copiedBasisString, stringToAdd);
			}
	});

	return copiedBasisString;

}

function checkErrorCases(positions: number[], basisString: string) {
	positions.forEach((singlePosition: number) =>  {
		if (singlePosition < 0 || singlePosition > basisString.length + 1) {
			throw new Error("Index Out Of Bound");
		}
	});
}

function insertAt(indexForInsertion: number, basisString: string, stringToAdd: string): string {
	const stringCopy: string = basisString;
	return stringCopy.substr(0, indexForInsertion)
		+ stringToAdd
		+ stringCopy.substr(indexForInsertion);
}

// Based on https://haacked.com/archive/2004/10/25/usingregularexpressionstomatchhtml.aspx/
const htmlRegExp = /<\/?\w+(?:(?:\s+\w+(?:\s*=\s*(?:".*?"|'.*?'|\[\^'">\s\]+))?)+\s*|\s*)\/?>/ig;

export default addStringIgnoringHTML;

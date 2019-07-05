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
	position: number | number[],
	doubleUp: boolean = false,
): string {
	let copiedBasisString = basisString;

	if (!Array.isArray(position)) {
		position = [position];
	}

	// Smalles numbers first
	const sortedPositionArray = position.sort((p1, p2) => p1 - p2);

	let currentActualIndex: number = 0;
	let currentHTMLIgnoringIndex: number = 0;

	sortedPositionArray.forEach((currentlySearchedPosition: number) => {
		while (currentHTMLIgnoringIndex < currentlySearchedPosition) {
			if (copiedBasisString.charAt(currentActualIndex) === "<") {
				currentActualIndex++;
				while (copiedBasisString.charAt(currentActualIndex) !== ">") {
					currentActualIndex++;
				}
				currentActualIndex++;
			} else {
				currentActualIndex++;
				currentHTMLIgnoringIndex++;
		 	}
		}

		// Preventing the doubling up of strings if specified
		if (doubleUp || copiedBasisString.substr(currentActualIndex, stringToAdd.length) !== stringToAdd) {
			copiedBasisString =
				copiedBasisString.slice(0, currentActualIndex)
				+ stringToAdd
				+ copiedBasisString.slice(currentActualIndex);
		}
	});

	return copiedBasisString;

}

export default addStringIgnoringHTML;

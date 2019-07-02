/**
	* Fetches a RegExp's group's values by its number for all matches
	* @param {string} textBasis - The text to be fetched from
	* @param {RegExp} - The RegExp pattern with groups to be used
	* @param {number} - Which group number to fetch
	* @return {Array<string>} All values for this group
	*/
export function fetchAllMatchesForAGroup(basis: string, pattern: RegExp, group: number): string[] {
	const groupContent: string[] = [];
	let matchGroups: string[] | null;

	while ((matchGroups = pattern.exec(basis)) !== null) {
		groupContent.push(matchGroups[group]);
	}

	return groupContent;
}

/**
	* Fetches a RegExp's group's values by its number for all matches
	* @param textBasis - The text to be fetched from
	* @param pattern - The RegExp pattern with groups to be used
	* @param group - Which group number to fetch
	* @return All values for this group
	*/
export function fetchAllMatchesForAGroup(textBasis: string, pattern: RegExp, group: number): string[] {
	const groupContent: string[] = [];
	let matchGroups: string[] | null;

	while ((matchGroups = pattern.exec(textBasis)) !== null) {
		groupContent.push(matchGroups[group]);
	}

	return groupContent;
}

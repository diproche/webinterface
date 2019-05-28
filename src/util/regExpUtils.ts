export function fetchAllMatchesForAGroup(basis: string, pattern: RegExp, group: number): string[] {
	const groupContent: string[] = [];
	let matchGroups: string[] | null;

	while ((matchGroups = pattern.exec(basis)) !== null) {
		groupContent.push(matchGroups[group]);
	}

	return groupContent;
}

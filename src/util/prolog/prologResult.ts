// First Group will be the variable value. Doesn't fetch the variable names
const variableAnswerPattern: string = " = (\\w*|\\[.*\\])?(,| ;|.)";
const booleanAnswerRegExp = /^(true|false)( ;|,|.)$/;

export class PrologResult {
	private readonly rawResults: string[];
	private results: Map<string, Array<string | boolean>> | undefined;

	constructor(rawResults: string[]) {
		this.rawResults = rawResults;
	}

	public getRawResults() {
		return this.rawResults;
	}

	/**
		* Generates (if needed) and returns the results.
		*
		*
		*/
	public getResults(): Map<string, Array<string | boolean>> {
		if (this.results !== undefined) { return this.results; }

		const results = new Map();

		this.getVariables().forEach((variable: string) => {
			results.set(variable, this.getResultsFor(variable));

		});

		results.set("booleanAnswers", this.getBooleans());

		this.results = results;
		return results;
	}

	public getResultArray(): string[][] {
		const results: string[][] = [];
		this.rawResults.forEach((e: string) => {
			results.push(this.rawResultsToInnerArray(e));
		});

		return results;
	}

	private getResultsFor(variable: string): string[] {
		// Group 1 will be the content of the variable independent of the variable length.
	 const pattern = new RegExp(variable + variableAnswerPattern, "g");
	 return this.regexGroupToArray(this.rawResults.toString(), pattern, 1);
	}

	private rawResultsToInnerArray(source: string): string[] {

	// Returns ["true"] or ["false"] in case of boolean answers
	const booleanAnswer = booleanAnswerRegExp.exec(source);
	if (booleanAnswer !== null) { return [booleanAnswer[1]]; }

	const pattern = new RegExp(variableAnswerPattern, "g");
	return this.regexGroupToArray(source, pattern, 1);
	}

	private getVariables(): Set<string> {

		// Second group contains the variable names
		const pattern = /(^| )([A-Z]\w*)/g;
		const rawVariables: string[] = this.regexGroupToArray(this.rawResults.toString(), pattern, 2);

		return new Set(rawVariables);
	}

	private getBooleans(): boolean[] {
		const pattern = /(true|false)(,| ;|.)/g;
		const results: string[] = this.regexGroupToArray(this.rawResults.toString(), pattern, 1);
		const booleanResults: boolean[] = results.map((e: string) => e === "true");

		return booleanResults;
	}

	private regexGroupToArray(basis: string, pattern: any, group: number): string[] {
		const groupContent: string[] = [];
		let matchGroups: string[];

		while ((matchGroups = pattern.exec(basis)) !== null) {
			groupContent.push(matchGroups[group]);
		}

		return groupContent;
	}
}

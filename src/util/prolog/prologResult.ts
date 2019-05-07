export class PrologResult {
	private readonly rawResults: string[];
	private readonly results: string[][];

	// First Group will be the variable value. Doesn't fetch the variable names
	private readonly prologAnswerPattern: string = " = (\\w*|\\[.*\\])?(,| ;|.)";

	constructor(rawResults: string[]) {
		this.rawResults = rawResults;
		this.results = [];
	}

	public getResults(): string[][] {
		if (this.results.length >= 1 ) { return this.results; }

		this.rawResults.forEach((e: any) => {
			this.results.push(this.rawResultsToInnerArray(e));
		});

		return this.results;
	}

	public getResultsFor(variable: string): string[] {
		// Group 1 will be the content of the variable independent of the variable length.
	 const pattern: any = new RegExp(variable + this.prologAnswerPattern, "g");
	 return this.regexGroupToArray(this.rawResults.toString(), pattern, 1);
	}

	public filterBooleanResults(): string[][] {
		const copy: string[][] = this.getResults();
		return copy.filter((e: any) => {
			return e[0] === "true" || e[0] === "false";
		});
	}

	public filterVariableResults(): string[][] {
		const copy: string[][] = this.getResults();
		return copy.filter((e: any) => {
			return !(e[0] === "true" || e[0] === "false");
		} );
	}

	private rawResultsToInnerArray(source: string): string[] {

	if (source.includes("true")) { return ["true"]; }
	if (source.includes("false")) { return["false"]; }

	const pattern: any = new RegExp(this.prologAnswerPattern, "g");
	return this.regexGroupToArray(source, pattern, 1);
	}

	private regexGroupToArray(basis: string, pattern: any, group: number): string[] {
		const groupContent: string[] = [];
		let aux: string[];

		while ((aux = pattern.exec(basis)) !== null) {
			groupContent.push(aux[group]);
		}

		return groupContent;
	}

}

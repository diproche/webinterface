import * as ld from "lodash";

// First Group will be the variable value. Doesn't fetch the variable names
const prologAnswerPattern: string = " = (\\w*|\\[.*\\])?(,| ;|.)";

export class PrologResult {
	private readonly rawResults: string[];
	private readonly results: Map<string, Map<number, string|boolean>>;

	constructor(rawResults: string[]) {
		this.rawResults = rawResults;
		this.results = new Map();
	}

	public getResults(): Map<string, Map<number, string|boolean>> {
		if (this.results.size !== 0) { return this.results; }

		const results = new Map();
		let i: number;

		this.getVariables().forEach((e: string) => {
			results.set(e, new Map());
			i = 0;

			this.getResultsFor(e).forEach((e2: string) => {
				results.get(e).set(i, e2);
				i++;
			});

		});

		results.set("Boolean", new Map());
		i = 0;

		this.getBooleans().forEach((e: boolean) => {
			results.get("Boolean").set(i, e);
			i++;
		});

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
	 const pattern: any = new RegExp(variable + prologAnswerPattern, "g");
	 return this.regexGroupToArray(this.rawResults.toString(), pattern, 1);
	}

	private rawResultsToInnerArray(source: string): string[] {

	if (source.includes("true")) { return ["true"]; }
	if (source.includes("false")) { return["false"]; }

	const pattern: any = new RegExp(prologAnswerPattern, "g");
	return this.regexGroupToArray(source, pattern, 1);
	}

	private getVariables(): Set<string> {
		const variables = new Set();

		// Second group contains the variable names
		const pattern: RegExp = /(^| )([A-Z]\w*)/g;
		const rawVariables: string[] = this.regexGroupToArray(this.rawResults.toString(), pattern, 2);

		rawVariables.forEach((e: string) => {
			variables.add(e);
		});
	 return variables;
	}

	private getBooleans(): boolean[] {
		const pattern: RegExp = /(true|false)(,| ;|.)/g;
		let results: any[] = this.regexGroupToArray(this.rawResults.toString(), pattern, 1);
		results = results.map((e: string) => {
			return (e === "true") ? true : false;
		});

		return results;
}

private regexGroupToArray(basis: string, pattern: any, group: number): string[] {
	const groupContent: string[] = [];
	let aux: string[];

	while ((aux = pattern.exec(basis)) !== null) {
		groupContent.push(aux[group]);
	}

	return groupContent;
}
	/* With the usage of maps not necessary

	public filterBooleanResults(): boolean[] {
		let copy: string[][] = this.getResultArray();
		copy = copy.filter((e: any) => e.length === 1 && (e[0] === "true" || e[0] === "false"));

		const flatCopy: any[] = ld.flattenDeep(copy);

		return flatCopy.map((e: any) => {
			return (e === "true") ? true : false;
		});
	}

	public filterVariableResults(): string[][] {
		const copy: string[][] = this.getResultArray();
		return copy.filter((e: any) => {
			return !(e[0] === "true" || e[0] === "false");
		} );
	}
	*/
}

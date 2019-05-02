export class PrologResult {
	private readonly results: string[][];
	private readonly rawResults: string[];

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

	public filterBooleanResults(): string[][] {
		const copy: string[][] = this.getResults();
		return copy.filter((e: any) => {
			return e[0] === "true" || e[0] === "false";
		} );
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

		// Fetches everything after the = including the =
	 const pattern: any = /= (\w*|\[.*\])?(,| ;|.)/g;
	 const components: any = source.match(pattern);

	 const result: string[] = [];

	 components.forEach((e: any) => {
			// Throws out the first two chars (= and a blank) and the last char (either , ; or .)
			const toAdd: string = e.substring(2, e.length - 1).trim();
			result.push(toAdd);
	});

	 return result;
	}

}

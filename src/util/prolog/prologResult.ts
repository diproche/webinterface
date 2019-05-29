import {fetchAllMatchesForAGroup} from "../regExpUtils";

// First Group will be the variable value. Doesn't fetch the variable names
const variableAnswerPattern: string = " = (\\w*|\\[.*\\])?(,| ;|.)";

// First Group contains true or false
const booleanAnswerRegExp = /^(true|false)( ;|,|.)$/;

// Second group contains the variable names
const variableNameRegExp = /(^| )([A-Z]\w*)/g;

/** Handles the results for a prolog query returned by PrologSession.executeQuery() */
export class PrologResult {
	private readonly rawResults: string[];
	private results: Map<string, Array<string | boolean>> | undefined;

	/**
		* Simply forwards the raw results to its respective attribute
		* @param {Array<string>} rawResults - The string array containing the results
		*/
	constructor(rawResults: string[]) {
		this.rawResults = rawResults;
	}

	/**
		* rawResults getter-Methode
		* @return {Array<string>} The raw results
		*/
	public getRawResults(): string[] {
		return this.rawResults;
	}

	/**
		* Creates and returns curated results
		* First call generates and saves the results to its respective attribute to then return it.
		* Further calls only return the attribute.
		* @return {Map<string, Array<string | boolean>>} First Level: Variable -> Array of assigned values
		*/
	public getResults(): ReadonlyMap<string, Array<string | boolean>> {
		if (this.results !== undefined) { return this.results; }

		const results = new Map();

		this.getVariables().forEach((variable: string) => {
			results.set(variable, this.getResultsFor(variable));

		});

		results.set("booleanAnswers", this.getBooleans());

		this.results = results;
		return results;
	}

	/**
		* Alternative way to access the results via an array.
		* @return {Array<Array<string>>} First Level: i-1-th answer Second Level: Variable in query's order
		*/
	public getResultArray(): string[][] {
		const results: string[][] = [];
		this.rawResults.forEach((e: string) => {
			results.push(this.rawResultsToInnerArray(e));
		});

		return results;
	}

	/**
		* Receives the filled in values for a single variable
		* @param {string} variable - The variable to fill in
		* @return {Array<string>} Fill in values in order of their return
		*/
	private getResultsFor(variable: string): string[] {
		// Group 1 will be the content of the variable independent of the variable length.
		const pattern = new RegExp(variable + variableAnswerPattern, "g");
		return fetchAllMatchesForAGroup(this.rawResults.toString(), pattern, 1);
	}

	/**
		* Curates and raw results so every variable has their own field and only their fill in values are given
		* @param {string} variable - One line of a raw result
		* @return {Array<string>} The curated result
		*/
	private rawResultsToInnerArray(source: string): string[] {

		// Returns ["true"] or ["false"] in case of boolean answers
		const booleanAnswer = booleanAnswerRegExp.exec(source);
		if (booleanAnswer !== null) { return [booleanAnswer[1]]; }

		const pattern = new RegExp(variableAnswerPattern, "g");
		return fetchAllMatchesForAGroup(source, pattern, 1);
	}

	/**
		* @return {Set<string>} All variable which are assigned to in the raw results
		*/
	private getVariables(): Set<string> {
		const rawVariables: string[] = fetchAllMatchesForAGroup(this.rawResults.toString(), variableNameRegExp, 2);

		return new Set(rawVariables);
	}

	/**
		* @return {Array<boolean>} All boolean answers in the raw results (order sensitive)
		*/
	private getBooleans(): boolean[] {
		const pattern = /(true|false)(,| ;|.)/g;
		const results: string[] = fetchAllMatchesForAGroup(this.rawResults.toString(), pattern, 1);
		const booleanResults: boolean[] = results.map((e: string) => e === "true");

		return booleanResults;
	}
}

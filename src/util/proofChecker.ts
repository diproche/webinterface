import Issue from "../issueHandling/issue";
import {listAllIssues} from "../issueHandling/issueMapping";
import { createErrors } from "./diproche/diprocheInterface";

// Ordered by their degree of fatality
const severities: string[] = ["FATALERROR", "ERROR", "WARNING", "HINT"];

/**
	* Checks the userinput and returns the Issues it caused
	* @param {string} userInput - The user input
	* @return {Array<Issue>} The syntatical, sementatical and technical issues for the given user input
	*/
export async function checkProof(userInput: string): Promise<readonly Issue[]> {
	createErrors(userInput);
	return orderIssuesBySeverity(listAllIssues());
}

export async function getDiprocheResponse(userInput: string): Promise<string> {

	const body = userInput;

	const response = await fetch("http://localhost:3000/dipr", {
		headers: {
			"Content-Type": "application/x-prolog",
		},
		method: "POST",
		body,
	});

	const responseText = await response.text();
	return responseText;
}

/**
	* Returns a given issue array in the order of the the issue's fatality (most fatal first)
	* @param {readonly Issue[]} issues - The Issue Array to be ordered
	* @return {Array<Issue>} The ordered Issue Array
	*/
function orderIssuesBySeverity(issues: readonly Issue[]): readonly Issue[] {

	let orderedIssues: Issue[] = [];

	// Adds Issues by their severity in the order of constant severities
	severities.forEach((severity: string) => {
		orderedIssues = orderedIssues.concat(
			issues.filter((singleIssue: Issue) => singleIssue.severity === severity),
		);
	});

	return orderedIssues;
}

import Issue from "../issueHandling/issue";
import {listAllIssues} from "../issueHandling/issueMapping";

// Ordered by their degree of fatality
const severities: string[] = ["FATALERROR", "ERROR", "WARNING", "HINT"];

/**
	* Checks the userinput and returns the Issues it caused
	* @param {string} userInput - The user input
	* @return {Array<Issue>} The syntatical, sementatical and technical issues for the given user input
	*/
export function checkProof(userInput: string): readonly Issue[] {

	// runPipeline(userinput); (or whatever will run the userinput through the checks)
	return orderIssuesBySeverity(listAllIssues());
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

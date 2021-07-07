import DiprocheHandler from "./diproche/diprocheHandler";
import { createErrors } from "./diproche/diprocheInterface";
import Issue from "./issueHandling/issue";
import { emptyIssueList, listAllIssues } from "./issueHandling/issueMapping";
import parseStringToIntegerArray from "./parseStringToIntegerArray";

// Ordered by their degree of fatality
const severities: string[] = ["FATALERROR", "ERROR", "WARNING", "HINT"];

const unloadedDiproche = new DiprocheHandler();
unloadedDiproche.loadDiproche();

export const diproche: DiprocheHandler = unloadedDiproche;

/**
	* Checks the userinput and returns the Issues it caused
	* @param userInput - The user input
	* @return The syntatical, sementatical and technical issues for the given user input
	*/
export async function checkProof(userInput: string): Promise<readonly Issue[]> {
	emptyIssueList();
	const curatedUserInput: string = userInput.replace(/\n/g, " ");
	await createErrors(curatedUserInput);
	return orderIssuesBySeverity(listAllIssues());
}

/**
	* Receives the diproche response for a given input
	* @param diprocheInput - The input one would enter into diproche
	* @return The diproche reponse
	*/
export async function getDiprocheResponse(diprocheInput: string): Promise<number[]> {

	const result: string = await diproche.query(diprocheInput);
	const returnValue: number[] = parseStringToIntegerArray(result);

	return returnValue;

}

/**
	* Returns a given issue array in the order of the the issue's fatality (most fatal first)
	* @param issues - The Issue Array to be ordered
	* @return The ordered Issue Array
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

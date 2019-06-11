import Issue from "./issue";
import issueJson from "./knownIssues.json";
import Position from "./position";

/** All the valid issue-codes */
export type IssueCode = keyof typeof issueJson;

/**
 * This function needs to be called when someone wants to store a known issue;
 * @param issueJson the issueobject that should be stored in the issuelist.
 * @param addPosition optional position where issue is located;
 * @param replacements optional replacements for the placeholders in the issue message.
 */
export function addIssue(
	issueCode: IssueCode,
	position?: Position,
	replacements?: { [placeholder: string]: string | number }) {
	const issue: Issue = {
		...issueJson[issueCode],
		code: issueCode,
		position,
	};
	addIssueToIssueList(issue);
}

let foundIssues: Issue[] = [];

export function emptyIssueList() {
	foundIssues = [];
}

/**
 * this method is called by the addIssue function
 * @param issue that is added to the issuelist
 */
export function addIssueToIssueList(issue: Issue) {
	foundIssues.push(issue);
}

export function listAllIssues(): ReadonlyArray<Issue> {
	return foundIssues;
}

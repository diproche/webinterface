import data from "./known_issues.json";

export const knownIssueCodes = data;

export class IssueObject {
	public code!: string;
	public message!: string;
	public severity!: string;
	public startposition?: number;
}
export function emptyIssueList() {
	foundIssues = [];
	emptyHintsList();
	emptyWarningsList();
	emptyErrorsList();
	emptyFatalErrorsList();
}
export function emptyHintsList() {
	foundHints = [];
}
export function emptyWarningsList() {
	foundWarnings = [];
}
export function emptyErrorsList() {
	foundErrors = [];
}
export function emptyFatalErrorsList() {
	foundFatalErrors = [];
}

// creating reference map with errormessages; could add some stuff to the map if needed
let foundHints: IssueObject[] = [];
let foundWarnings: IssueObject[] = [];
let foundErrors: IssueObject[] = [];
let foundFatalErrors: IssueObject[] = [];
let foundIssues: IssueObject[] = [];

export function getIssueCodeFromJSON(issue: { [s: string]: {}; } | ArrayLike<{}>) {
	const issueCodes = Object.keys(issue);
	const issueCode = issueCodes[0];
	return issueCode;
}

export function addIssueToIssueMap(severity: number, issueCode: string, issueMessage: string, startPosition: number) {
	const issue: IssueObject = new IssueObject();
	issue.code = issueCode;
	issue.startposition = startPosition;
	issue.message = issueMessage;
	if (severity === 0) {
		issue.severity = "Hint";
		foundHints.push(issue);
	} else if (severity === 1) {
		issue.severity = "Warning";
		foundWarnings.push(issue);
	} else if (severity === 2) {
		issue.severity = "Error";
		foundErrors.push(issue);
	} else if (severity === 3) {
		issue.severity = "Fatal Error";
		foundFatalErrors.push(issue);
	}
	foundIssues.push(issue);
}

export function listHints() {
	return foundHints;
}

export function listWarnings() {
	return foundWarnings;
}

export function listErrors() {
	return foundErrors;
}

export function listFatalErrors() {
	return foundFatalErrors;
}

export function listAllIssues() {
	return foundIssues;
}

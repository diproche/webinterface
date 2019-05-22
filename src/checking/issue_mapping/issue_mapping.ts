/**
 * Imports
 */
import data from "./known_issues.json";

export enum Severity {
	/** A problem that does not affect the correctness of the
	 * input and can possibly be ignored.
	 */
	Hint,
	/** A problem that is not technically making the input
	 * incorrect, but is either indicating or encouraging a
	 * real problem.
	 */
	Warning,
	/** A solid incorrectness in the users input, that is not
	 * preventing the further checking process to take place.
	 */
	Error,
	/** A problem that is immediately stopping all further
	 * attempts to check the input.
	 */
	FatalError,
}

/**
 * export jsonFile as jsonObject named knownIssueCodes
 */
export const knownIssueCodes = data;

/**
 * @constructor for IssueObjects
 */
export class IssueObject {
	/**
	 * Each issue needs a code - known issue codes are listed in: ./known_issues.json
	 */
	public code!: string;

	/**
	 * Each issue needs a issue message - known issue codes are listed in: ./known_issues.json
	 */
	public message!: string;
	/**
	 * Each issue needs a severity, severitys are: Hint, Warning, Error or Fatal Error. More infos in ../issue;
	 */
	public severity!: string;
	/**
	 * optional: the position where issue is detected.
	 */
	public position?: number;
}

/**
 * lists to store IssueObjects
 */
let foundHints: IssueObject[] = [];
let foundWarnings: IssueObject[] = [];
let foundErrors: IssueObject[] = [];
let foundFatalErrors: IssueObject[] = [];
let foundIssues: IssueObject[] = [];

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

/**
 * @param issue as jsonobject where the known issue is stored
 * @return issueCode which is the key of the jsonobject
 */
export function getIssueCodeFromJSON(issue: { [s: string]: {}; } | ArrayLike<{}>) {
	const issueCodes = Object.keys(issue);
	const issueCode = issueCodes[0];
	return issueCode;
}

/**
 * @param severity of an IssueObject
 * @param issueCode of an IssueObject
 * @param issueMessage of an IssueObject
 * @param position of an IssueObject (optional)
 */
export function addIssueToIssueMap(severity: Severity, issueCode: string, issueMessage: string, position: number) {
	const issue: IssueObject = new IssueObject();
	issue.code = issueCode;
	if (isNaN(position) === false) {
		issue.position = position;
	}
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

export function getIssueCodeFromIssue(obj: IssueObject) {
	return obj.code;
}
export function getIssueMessageFromIssue(obj: IssueObject) {
	return obj.message;
}
export function getIssueSeverityFromIssue(obj: IssueObject) {
	return obj.severity;
}
export function getIssuePositionFromIssue(obj: IssueObject) {
	return obj.position;
}

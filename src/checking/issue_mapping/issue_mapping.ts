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
	public severity!: Severity;
	/**
	 * optional: the position where issue is detected.
	 */
	public position?: number;
}

/**
 * list where IssueObjects are stored
 */
let foundIssues: IssueObject[] = [];

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
 * @param issueCode of an IssueObject
 * @param issueMessage of an IssueObject
 * @param severity of an IssueObject
 * @param position of an IssueObject (optional)
 */
export function addIssueToIssueList(issue: IssueObject) {
	foundIssues.push(issue);
}

export function createIssue(issueCode: string, issueMessage: string, severity: Severity, position: number) {
	const issue: IssueObject = new IssueObject();
	issue.code = issueCode;
	issue.message = issueMessage;
	issue.severity = severity;

	/** only add position if its a number */
	if (isNaN(position) === false) {
		issue.position = position;
	}
	return issue;
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

/** empty the issueList */
export function emptyIssueList() {
	foundIssues = [];
}

/**
 * @param issueCode to search in a list of issues
 * @return the searched issueObject or the ISSUE-NOT-FOUND issueObject
 */
export function getIssueFromIssueListByCode(issueCode: string) {
	foundIssues.forEach(element => {
		if (element.code === issueCode) {
			return element;
		}
	});
	/** if the searched Issue is not added to issue list return the ISSUE NOT FOUND ERROR */
	const newIssueCode = getIssueCodeFromJSON(knownIssueCodes.FATAL_ERRORS["ISSUE-NOT-FOUND"]);
	const newIssueMessage = knownIssueCodes.FATAL_ERRORS["ISSUE-NOT-FOUND"]["ISSUE-NOT-FOUND"];
	const severity = Severity.FatalError;
	const position = NaN;
	const issue: IssueObject = createIssue(newIssueCode, newIssueMessage, severity, position);

	return issue;
}

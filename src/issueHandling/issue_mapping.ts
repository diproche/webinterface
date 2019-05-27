import Issue from "./issue";
import jsonFile from "./known_issues.json";
import Position from "./position";

/**
 * export jsonFile as jsonObject named ISSUES | import it to access to known_issues.json
 */
export const ISSUES = jsonFile;

/**
 * This function needs to be called when someone wants to store a known issue;
 * @param issueJson the issueobject that should be stored in the issuelist.
 * @param addPosition optional position where issue is located;
 */
export function addIssue(issueJson: { CODE: string; SEVERITY: string; MESSAGE: string; }, addPosition?: Position) {
	const issue: Issue = {
		severity: issueJson.SEVERITY,
		code: issueJson.CODE,
		position: addPosition,
		message: issueJson.MESSAGE,
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

export function listAllIssues() {
	return foundIssues;
}

export function getIssueCodeFromIssue(obj: Issue) {
	return obj.code;
}
export function getIssueMessageFromIssue(obj: Issue) {
	return obj.message;
}
export function getIssueSeverityFromIssue(obj: Issue) {
	return obj.severity;
}
export function getIssuePositionFromIssue(obj: Issue) {
	return obj.position;
}

/**
 *
 * @param issueJson the issueobject that should be searched represented as json.
 * @param addPosition optional position where issue is located;
 * @return an issueobject stored in the issuelist or the issue_not_found error;
 */
export function getIssue(issueJson: { CODE: string; SEVERITY: string; MESSAGE: string; }, addPosition?: Position) {
	let found = false;
	let index = 0;
	while (index < foundIssues.length && found === false) {
		if (issueJson.CODE === foundIssues[index].code) {
			found = true;
		}
		index++;
	}

	if (found === true) {
		return foundIssues[index - 1];
	} else {
		const issue: Issue = {
			severity: ISSUES.ISSUE_NOT_FOUND.SEVERITY,
			code: ISSUES.ISSUE_NOT_FOUND.CODE,
			position: addPosition,
			message: ISSUES.ISSUE_NOT_FOUND.MESSAGE,
		};
		return issue;
	}
}

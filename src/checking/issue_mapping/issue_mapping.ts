
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



export const knownIssueCodes = data;

export function emptyIssueList() {
	issueReferenceMap.clear();
	emptyHintsList();
	emptyWarningsList();
	emptyErrorsList();
	emptyFatalErrorsList();
}
export function emptyHintsList() {
	foundHints.clear();
}
export function emptyWarningsList() {
	foundWarnings.clear();
}
export function emptyErrorsList() {
	foundErrors.clear();
}
export function emptyFatalErrorsList() {
	foundFatalErrors.clear();
}

// creating reference map with errormessages; could add some stuff to the map if needed
const issueReferenceMap = new Map();
const foundHints = new Map();
const foundWarnings = new Map();
const foundErrors = new Map();
const foundFatalErrors = new Map();

export function addIssueToIssueMap(severity: number, issueCode: string, inputStringStartIndex: number) {
	issueReferenceMap.set(issueCode, inputStringStartIndex);
	if (severity === 0) {
		foundHints.set(issueCode, inputStringStartIndex);
	} else if (severity === 1) {
		foundWarnings.set(issueCode, inputStringStartIndex);
	} else if (severity === 2) {
		foundErrors.set(issueCode, inputStringStartIndex);
	} else if (severity === 3) {
		foundFatalErrors.set(issueCode, inputStringStartIndex);
	}

}

export function listAllIssues() {
	return issueReferenceMap;
}

export function listHints() {
	return issueReferenceMap;
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

import Issue from "./issue";
import issueJson from "./knownIssues.json";
import Position from "./position";

/** All the valid issue-codes */
export type IssueCode = keyof typeof issueJson;

interface ReplacementMap {
	[placeholder: string]: string | number;
}

/**
 * This function needs to be called when someone wants to store a known issue;
 * @param issueJson the issueobject that should be stored in the issuelist.
 * @param addPosition optional position where issue is located;
 * @param replacements optional replacements for the placeholders in the issue message.
 */
export function addIssue(
	issueCode: IssueCode,
	position?: Position,
	replacements?: ReplacementMap) {
	const issue: Issue = {
		...issueJson[issueCode],
		code: issueCode,
		position,
	};
	if (replacements) {
		issue.message = insertReplacementsForPlaceholders(issue.message, replacements);
	}

	addIssueToIssueList(issue);
}

const PLACEHOLDER_PATTERN = /{([A-Za-z0-9]+)}/g;

function insertReplacementsForPlaceholders(message: string, replacements: ReplacementMap): string {
	return message.replace(PLACEHOLDER_PATTERN, (placeholder, name) => {
		const replacement = replacements[name];
		if (replacement === undefined) {
			return placeholder;
		} else {
			return replacement.toString();
		}
	});
}

let foundIssues: Issue[] = [];

/**
 * empty the list of issues
 */
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

/**
 * list all the found issues
 * @return all found issues
 */
export function listAllIssues(): ReadonlyArray<Issue> {
	return foundIssues;
}

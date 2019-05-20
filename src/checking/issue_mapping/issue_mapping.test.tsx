// IMPORTS
import { Severity } from "../issue";
import * as ISSUE from "./issue_mapping";

test("test if adding and returning of error messages works correctly", () => {
	ISSUE.emptyIssueList();
	const severityNumber = Severity.Warning;
	const issue = ISSUE.knownIssueCodes.WARNINGS.MISSING_STATEMENT_AT_THE_END;
	const issueCode = ISSUE.getIssueCodeFromJSON(issue);
	const issueMessage = issue.MISSING_STATEMENT_AT_THE_END;
	const positionNumber = 12;
	ISSUE.addIssueToIssueMap(severityNumber, issueCode, issueMessage, positionNumber);

	const result = ISSUE.listAllIssues();
	const expectedResult = ["look the expected return to see how it works."];

	expect(result).toEqual(expectedResult);
});

test("test if adding and returning of error messages works correctly", () => {
	ISSUE.emptyIssueList();
	const severityNumber = Severity.Error;
	/**
	 * if you want to push a unknown issue, it still works:
	 */
	const issueCode = "UNKNOWN ERROR";
	const issueMessage = "RANDOM ERROR MESSAGE THAT ISNT KNOWN YET";
	const positionNumber = 12;
	ISSUE.addIssueToIssueMap(severityNumber, issueCode, issueMessage, positionNumber);
	const result = ISSUE.listAllIssues();
	const expectedResult = ["look the expected return to see how it works."];
	expect(result).toEqual(expectedResult);
});
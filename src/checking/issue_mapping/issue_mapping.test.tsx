// IMPORTS
import * as ISSUE from "./issue_mapping";
import { IssueObject } from "./issue_mapping";

test("creating a issueObject", () => {
	const severityNumber = ISSUE.Severity.Warning;
	const issueJSONObjectKey = ISSUE.knownIssueCodes.WARNINGS.MISSING_STATEMENT_AT_THE_END;
	const issueCode = ISSUE.getIssueCodeFromJSON(issueJSONObjectKey);
	const issueMessage = issueJSONObjectKey.MISSING_STATEMENT_AT_THE_END;
	const positionNumber = 200;
	const issue: IssueObject = ISSUE.createIssue(issueCode, issueMessage, severityNumber, positionNumber);

	const resultCode = issue.code;
	const expectedResultCode = "MISSING_STATEMENT_AT_THE_END";
	const resultMessage = issue.message;
	const expectedResultMessage = "It seems, you forgot some statements at the end of your expression.";
	const resultSeverity = issue.severity;
	const expectedResultSeverity = 1;
	const resultPosition = issue.position;
	const expectedResultPosition = 200;

	expect(resultCode).toEqual(expectedResultCode);
	expect(resultMessage).toEqual(expectedResultMessage);
	expect(resultSeverity).toEqual(expectedResultSeverity);
	expect(resultPosition).toEqual(expectedResultPosition);

});

test("creating a issueObject that is that is unknown", () => {
	const severityNumber = ISSUE.Severity.FatalError;
	const issueCode = "A-TEST";
	const issueMessage = "just a test message";
	const positionNumber = NaN;
	const issue: IssueObject = ISSUE.createIssue(issueCode, issueMessage, severityNumber, positionNumber);

	const resultCode = issue.code;
	const expectedResultCode = "A-TEST";
	const resultMessage = issue.message;
	const expectedResultMessage = "just a test message";
	const resultSeverity = issue.severity;
	const expectedResultSeverity = 3;
	const resultPosition = issue.position;
	const expectedResultPosition = undefined;

	expect(resultCode).toEqual(expectedResultCode);
	expect(resultMessage).toEqual(expectedResultMessage);
	expect(resultSeverity).toEqual(expectedResultSeverity);
	expect(resultPosition).toEqual(expectedResultPosition);

});

test("test if accessing to issue list works correctly", () => {
	ISSUE.emptyIssueList();

	/** add the first isue */
	let issueCode = "UNKNOWN ERROR";
	let issueMessage = "RANDOM ERROR MESSAGE THAT ISNT KNOWN YET";
	let severityNumber = ISSUE.Severity.Error;
	let positionNumber = NaN;
	let issue: IssueObject = ISSUE.createIssue(issueCode, issueMessage, severityNumber, positionNumber);
	ISSUE.addIssueToIssueList(issue);

	/** add a second issue */
	severityNumber = ISSUE.Severity.Warning;
	const issueJSONObjectKey = ISSUE.knownIssueCodes.WARNINGS.MISSING_STATEMENT_AT_THE_END;
	issueCode = ISSUE.getIssueCodeFromJSON(issueJSONObjectKey);
	issueMessage = issueJSONObjectKey.MISSING_STATEMENT_AT_THE_END;
	positionNumber = 200;
	issue = ISSUE.createIssue(issueCode, issueMessage, severityNumber, positionNumber);
	ISSUE.addIssueToIssueList(issue);

	const foundIssues: IssueObject[] = ISSUE.listAllIssues();
	const result = foundIssues[1].message;
	const expectedResult = "It seems, you forgot some statements at the end of your expression.";
	expect(result).toEqual(expectedResult);
});

test("try to get a issue from issuelist by issuecode that doesn't exist, recieve the ISSUE-NOT-FOUND Error", () => {
	ISSUE.emptyIssueList();
	const issueJSONObjectKey = ISSUE.knownIssueCodes.WARNINGS.MISSING_STATEMENT_AT_THE_END;
	const issueCode = ISSUE.getIssueCodeFromJSON(issueJSONObjectKey);
	const issue: IssueObject = ISSUE.getIssueFromIssueListByCode(issueCode);
	const resultCode = issue.code;
	const expectedResultCode = "ISSUE-NOT-FOUND";
	const resultMessage = issue.message;
	const expectedResultMessage = "Issue is not found.";
	expect(resultCode).toEqual(expectedResultCode);
	expect(resultMessage).toEqual(expectedResultMessage);
});

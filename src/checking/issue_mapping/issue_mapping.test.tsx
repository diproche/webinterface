// IMPORTS
import * as ISSUE from "./issue_mapping";
/*test("test if finding of error messages out from the referenc map works correctly;", () => {
	emptyIssueList();
	addIssueToIssueMap(0, knownIssueCodes.WARNINGS.MISSING_CONNECTOR);
	addIssueToIssueMap(232323, knownIssueCodes.WARNINGS.BRACKET_UNDERCLOSING);
	const testErrorMessage = 104;
	const result = findErrorMessage(testErrorMessage);
	const expectedResult = "Error 104";
	expect(result).toEqual(expectedResult);

});*/

test("test if adding and returning of error messages works correctly", () => {
	ISSUE.emptyIssueList();
	ISSUE.addIssueToIssueMap(ISSUE.Severity.Warning, ISSUE.knownIssueCodes.WARNINGS.BRACKET_OVERCLOSING, 0);
	ISSUE.addIssueToIssueMap(ISSUE.Severity.Warning, "test", 2);
	ISSUE.addIssueToIssueMap(ISSUE.Severity.Warning, ISSUE.knownIssueCodes.WARNINGS.TEST, 45);
	ISSUE.addIssueToIssueMap(ISSUE.Severity.Warning, ISSUE.knownIssueCodes.WARNINGS.MISSING_STATEMENT_INSIDE, 45);
	ISSUE.addIssueToIssueMap(ISSUE.Severity.Warning, ISSUE.knownIssueCodes.WARNINGS.BRACKET_UNDERCLOSING, 56);
	ISSUE.addIssueToIssueMap(ISSUE.Severity.Error, "another error message", 566);
	ISSUE.addIssueToIssueMap(ISSUE.Severity.Warning, ISSUE.knownIssueCodes.WARNINGS.MISSING_STATEMENT_AT_THE_END, 777);
	ISSUE.addIssueToIssueMap(ISSUE.Severity.Warning, ISSUE.knownIssueCodes.ERRORS.TEST, 888);
	//const result = issueMapper.listAllIssues();
	const result = ISSUE.listErrors();
	const expectedResult = ["Error 101", "Error 104", "Error 104", "Error 103"];
	expect(result).toEqual(expectedResult);
});

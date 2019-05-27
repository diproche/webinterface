
import Issue from "./issue";
import { addIssue, emptyIssueList, getIssue, listAllIssues } from "./issue_mapping";
import { ISSUES} from "./issue_mapping";

test("check if the issuelist contains a searched issue but it doesn't", () => {
	emptyIssueList();
	addIssue(ISSUES.BRACKET_OVERCLOSING);
	const issue: Issue = getIssue(ISSUES.BRACKET_UNDERCLOSING);
	expect(issue).toEqual({
		code: "ISSUE_NOT_FOUND",
		message: "The searched Issue wasn't found.",
		severity: "FATAL_ERROR",
	});
});

test("check if the issuelist contains a searched issue", () => {
	emptyIssueList();
	/** add first issue: */
	addIssue(ISSUES.BRACKET_OVERCLOSING);
	/** add second issue: */
	addIssue(ISSUES.MISSING_CONNECTOR);
	/** add third issue */
	addIssue(ISSUES.BRACKET_UNDERCLOSING);
	/** add fourth issue */
	addIssue(ISSUES.MISSING_STATEMENT_INSIDE);
	/** add fifth issue */
	addIssue(ISSUES.MISSING_STATEMENT_AT_THE_END);

	const issue = getIssue(ISSUES.MISSING_STATEMENT_INSIDE);

	expect(issue).toEqual({
		code: "MISSING_STATEMENT_INSIDE",
		message: "It seems, you forgot some statements inside your logic expression.",
		severity: "WARNING",
	});

});

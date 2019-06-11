
import { addIssue, emptyIssueList, listAllIssues } from "./issueMapping";

test("check if the issuelist contains a searched issue but it doesn't", () => {
	emptyIssueList();
	addIssue("BRACKET_OVERCLOSING");
	const issue = listAllIssues().find(i => i.code === "BRACKET_UNDERCLOSING");
	expect(issue).toEqual(undefined);
});

test("check if the issuelist contains a searched issue", () => {
	emptyIssueList();
	/** add first issue: */
	addIssue("BRACKET_OVERCLOSING");
	/** add second issue: */
	addIssue("MISSING_CONNECTOR");
	/** add third issue */
	addIssue("BRACKET_UNDERCLOSING");
	/** add fourth issue */
	addIssue("MISSING_STATEMENT_INSIDE");
	/** add fifth issue */
	addIssue("MISSING_STATEMENT_AT_THE_END");

	const issue = listAllIssues().find(i => i.code === "MISSING_STATEMENT_INSIDE");

	expect(issue).toEqual({
		code: "MISSING_STATEMENT_INSIDE",
		message: "Es fehlt mindestens ein Argument.",
		severity: "WARNING",
	});
});

test("check if the placeholders in the issue-message got replaced correctly", () => {
	emptyIssueList();
	addIssue("INVALID_WORD", undefined, { word: "Schuh" });
	const issue = listAllIssues().find(i => i.code === "INVALID_WORD");
	expect(issue).toEqual({
		severity: "WARNING",
		code: "INVALID_WORD",
		message: "Das Wort 'Schuh' in der Eingabe ist nicht erlaubt.",
	});
});

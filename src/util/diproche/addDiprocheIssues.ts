import { addIssue } from "../issueHandling/issueMapping";

function addDiprocheIssues(unverifiedLines: number[]): void {
	unverifiedLines.forEach((singleLine: number) => {
		addIssue("UNVERIFIED_LINE", {	fromIndex: singleLine, toIndex: singleLine});
	});

}

export default addDiprocheIssues;

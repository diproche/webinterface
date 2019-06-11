import Issue from "../../issueHandling/issue";
import { addIssue} from "../../issueHandling/issueMapping";
import { getAllIssues } from "../../vocabularyChecker/detectWrongSyntax";

export enum Mode {
	propositionalLogic = "diproche",
	firstOrderPredicateLogic = "diproche_fo",
	test = "teste",
}

/**
 * Since the user input most likely lacks the correct predicate,
 * it needs to be added. For easier maintainability in case
 * of an expanding predicate list, the corresponding predicate is
 * added with respect to the current @param mode. This can, for
 * example correspond to the concept of "Spielwiese". The user should
 * be able to just stay inside a mode and not have to add this mode
 * himself. Hence, the mode needs to be read out from the browser.
 */
export function addPredicate(userInput: string, mode: Mode) {
	return mode + "(" + userInput + ").";
}

export function concatOneIssueList(issues: Issue[]) {
	for (const issue of issues) {
		addIssue(issue);
	}
}

export function getVocabErrors(userInput: string): void {
	concatOneIssueList(getAllIssues(userInput));
}

// export function getMisplacedSymbolsErrors(userInput: string) {
	// Dummy input
// }

// export function getSemanticErrors(userInput: string) {
	// Dummy input
// }

export function getSyntacticErrors(userInput: string) {
	getVocabErrors(userInput);
	// getMisplacedSymbolsErrors(userInput);
}

export function getErrorsBeforeDiproche(userInput: string) {
	getSyntacticErrors(userInput);
	// getSemanticErrors(userInput);
}

// export function getErrorsAfterDiproche(userInput: string) {
	// Dummy input
// }

// this function collects all Errors.
export default function getErrors(diprocheInput: string) {
	getErrorsBeforeDiproche(diprocheInput);
	// getErrorsAfterDiproche(diprocheInput);
}

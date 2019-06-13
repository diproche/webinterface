import { expressionFormatter } from "../../input_formatter/expression_formatter";
import { listAllIssues } from "../../issueHandling/issueMapping";
import { collectInvalidWordsInIssues } from "../../vocabularyChecker/detectWrongSyntax";

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

export function getVocabErrors(userInput: string): void {
	collectInvalidWordsInIssues(userInput);
}

// export function getSemanticErrors(userInput: string) {
	// Dummy input
// }

export function getSyntacticErrors(userInput: string) {
	getVocabErrors(userInput);
	expressionFormatter(userInput);
}

export function getErrorsBeforeDiproche(userInput: string) {
	getSyntacticErrors(userInput);
	// getSemanticErrors(userInput);
}

// export function getErrorsAfterDiproche(userInput: string) {
	// Dummy input
// }

// this function collects all Errors.
export function getErrors(diprocheInput: string) {
	getErrorsBeforeDiproche(diprocheInput);
	// getErrorsAfterDiproche(diprocheInput);
}

export default function displayErrors(userInput: string) {
	getErrors(userInput);
	if (listAllIssues().length > 0) {
		for (const issue of listAllIssues()) {
			console.log(issue.message);
		}
	}
}

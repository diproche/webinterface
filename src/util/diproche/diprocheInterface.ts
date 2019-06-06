import Issue from "../../issueHandling/issue";
import { concatOneIssueList } from "../../issueHandling/issueMapping";
import { getAllIssues } from "../../vocabularyChecker/detectWrongSyntax";
import { UnexpectedError } from "./Errors";
import modes from "./predicateList.json";

export type Mode = "propositionalLogic" | "firstOrderPredicateLogic" | "test";

let issuelist: Issue[] = [];

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
	for (const predicate of modes.predicates) {
		if (predicate === mode) {
			return getPrologPredicateForMode(mode).concat("(").concat(userInput).concat(").");
		}
	}
	return "Es gibt kein passendes Prädikat.";
}

export function getPrologPredicateForMode(mode: Mode) {
	switch (mode) {
		case "propositionalLogic": {
			return "diproche";
		}
		case "firstOrderPredicateLogic": {
			return "diproche_fo";
		}
		case "test": {
			return "teste";
		}
		default: {
			throw(UnexpectedError);
		}
	}
}

// Assuming "wrongWord" is not an allowed word, then a
// vocaberror is an error like "the word "wrongWord"
// in the text "This text contains a wrongWord".
export function getVocabErrors(userInput: string): Issue[] | void {
	if (getAllIssues(userInput).length > 0) {
		concatOneIssueList(getAllIssues(userInput));
	}
}

// A misplacedSymbolError is something like "2 += 2 4" or
// "(2 + 2)) = 4" instead of "2 + 2 = 4" or "(2 + 2) = 4" respectively
export function getMisplacedSymbolsErrors(userInput: string) {
	// Dummy input
}

// A semantic error is something like
// "2 + 2 = 4 minus 1 that's 3 quick maffs",
// i.e. some expression does not make sense with respect
// to the mathematical objects used.
export function getSemanticErrors(userInput: string) {
	// Dummy input
}

/**
 * SyntacticErrors are all the errors that are vocabErrors or
 * misplacedSymbolsErrors.
 */
export function getSyntacticErrors(userInput: string) {
	getVocabErrors(userInput);
	getMisplacedSymbolsErrors(userInput);
}

/**
 * Before executing diproche syntactical and semantical errors
 * are everything that is considered.
 */
export function getErrorsBeforeDiproche(userInput: string) {
	getSyntacticErrors(userInput);
	getSemanticErrors(userInput);
}

/**
 * Diproche itself returns errors, for example when the
 * proof is wrong. This function should display it to the user.
 */
export function getErrorsAfterDiproche(userInput: string) {
	// Dummy input
}

// this function collects all Errors.
export default function getErrors(diprocheInput: string) {
	getErrorsBeforeDiproche(diprocheInput);
	getErrorsAfterDiproche(diprocheInput);
}

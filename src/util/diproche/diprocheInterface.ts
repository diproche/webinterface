import { textFormatter } from "../inputFormatter/textFormatter";
import { getDiprocheResponse } from "../proofChecker";
import { collectInvalidWordsInIssues } from "../vocabularyChecker/detectWrongSyntax";
import addDiprocheIssues from "./addDiprocheIssues";

export enum Mode {
	propositionalLogic = "diproche",
	firstOrderPredicateLogic = "diproche_fo",
	test = "teste",
}

/**
 * returns a string containing the userInput as an argument of a predicate
 * @param userInput - the user input
 * @param mode - the mode
 */
function addPredicate(userInput: string, mode: Mode) {
	return mode + "(" + userInput + ").";
}

/**
 * collects all vocabErrors
 */
export function getVocabErrors(userInput: string): void {
	collectInvalidWordsInIssues(userInput);
}

/**
 * collects all vocabErrors and should also collect grammatical errors
 */
export function getSyntacticErrors(userInput: string) {
	getVocabErrors(userInput);
}

/**
 * Collects all errors before the execution of diproche
 */
export function getErrorsBeforeDiproche(userInput: string) {
	getSyntacticErrors(userInput);
	// getSemanticErrors(userInput);
}

/**
 * Collects all errors that diproche returns
 */
export async function getErrorsAfterDiproche(diprocheInput: string): Promise<void> {
	const response: number[] = await getDiprocheResponse(diprocheInput);
	addDiprocheIssues(response);
}

/**
 * this function collects all Errors.
 */
export async function createErrors(userinput: string): Promise<void> {
	getErrorsBeforeDiproche(userinput);

	// Also adds Issues which are caused when progressing this function
	const diprocheInput = addPredicate(textFormatter(userinput), Mode.firstOrderPredicateLogic);
	await getErrorsAfterDiproche(diprocheInput);
}

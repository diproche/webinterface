import { textFormatter } from "../../input_formatter/text_formatter";
import { collectInvalidWordsInIssues } from "../../vocabularyChecker/detectWrongSyntax";
import { getDiprocheResponse } from "../proofChecker";
import { addDiprocheIssues } from "./diprocheResponseProcessing";

export enum Mode {
	propositionalLogic = "diproche",
	firstOrderPredicateLogic = "diproche_fo",
	test = "teste",
}

/**
	* Adds the predicate which will be used by diproche
	* @param userInput - The proof in natural language entered by the user
	* @param mode - The mathematical field to be analyzed
	*/
export function addPredicate(userInput: string, mode: Mode) {
	return mode + "(" + userInput + ").";
}

/**
	* Creates all issues without running it through diproche
	* When calling this function don't call issueHandling.textFormatter() again as it will duplicate issues
	* @param userInput The proof in natural language
	*/
export function getErrorsBeforeDiproche(userInput: string) {
	collectInvalidWordsInIssues(userInput);
	textFormatter(userInput);
	// getSemanticErrors(userInput);
}

export async function getErrorsAfterDiproche(diprocheInput: string): Promise<void> {
	const response: string = await getDiprocheResponse(diprocheInput);
	addDiprocheIssues(response);
}

// this function collects all Errors.
export async function createErrors(userInput: string): Promise<void> {
	collectInvalidWordsInIssues(userInput);

	// Also adds Issues which are caused when progressing this function
	const diprocheInput = textFormatter(userInput);
	await getErrorsAfterDiproche(diprocheInput);
}

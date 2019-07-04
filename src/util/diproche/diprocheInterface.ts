import { textFormatter } from "../../input_formatter/text_formatter";
import { collectInvalidWordsInIssues } from "../../vocabularyChecker/detectWrongSyntax";
import { getDiprocheResponse } from "../proofChecker";
import { addDiprocheIssues } from "./diprocheResponseProcessing";

export enum Mode {
	propositionalLogic = "diproche",
	firstOrderPredicateLogic = "diproche_fo",
	test = "teste",
}

export function addPredicate(userInput: string, mode: Mode) {
	return mode + "(" + userInput + ").";
}

export function getVocabErrors(userInput: string): void {
	collectInvalidWordsInIssues(userInput);
}

export function getSyntacticErrors(userInput: string) {
	getVocabErrors(userInput);
}

export function getErrorsBeforeDiproche(userInput: string) {
	getSyntacticErrors(userInput);
	// getSemanticErrors(userInput);
}

export async function getErrorsAfterDiproche(diprocheInput: string): Promise<void> {
	const response: string = await getDiprocheResponse(diprocheInput);
	addDiprocheIssues(response);
}

// this function collects all Errors.
export async function createErrors(userinput: string): Promise<void> {
	getErrorsBeforeDiproche(userinput);

	// Also adds Issues which are caused when progressing this function
	const diprocheInput = textFormatter(userinput) + ".";
	await getErrorsAfterDiproche(diprocheInput);
}

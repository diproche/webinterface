import { PrologResult } from "../util/prolog/prologResult";
import { getAllIssues } from "../vocabularyChecker/detectWrongSyntax";

function showVocabErrors(text: string) {
		getAllIssues(text);
}

/**
 * The following function should correct expressions like
 * 2 += 2 4 in the user input to 2 + 2 = 4 or at least
 * make the user aware of such mistakes
 *
 * function showWrongSyntax(text: string) {
 *
 * }
 *
 * The following function should convert a text like
 * "It holds that 2 + 2 = 4"
 * to "[It, holds, that, =[+[2,2],5]]"
 *
 * function convertToPrologList(text: string) {
 *
 * }
 *
 * The following function should tell the user which
 * semantic mistakes he made. For example:
 * The function should tell the user, that
 * "2 + 2 = 5" is semantically wrong
 *
 * function showWrongSemantic(text: string) {
 *
 * }
 */

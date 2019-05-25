import { ifError } from "assert";
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
 *
 */

export function bundleEverything(text: string) {
	ifError(showVocabErrors(text)); {
		showVocabErrors(text);
		bundleEverything(text); // This text-variable should be the one new user input after (hopefully) correcting the error.
		}
/** ifError(showWrongSyntax(text)); {
 *        showWrongSyntax(text);
 *        bundleEverything(text); // This text should be the new user input.
 * }
 *
 * convertPrologList(text);
 *
 * ifError(showWrongSemantic(text)) {
 *      showWrongSemantic(text);
 *      bundleEverything(text); // This text should be the new user input.
 * }
 */
}

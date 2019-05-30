import modes from "./predicateList.json";

/**
 * Since the user input most likely lacks the correct predicate,
 * it needs to be added. For easier maintainability in case
 * of an expanding predicate list, the corresponding predicate is
 * added with respect to the current @param mode. This can, for
 * example correspond to the concept of "Spielwiese". The user should
 * be able to just stay inside a mode and not have to add this mode
 * himself. Hence, the mode needs to be read out from the browser.
 */
export function addPredicate(userInput: string, mode: string): string {
	modes.predicates.forEach(predicate => {
		if (mode === predicate) {
			return predicate.concat("(").concat(userInput).concat(").");
		}
	});
	return "No predicate was selected";
}

// Please specify and describe the return type for this function.
// Input should be a string I can just run in diproche
// (also the corresponding predicate like diproche_fo(...).)
export default function getErrors(diprocheInput: string) {
	// Dummy Functionality
}

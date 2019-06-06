import {addPredicate, getPrologPredicateForMode, Mode} from "../util/diproche/diprocheInterface";

export function checkProof(text: string): string[] {
	const mode: Mode = "firstOrderPredicateLogic";
	return [
		getPrologPredicateForMode(mode),
	];
}

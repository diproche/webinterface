import {fetchAllMatchesForAGroup} from "../regExpUtils";
import builtInPredicates from "./builtInPredicates";

/**
	* @param {string} path - The path to be curated
	* @return {string} The path without its extension (removing the last dot and everything after)
	*/
export function removeFileExtension(path: string): string {
	const fetch: string[] | null = fetchFileExtension.exec(path);
	if (fetch === null) { return ""; }
	return fetch[1];
}

/**
	* Necessary because module declarations break tau-prolog
	* @param {string} path - The program code to be curated
	* @return {string} Program code without module declarations except for library calls
	*/
export function removeModuleDeclarations(prologProgram: string): string {
	return prologProgram.replace(fetchModuleDeclaration, "");
}

/**
	* To reduce code
	* @param {string} path - The program code to be curated
	* @return {string} Program code without prolog comments that span a whole line including the line
	*/
function removeFullLineComments(prologProgram: string): string {
	return prologProgram.replace(fetchFullLineCommentsRegExp, "");
}

/**
	* To reduce code
	* @param {string} path - The program code to be curated
	* @return {string} Program code without prolog comments at the end of line
	*/
function removePartialLineComments(prologProgram: string): string {
	// group2 fetches the EOL standard in the file to fit both: Windows and UNIX
	return prologProgram.replace(fetchPartialLineCommentsRegExp, (_, group1, group2) => group1.trimRight() + group2);
}

/**
	* To reduce code
	* @param {string} path - The program code to be curated
	* @return {string} Program code without prolog comments and the lines of full line comments
	*/
export function removeComments(prologProgram: string): string {
	return removeFullLineComments(removePartialLineComments(prologProgram));
}

/**
	* To reduce code
	* @param {string} path - The program code to be curated
	* @return {string} Program code without empty lines and lines with only whitespace characters
	*/
function removeEmptyLines(prologProgram: string): string {
	return prologProgram.replace(fetchEmptyLinesRegExp, "\n");
}

/**
	* To reduce code
	* @param {string} path - The program code to be curated
	* @return {string} Program code without double whitespace
	*/
function removeDoubleWhitespaces(prologProgram: string): string {
	return prologProgram.replace(fetchDoubleWhitespacesRegExp, " ");
}

/**
	* To reduce code
	* @param {string} path - The program code to be curated
	* @return {string} Program code without parts that don't affect the behavior of the program
	*/
export function removeNonFunctionalities(prologProgram: string): string {
	return removeComments(removeEmptyLines(removeDoubleWhitespaces(prologProgram)));
}

export function fixVariableShadowingInImport(program: string, importedProgram: string): string {
	const fetchImportedPredicatesRegExp = /:-[\r\t\f\v ]*module\([^,)]*,\[([^)]*)\][\r\t\f\v ]*\)[\r\t\f\v ]*/;

	const useModuleSecondParam: string[] | null = fetchImportedPredicatesRegExp.exec(importedProgram);
	if (useModuleSecondParam == null) {
		return identifyPredicatesUniquely(program, importedProgram);
	}
	// The following regex will return in group one the name of the functions
	const importedPredicates: string[] = fetchAllMatchesForAGroup(useModuleSecondParam![1], /[\r\t\f\v ]*(\w*)\/\d,?/g, 1);
	return identifyPredicatesUniquely(program, importedProgram, importedPredicates);
}

function identifyPredicatesUniquely(program: string, importedProgram: string, importedPredicates?: string[]): string {

	// imports shouldn't be renamed
	let predicatesToNotRename: string[];
	// Checking for undefined based on this recommendation:
	// https://basarat.gitbooks.io/typescript/docs/javascript/null-undefined.html
	if (importedPredicates == null) {
		predicatesToNotRename = [];
	} else {
		predicatesToNotRename = importedPredicates;
	}

	// predicates which have to be renamed are the ones which occure in both the main and the imported program
	const mainProgramPredicates: Set<string> = getNonBuiltInPredicates(program);
	const predicatesToRename: Set<string> = getNonBuiltInPredicates(importedProgram);
	const toRemove: Set<string> = new Set(); // Externalize deletions
	predicatesToRename.forEach((predicate: string) => {
		if (!mainProgramPredicates.has(predicate)) {
			toRemove.add(predicate);
		}
	});
	// Externalized Deletion
	toRemove.forEach((predicate: string) => predicatesToRename.delete(predicate));
	predicatesToNotRename.forEach((predicate: string) => predicatesToRename.delete(predicate));

	// Renaming Process
	predicatesToRename.forEach((toRename: string) => {
		const getToRenameRegExp = new RegExp(toRename + "(\(.*?\))", "g");
		importedProgram = importedProgram.replace(getToRenameRegExp, (_, parameters: string) => {

			let identifier = 1;
			while (mainProgramPredicates.has(toRename + "_" + identifier)) {
				identifier++;
			}

			return toRename + "_" + identifier + parameters;

		});
	});

	return importedProgram;
}

function getNonBuiltInPredicates(program: string): Set<string> {
	// This doesn't take comments into account so in "%predicate()" would find predicate()
	// Finds all words before closing opening and closing brackets
	// Predicates which brackets open or close in the next line won't be recognized
	const fetchPredicatesRegExp = /(\w+)\(.*?\)/g;

	// Since the predicate doesn't filter out comments this will also remove comments
	program = removeNonFunctionalities(program);

	const predicates: Set<string> = new Set(fetchAllMatchesForAGroup(program, fetchPredicatesRegExp, 1));

	// Delete built in predicates from the Set
	builtInPredicates.forEach((predicate: string) => predicates.delete(predicate));

	return predicates;
}

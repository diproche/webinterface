import {fetchAllMatchesForAGroup} from "../regExpUtils";
import builtInPredicates from "./builtInPredicates";

/**
	* @param path - The path of the prolog file to be curated
	* @return The path without its extension (removing the last dot and everything after)
	*/
export function removeFileExtension(path: string): string {
	const fetchFileExtension = /(.+)\.[^\.]*/;
	const fetch: string[] | null = fetchFileExtension.exec(path);
	if (fetch === null) { return ""; }
	return fetch[1];
}

/**
	* Necessary because module declarations break tau-prolog
	* @param prologProgram - The program code to be curated
	* @return Program code without module declarations except for library calls
	*/
export function removeModuleDeclarations(prologProgram: string): string {
	const fetchModuleDeclaration = /:-( |)module\([^)]*\) *\.[\r\t\f\v ]*\n?/g;
	return prologProgram.replace(fetchModuleDeclaration, "");
}

/**
	* To reduce code
	* @param path - The program code to be curated
	* @return Program code without prolog comments that span a whole line including the line
	*/
function removeFullLineComments(prologProgram: string): string {
	const fetchFullLineCommentsRegExp = /^[\r\t\f\v ]*%[^\n]*\n/gm;
	return prologProgram.replace(fetchFullLineCommentsRegExp, "");
}

/**
	* To reduce code
	* @param path - The program code to be curated
	* @return Program code without prolog comments at the end of line
	*/
function removePartialLineComments(prologProgram: string): string {
	const fetchPartialLineCommentsRegExp = /(^[^\n%]+)%[^\n\r]*(\r?\n)/gm;
	// group2 fetches the end-of-line (EOL) standard in the file to fit both: Windows and UNIX
	// https://www.networkworld.com/article/3107972/windows-vs-unix-those-pesky-line-terminators.html
	return prologProgram.replace(fetchPartialLineCommentsRegExp, (_, group1, group2) => group1.trimRight() + group2);
}

/**
	* To reduce code
	* @param path - The program code to be curated
	* @return Program code without prolog comments and the lines of full line comments
	*/
export function removeComments(prologProgram: string): string {
	return removeFullLineComments(removePartialLineComments(prologProgram));
}

/**
	* To reduce code
	* @param path - The program code to be curated
	* @return Program code without empty lines and lines with only whitespace characters
	*/
function removeEmptyLines(prologProgram: string): string {
	const fetchEmptyLinesRegExp = /\n(?:\s)*\n/gm;
	return prologProgram.replace(fetchEmptyLinesRegExp, "\n");
}

/**
	* To reduce code
	* @param path - The program code to be curated
	* @return Program code without double whitespace
	*/
function removeDoubleWhitespaces(prologProgram: string): string {
	const fetchDoubleWhitespacesRegExp = /  +/gm;
	return prologProgram.replace(fetchDoubleWhitespacesRegExp, " ");
}

/**
	* To reduce code
	* @param path - The program code to be curated
	* @return Program code without parts that don't affect the behavior of the program
	*/
export function removeNonFunctionalities(prologProgram: string): string {
	return removeComments(removeEmptyLines(removeDoubleWhitespaces(prologProgram)));
}

/**
	* Renames predicates based on imports to avoid variable name shadowing
	* @param program - The base program's code which is importing
	* @param importedProgram - The imported program's code
	* @return The imported program's code with renamed predicates
	*/

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

/**
	* Renames the predicates in the imported file except for built-in and exported predicatesToRename
	* @param program - The base program's code which is importing
	* @param importedProgram - The imported program's code
	* @param importedPredicates - Predicates which are declared exported by the importedProgram
	* @result Renamed code of the importedProgram
	*/
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

/**
	* Returns the predicates of a prolog code but ignores built-in predicatesToRename
	* @param program - The program code to be searched
	* @result A set of predicates which are not built-in predicates
	*/
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

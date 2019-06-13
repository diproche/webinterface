import {fetchAllMatchesForAGroup} from "../regExpUtils";
import builtInPredicates from "./builtInPredicates";

export function removeFileExtension(path: string) {
	const fetchFileExtension = /(.*)\.[^\.]*/;

	const fetch: string[] | null = fetchFileExtension.exec(path);
	if (fetch === null) { return ""; }
	return fetch[1];
}

export function removeModuleDeclarations(prologProgram: string) {
	const fetchModuleDeclaration = /:-( |)module\([^)]*\) *\.[\r\t\f\v ]*\n?/g;

	return prologProgram.replace(fetchModuleDeclaration, "");
}

export function removeModuleImports(prologProgram: string) {
	const fetchModuleImports = /:-use_module\([^)]*\) *\.[\r\t\f\v ]*\n?/g;

	return prologProgram.replace(fetchModuleImports, "");
}

function removeFullLineComments(prologProgram: string) {
	const fetchFullLineCommentsRegExp = /^[\r\t\f\v ]*%[^\n]*\n/gm;

	return prologProgram.replace(fetchFullLineCommentsRegExp, "");
}

function removePartialLineComments(prologProgram: string) {
	const fetchPartialLineCommentsRegExp = /(^[^\n%]+)%[^\n\r]*(\r?\n)/gm;

	// group2 fetches the EOL standard in the file to fit both: Windows and UNIX
	return prologProgram.replace(fetchPartialLineCommentsRegExp, (_, group1, group2) => group1.trimRight() + group2);
}

export function removeComments(prologProgram: string) {

 return removeFullLineComments(removePartialLineComments(prologProgram));
}

function removeEmptyLines(prologProgram: string) {
	const fetchEmptyLinesRegExp = /\n(?:\s)*\n/gm;

	return prologProgram.replace(fetchEmptyLinesRegExp, "\n");
}

function removeDoubleWhitespaces(prologProgram: string) {
	const fetchDoubleWhitespacesRegExp = /  */gm;

	return prologProgram.replace(fetchDoubleWhitespacesRegExp, " ");
}

export function removeNonFunctionalities(prologProgram: string) {
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

	console.log(predicatesToRename);

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

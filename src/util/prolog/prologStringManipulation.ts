import {fetchAllMatchesForAGroup} from "../regExpUtils";

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
	if (typeof useModuleSecondParam == null) {
		return identifyPredicatesUniquely(program, importedProgram);
	}
	// The following regex will return in group one the name of the functions
	const importedFunctions: string[] = fetchAllMatchesForAGroup(useModuleSecondParam![1], /[\r\t\f\v ]*(\w*)\/\d,?/g, 1);
	return identifyPredicatesUniquely(program, importedProgram, importedFunctions);
}

function identifyPredicatesUniquely(program: string, importedProgram: string, importedFuntions?: string[]): string {

	return "stopp bugging me debugger";
}

function getNonBuiltInPredicates(program: string): string[] {
	// This doesn't take comments into account so %predicate():- true. would find predicate()
	const fetchPredicatesRegExp = /nothing/g;

	program = removeNonFunctionalities(program);
	return fetchAllMatchesForAGroup(program, fetchPredicatesRegExp, 1);
}

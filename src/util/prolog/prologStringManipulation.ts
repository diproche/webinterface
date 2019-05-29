const fetchFileExtension = /(.*)\.[^\.]*/;
const fetchModuleDeclaration = /:-( |)module\([^)]*\) *\.[\r\t\f\v ]*\n?/g;
const fetchPartialLineCommentsRegExp = /(^[^\n%]+)%[^\n\r]*(\r?\n)/gm;
const fetchFullLineCommentsRegExp = /^[\r\t\f\v ]*%[^\n]*\n/gm;
const fetchEmptyLinesRegExp = /\n(?:\s)*\n/gm;
const fetchDoubleWhitespacesRegExp = /  */gm;

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

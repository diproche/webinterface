const fetchFileExtension = /(.*)\.[^\.]*/;
const fetchModuleDeclaration = /:-( |)module\([^)]*\) *\.[\r\t\f\v ]*\n?/g;
const fetchPartialLineCommentsRegExp = /(^[^\n%]+)%[^\n\r]*(\r?\n)/gm;
const fetchFullLineCommentsRegExp = /^[\r\t\f\v ]*%[^\n]*\n/gm;
const fetchEmptyLinesRegExp = /\n(?:\s)*\n/gm;
const fetchDoubleWhitespacesRegExp = /  */gm;

export function removeFileExtension(path: string) {
	const fetch: string[] | null = fetchFileExtension.exec(path);
	if (fetch === null) { return ""; }
	return fetch[1];
}

export function removeModuleDeclarations(prologProgram: string) {
	return prologProgram.replace(fetchModuleDeclaration, "");
}

function removeFullLineComments(prologProgram: string) {
	return prologProgram.replace(fetchFullLineCommentsRegExp, "");
}

function removePartialLineComments(prologProgram: string) {
	// group2 fetches the EOL standard in the file to fit both: Windows and UNIX
	return prologProgram.replace(fetchPartialLineCommentsRegExp, (_, group1, group2) => group1.trimRight() + group2);
}

export function removeComments(prologProgram: string) {
	return removeFullLineComments(removePartialLineComments(prologProgram));
}

function removeEmptyLines(prologProgram: string) {
	return prologProgram.replace(fetchEmptyLinesRegExp, "\n");
}

function removeDoubleWhitespaces(prologProgram: string) {
	return prologProgram.replace(fetchDoubleWhitespacesRegExp, " ");
}

export function removeNonFunctionalities(prologProgram: string) {
	return removeComments(removeEmptyLines(removeDoubleWhitespaces(prologProgram)));
}

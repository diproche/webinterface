const fetchFileExtension = /(.*)\.[^\.]*/;
const fetchModuleDeclaration = /:-( |)module\([^)]*\) *\.[\r\t\f\v ]*\n?/g;
const fetchPartialLineCommentsRegExp = /(^[^\n%]+)%[^\n\r]*(\r?\n)/gm;
const fetchFullLineCommentsRegExp = /^[\r\t\f\v ]*%[^\n]*\n/gm;
const fetchEmptyLinesRegExp = /\n(?:\s)*\n/gm;
const fetchDoubleWhitespacesRegExp = /  */gm;

export interface String {
	removeFileExtension(): string;
	removeModuleDeclarations(): string;
	removeFullLineComments(): string;
	removePartialLineComments(): string;
	removeComments(): string;
	removeEmptyLines(): string;
	removeDoubleWhitespaces(): string;
	removeNonFunctionalities(): string;
}

String.prototype.removeFileExtension = function() {
	const deWrapper: string = this.toString();
	const fetch: string[] | null = fetchFileExtension.exec(deWrapper);
	if (fetch === null) { return ""; }
	return fetch[1];
};

String.prototype.removeModuleDeclarations = function() {
	return this.replace(fetchModuleDeclaration, "");
};

String.prototype.removeFullLineComments = function() {
	return this.replace(fetchFullLineCommentsRegExp, "");
};

String.prototype.removePartialLineComments = function() {
	// group2 fetches the EOL standard in the file to fit both: Windows and UNIX
	return this.replace(fetchPartialLineCommentsRegExp, (_, group1, group2) => group1.trimRight() + group2);
};

String.prototype.removeComments = function() {
	return this.removeFullLineComments().removePartialLineComments();
};

String.prototype.removeEmptyLines = function() {
	return this.replace(fetchEmptyLinesRegExp, "\n");
};

String.prototype.removeDoubleWhitespaces = function() {
	return this.replace(fetchDoubleWhitespacesRegExp, " ");
};

String.prototype.removeNonFunctionalities = function() {
	return this.removeComments().removeEmptyLines().removeDoubleWhitespaces();
};

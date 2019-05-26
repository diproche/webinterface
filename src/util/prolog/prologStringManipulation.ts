const fetchModuleDeclaration = /:-( |)module\([^)]*\) *\.[\r\t\f\v ]*\n?/g;
const fetchPartialLineCommentsRegExp = /(^[^\n%]+)%[^\n]*\n/gm;
const fetchFullLineCommentsRegExp = /^[\r\t\f\v ]*%[^\n]*\n/gm;
const fetchEmptyLinesRegExp = /\n(?:\s)*\n/gm;
const fetchDoubleWhitespacesRegExp = /  */gm;

export interface String {
	removeModuleDeclarations(): string;
	removeFullLineComments(): string;
	removePartialLineComments(): string;
	removeComments(): string;
	removeEmptyLines(): string;
	removeDoubleWhitespaces(): string;
	removeNonFunctionalities(): string;
}

String.prototype.removeModuleDeclarations = function() {
	return this.replace(fetchModuleDeclaration, "");
};

String.prototype.removeFullLineComments = function() {
	return this.replace(fetchFullLineCommentsRegExp, "");
};

String.prototype.removePartialLineComments = function() {
	// The \r\n is due to windows standard. In Unix it would only be \n. Different EOL standards might be an issue
	return this.replace(fetchPartialLineCommentsRegExp, (_, group1) => group1.trimRight() + "\r\n");
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

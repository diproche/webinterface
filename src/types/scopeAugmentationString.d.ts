declare interface String {
	// See src/util/prolog/prologStringManipulation
	removeFileExtension(): string;
	removeModuleDeclarations(): string;
	removeFullLineComments(): string;
	removePartialLineComments(): string;
	removeComments(): string;
	removeEmptyLines(): string;
	removeDoubleWhitespaces(): string;
	removeNonFunctionalities(): string;
}

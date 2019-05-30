import getErrors from "./diprocheInterface";
import addPredicate from "./diprocheInterface";
import getVocabErrors from "./diprocheInterface";

describe("getErrors", () => {
	it("Returns all errors present", () => {
	 const userInput = "Angenommen A ist falshc. Dann ist A => B wahr.";
	 const vocabErrorsOfInput = getVocabErrors(userInput);
	 const allErrorsOfInput = getErrors(userInput);
	 expect(vocabErrorsOfInput).toEqual(allErrorsOfInput);
	});
});

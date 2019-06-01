import getErrors from "./diprocheInterface";
import {addPredicate, getVocabErrors} from "./diprocheInterface";

describe("getErrors", () => {
	it("Returns all errors present", () => {
	 const userInput = "Angenommen A ist falshc. Dann ist A => B wahr.";
	 const vocabErrorsOfInput = getVocabErrors(userInput);
	 const allErrorsOfInput = getErrors(userInput);
	 expect(vocabErrorsOfInput).toEqual(allErrorsOfInput);
	});
});

describe("addPredicate", () => {
	it("Adds the correct predicate", () => {
		const prop = "propositionalLogic";
		expect(addPredicate("hallo", prop)).toEqual("diproche(hallo).");
	});
	it("Adds FO-logic predicate correctly", () => {
		const pred = "firstOrderPredicateLogic";
		expect(addPredicate("hallo", pred)).toEqual("diproche_fo(hallo).");
	});
	it("Adds test-predicate correctly", () => {
		const pred = "test";
		expect(addPredicate("hallo", pred)).toEqual("teste(hallo).");
	});
});

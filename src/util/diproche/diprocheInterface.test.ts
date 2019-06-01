import { getAllIssues } from "../../vocabularyChecker/detectWrongSyntax";
import getErrors from "./diprocheInterface";
import {addPredicate, getVocabErrors} from "./diprocheInterface";

describe("getErrors", () => {
	it("Returns all errors present", () => {
	 const userInput = "Angenommen A ist falshc. Dann ist A => B wahr.";
	 const vocabErrorsOfInput = getVocabErrors(userInput);
	 const allErrorsOfInput = getErrors(userInput);
	 // expect(vocabErrorsOfInput).toEqual(allErrorsOfInput);
	 // expect(() => getVocabErrors(userInput)).toThrow(Error("Error"));
	 expect(getVocabErrors(userInput)).toThrow(Error("Error"));
	});
});

describe("addPredicate", () => {
	describe("Normal cases", () => {
		describe("Adding the predicates works for a normal string", () => {
			it("Adds the prop-logic predicate correctly", () => {
				const pred = "propositionalLogic";
				expect(addPredicate("hallo", pred)).toEqual("diproche(hallo).");
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
	});
	describe("Edge cases", () => {
		describe("Empty string as an input", () => {
			it("Adds the prop-logic predicate to an empty string", () => {
				const pred = "propositionalLogic";
				expect(addPredicate("", pred)).toEqual("diproche().");
			});
			it("Adds FO-logic predicate to an empty string", () => {
				const pred = "firstOrderPredicateLogic";
				expect(addPredicate("", pred)).toEqual("diproche_fo().");
			});
			it("Adds test-predicate to an empty string", () => {
				const pred = "test";
				expect(addPredicate("", pred)).toEqual("teste().");
			});
		});
	});
	describe("Error cases", () => {
		describe("Predicate is invalid", () => {
			it("Adds none of the regular predicates", () => {
				const pred = "Just a random text";
				expect(addPredicate("hallo", pred)).toEqual(undefined);
			});
		});
	});
});

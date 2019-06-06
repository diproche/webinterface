import { Severity } from "../../checking/issue";
import { IssueCode } from "../../checking/issueCodes";
import { getAllIssues } from "../../vocabularyChecker/detectWrongSyntax";
import getErrors from "./diprocheInterface";
import {addPredicate, getVocabErrors, Mode} from "./diprocheInterface";
import {UnexpectedError} from "./Errors";

describe("getErrors", () => {
	it("Returns all errors present", () => {
	 const userInput = "Angenommen A ist falshc. Dann ist A => B wahr.";
	 const expected = () => getVocabErrors(userInput);
	 expect(expected).toThrow(Error);
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
				const mode = "Just a random text" as Mode;
				expect(addPredicate("", mode)).toEqual("Es gibt kein passendes Prädikat.");
			});
		});
	});
});

// The following description is based on the one in detectWrongSyntax.ts
// Only difference is, here it is expected to throw Errors.
describe("getVocabErrors", () => {
	it("Throws an error for one wrong word in a two-word-input", () => {
		const userInput = "WrongWord RightWord";
		const expected = () => getVocabErrors(userInput);
		expect(expected).toThrow(Error);
	},
);

	it("Creates a correct Issue-array for two words seperated by a Whitespace", () => {
		const userInput = "Te st";
		const expected = () => getVocabErrors(userInput);
		expect(expected).toThrow(Error);
	},
);

	it("Detects a String of word1.word2 as two words and throws an Error, if they are invalid", () => {
		const userInput = "word1 word2";
		const expected = () => getVocabErrors(userInput);
		expect(expected).toThrow(Error);
	},
);

	it("Detects a String of word1,;:<>=word2 as two words and throws an Error, if they are invalid", () => {
		const userInput = "Te,;<>=st";
		const expected = () => getVocabErrors(userInput);
		expect(expected).toThrow(Error);
	});
});

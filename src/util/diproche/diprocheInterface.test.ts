import { emptyIssueList, listAllIssues} from "../../issueHandling/issueMapping";
import { getAllIssues } from "../../vocabularyChecker/detectWrongSyntax";
import { addPredicate, getVocabErrors, Mode } from "./diprocheInterface";

describe("getErrors", () => {
	it("Returns all errors present", () => {
	 const userInput = "Angenommen A ist falshc. Dann ist A => B wahr.";
	 getVocabErrors(userInput);
	 expect(listAllIssues()).toEqual(getAllIssues(userInput));
	});
});

describe("addPredicate", () => {
	describe("Normal cases", () => {
		describe("Adding the predicates works for a normal string", () => {
			it("Adds the prop-logic predicate correctly", () => {
				const pred = Mode.propositionalLogic;
				expect(addPredicate("hallo", pred)).toEqual("diproche(hallo).");
			});
			it("Adds FO-logic predicate correctly", () => {
				const pred = Mode.firstOrderPredicateLogic;
				expect(addPredicate("hallo", pred)).toEqual("diproche_fo(hallo).");
			});
			it("Adds test-predicate correctly", () => {
				const pred = Mode.test;
				expect(addPredicate("hallo", pred)).toEqual("teste(hallo).");
			});
		});
	});
	describe("Edge cases", () => {
		describe("Empty string as an input", () => {
			it("Adds the prop-logic predicate to an empty string", () => {
				const pred = Mode.propositionalLogic;
				expect(addPredicate("", pred)).toEqual("diproche().");
			});
			it("Adds FO-logic predicate to an empty string", () => {
				const pred = Mode.firstOrderPredicateLogic;
				expect(addPredicate("", pred)).toEqual("diproche_fo().");
			});
			it("Adds test-predicate to an empty string", () => {
				const pred = Mode.test;
				expect(addPredicate("", pred)).toEqual("teste().");
			});
		});
	});
});

// The following description is based on the one in detectWrongSyntax.ts
// Only difference is, here it is expected to throw Errors.
describe("getVocabErrors", () => {
	it("Throws an error for one wrong word in a two-word-input", () => {
		emptyIssueList();
		const userInput = "WrongWord RightWord";
		getVocabErrors(userInput);
		expect(listAllIssues()).toEqual(getAllIssues(userInput));
	},
);

	it("Creates a correct Issue-array for two words seperated by a Whitespace", () => {
		emptyIssueList();
		const userInput = "Te st";
		getVocabErrors(userInput);
		expect(listAllIssues()).toEqual(getAllIssues(userInput));
	},
);

	it("Detects a String of word1.word2 as two words and throws an Error, if they are invalid", () => {
		emptyIssueList();
		const userInput = "word1 word2";
		getVocabErrors(userInput);
		expect(listAllIssues()).toEqual(getAllIssues(userInput));
	},
);

	it("Detects a String of word1,;:<>=word2 as two words and throws an Error, if they are invalid", () => {
		emptyIssueList();
		const userInput = "Te,;<>=st";
		getVocabErrors(userInput);
		expect(listAllIssues()).toEqual(getAllIssues(userInput));
	});
});

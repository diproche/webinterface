import { addPredicate, Mode } from "./diprocheInterface";

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

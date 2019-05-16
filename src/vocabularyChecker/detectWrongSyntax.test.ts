import React from "react";
import ReactDOM from "react-dom";
import {collectAllInvalidWords, collectInvalidWordsInIssues} from "./detectWrongSyntax";
import {getInvalidWords, logMultipleOccurences, logMultipleWords, logSingleWord} from "./detectWrongSyntax";
import {Position} from "./detectWrongSyntax";

describe("getInvalidWords", () => {
	it("Returns the correct word for a normal text", () => {
		const wrongWords = getInvalidWords("fu bar bloedsinn"); // fu and bar are indeed included in allowedVocab
		expect(wrongWords).toEqual(["bloedsinn"]);
	});

	it("Returns an empty array, if input is the empty string", () => {
		const wrongWords = getInvalidWords("");
		expect(wrongWords).toEqual([]);
	});

	it("Returns an invalid word only once, if it occurs multiple times", () => {
		const wrongWords = getInvalidWords("bloedsinn bloedsinn");
		expect(wrongWords).toEqual(["bloedsinn"]);
	});

// maybe it should not care about case sensitivity, but that's more of a design choice
	it("is case sensitive", () => {
		const wrongWords = getInvalidWords("fu Fu");
		expect(wrongWords).toEqual(["Fu"]);
	});

	it("Does not return a wrong word, if a string consists only of a whitespace", () => {
		const wrongWords = getInvalidWords(" ");
		expect(wrongWords).toEqual([]);
	});

	it("Does not detect a wrong word, if there is none", () => {
		const wrongWords = getInvalidWords("fu bar");
		expect(wrongWords).toEqual([]);
	});

	it("Works for long strings", () => {
		const wrongWords = getInvalidWords(`This is just a really long String to test some extreme case so
		the next letters will only be some copies of the letter a.
		aaaaaaaaaaaaaaaaaaaaaaaaaaa`);
		expect(wrongWords).toEqual(["This", "is", "just", "a", "really", "long", "String", "to", "test",
		"some", "extreme", "case", "so", "the", "next", "letters", "will", "only", "be", "copies",
		"of", "letter", "aaaaaaaaaaaaaaaaaaaaaaaaaaa"]);
	});

	it("Recognizes the words correctly", () => {
		const result = getInvalidWords("Hallo Welt, fu. foo, bar");
		expect(result).toEqual(["Hallo", "Welt", "foo"]);
	});

	it("Seperates words correctly along dots", () => {
		const result = getInvalidWords("hello.world");
		expect(result).toEqual(["hello", "world"]);
	});
});

describe("logSingleWord", () => {
	it("Logs a ordinary word correctly", () => {
		const position: Position = {fromIndex: 0, toIndex: 4};
		const issues = logSingleWord("Hello", position);
		expect(issues).toEqual(
			{message: `${"Hello"} von Stelle ${position.fromIndex} bis ${position.toIndex} ist ein unerlaubtes Wort! \n`,
		position: {
			fromIndex: position.fromIndex,
			toIndex: position.toIndex,
			}});
	});

/**
 * The next two testcases should never actually appear in practice. Since an empty word and a single whitespace
 * are not classified as "words" for our purposes. For the sake of completeness those cases are
 * tested nonetheless
 */

	it("Logs a empty word correctly", () => {
		const position: Position = {fromIndex: 0, toIndex: 0};
		const issues = logSingleWord("", position);
		expect(issues).toEqual(
			{message: `${""} von Stelle ${position.fromIndex} bis ${position.toIndex} ist ein unerlaubtes Wort! \n`,
		position: {
			fromIndex: position.fromIndex,
			toIndex: position.toIndex,
			}});
	});

	it("Logs a word consisting only of a whitespace correctly", () => {
		const position: Position = {fromIndex: 0, toIndex: 1};
		const issues = logSingleWord(" ", position);
		expect(issues).toEqual(
			{message: `${" "} von Stelle ${position.fromIndex} bis ${position.toIndex} ist ein unerlaubtes Wort! \n`,
		position: {
			fromIndex: position.fromIndex,
			toIndex: position.toIndex,
			}});
	});
});

describe("CollectAllInvalidWordsInIssues", () => {
	it("Creates a correct Issue-array for one wrong word", () => {
		const position: Position = {fromIndex: 0, toIndex: "WrongWord".length - 1};
		const issues = collectInvalidWordsInIssues("WrongWord RightWord", ["WrongWord"]);
		expect(issues).toEqual(
			[{message: "WrongWord", position: {fromIndex: 0, toIndex: 9}}]);
	});
});

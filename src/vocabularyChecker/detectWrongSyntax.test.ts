import React from "react";
import ReactDOM from "react-dom";
import {collectAllInvalidWords, createErrorMessages} from "./detectWrongSyntax";
import {createMapOfInvalidWords, getInvalidWords, logMapElement} from "./detectWrongSyntax";

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
}),

describe("logMapElement", () => {
it("Logs a map element correctly", () => {
	const issues = logMapElement([0, 4], `test`);
	expect(issues).toEqual({message: "test an Stelle 0,4 ist ein unerlaubtes Wort! \n",
	position: {fromIndex: 0, toIndex: 4}});
});

it("Logs a empty String correctly", () => {
	const issues = logMapElement([0, 0], ``);
	expect(issues).toEqual({message: " an Stelle 0,0 ist ein unerlaubtes Wort! \n",
	position: {fromIndex: 0, toIndex: 0}});
});

it("Logs a String containing multiple words correctly", () => {
	const text = `test Test`;
	const issues = logMapElement([0, text.length], text);
	expect(issues).toEqual({message: text + " an Stelle 0," + text.length + " ist ein unerlaubtes Wort! \n",
	position: {fromIndex: 0, toIndex: text.length}});
});
}),

describe("createMapOfInvalidWords", () => {
it("Creates a correct Map", () => {
	const issues = createMapOfInvalidWords(`test`, [`test`]);
	expect(issues.entries()).toEqual(["test", [0, 3]]);
});
}),

describe("createErrorMessages", () => {
it("Creates a correct error message", () => {
	const issues = createErrorMessages(`test1`, [`test1`]);
	expect(issues).toEqual("test1");
});
});

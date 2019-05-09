import React from "react";
import ReactDOM from "react-dom";
import {collectAllInvalidWords, createMapOfInvalidWords, preprocessText} from "./detectWrongSyntax";
//import {checkInput, createMapOfInvalidWords, eliminatePunctuation, splitIntoWords} from "./detectWrongSyntax";
/**
it("Eliminates Punctuation", () => {
		const noPunctuation = eliminatePunctuation("Hel.lo,world?");
		expect(noPunctuation).toEqual("Hel lo world ");
});

it("Transforms correctly", () => {
		const textarray = splitIntoWords("Hel lo wo rld");
		expect(textarray).toEqual(["Hel", "lo", "wo", "rld"]);
});

it("Creates a correct Map", () => {
	const issues = createMapOfInvalidWords(`test`, [`test`]);
	expect(issues).toEqual([[`test`, [0, 3]]]);
});
*/
it("Returns the correct word for a normal text", () => {
	const wrongWords = preprocessText("fu bar bloedsinn"); // fu and bar are indeed included in allowedVocab
	expect(wrongWords).toEqual(["bloedsinn"]);
});

it("Returns an empty array, if input is the empty string", () => {
	const wrongWords = preprocessText("");
	expect(wrongWords).toEqual([]);
});

it("Returns an invalid word only once, if it occurs multiple times", () => {
	const wrongWords = preprocessText("bloedsinn bloedsinn");
	expect(wrongWords).toEqual(["bloedsinn"]);
});

// maybe it should not care about case sensitivity, but that's more of a design choice
it("is case sensitive", () => {
	const wrongWords = preprocessText("fu Fu");
	expect(wrongWords).toEqual(["Fu"]);
});

it("Does not return a wrong word, if a string consists only of a whitespace", () => {
	const wrongWords = preprocessText(" ");
	expect(wrongWords).toEqual([]);
});

it("Does not detect a wrong word, if there is none", () => {
	const wrongWords = preprocessText("fu bar");
	expect(wrongWords).toEqual([]);
});

it("Works for long strings", () => {
	const wrongWords = preprocessText(`This is just a really long String to test some extreme case so
the next letters will only be some copies of the letter a.
aaaaaaaaaaaaaaaaaaaaaaaaaaa`);
	expect(wrongWords).toEqual(["This", "is", "just", "a", "really", "long", "String", "to", "test",
	"some", "extreme", "case", "so", "the", "next", "letters", "will", "only", "be", "copies",
		"of", "letter", "aaaaaaaaaaaaaaaaaaaaaaaaaaa"]);
});

it("Recognizes the words correctly", () => {
		const result = preprocessText("Hallo Welt, fu. foo, bar");
		expect(result).toEqual(["Hallo", "Welt", "foo"]);
});

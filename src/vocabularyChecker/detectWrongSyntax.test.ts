import React from "react";
import ReactDOM from "react-dom";
import {checkInput, createMapOfInvalidWords, eliminatePunctuation, splitIntoWords} from "./detectWrongSyntax";

it("Returns the correct word for a normal text", () => {
		const wrongWords = checkInput("fu bar bloedsinn"); // fu and bar are indeed included in allowedVocab
		expect(wrongWords).toEqual(["bloedsinn"]);
	});

it("Returns an empty array, if input is the empty string", () => {
		const wrongWords = checkInput("");
		expect(wrongWords).toEqual([]);
});

it("Returns an invalid word only once, if it occurs multiple times", () => {
		const wrongWords = checkInput("bloedsinn bloedsinn");
		expect(wrongWords).toEqual(["bloedsinn"]);
});

// maybe it should not care about case sensitivity, but that's more of a design choice
it("is case sensitive", () => {
		const wrongWords = checkInput("fu Fu");
		expect(wrongWords).toEqual(["Fu"]);
});

it("Does not return a wrong word, if a string consists only of a whitespace", () => {
		const wrongWords = checkInput(" ");
		expect(wrongWords).toEqual([]);
});

it("Does not detect a wrong word, if there is none", () => {
		const wrongWords = checkInput("fu bar");
		expect(wrongWords).toEqual([]);
});

it("Works for long strings", () => { // the following String contains an extra a
		const wrongWords = checkInput(`This is just a really long String to test some extreme case so
    the next letters will only be some copies of the letter a.
    aaaaaaaaaaaaaaaaaaaaaaaaaaa`);
		expect(wrongWords).toEqual(["This", "is", "just", "a", "really", "long", "String", "to", "test",
		"some", "extreme", "case", "so", "the", "next", "letters", "will", "only", "be", "copies",
			"of", "letter", "aaaaaaaaaaaaaaaaaaaaaaaaaaa"]);
});

it("is able to delete whitespaces", () => {
		const testWord = splitIntoWords("Hello World ");
		expect(testWord).toEqual(["Hello", "World"]);
});

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

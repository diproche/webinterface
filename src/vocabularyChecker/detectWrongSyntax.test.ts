import React from "react";
import ReactDOM from "react-dom";
import {checkInput, transformTextToStringArray, eliminatePunctuation} from "./detectWrongSyntax";


it("Works for simple text", () => {
    const wrongWords = checkInput("fu bar bloedsinn"); //fu and bar are indeed included in allowedVocab
    expect(wrongWords).toEqual(["bloedsinn"]);
  });

it("Works for an array containing only the empty String", () =>{
    const wrongWords = checkInput("");
    expect(wrongWords).toEqual([""]);
});

it("Works for an array containing duplicates", () =>{ 
    const wrongWords = checkInput("bloedsinn bloedsinn");
    expect(wrongWords).toEqual(["bloedsinn", "bloedsinn"]);
});

it("Works for case sensitive words", () =>{ //maybe it should not care about case sensitivity, but that's more of a design choice
    const wrongWords = checkInput("fu Fu");
    expect(wrongWords).toEqual(["Fu"]);
});

it("Works for spaces", () =>{
    const wrongWords = checkInput(" ");
    expect(wrongWords).toEqual([]);
})

it("Works if everything is correct", () =>{
    const wrongWords = checkInput("fu bar");
    expect(wrongWords).toEqual([]);
})

it("Works for long strings", () =>{ // the following String contains an extra a 
    const wrongWords = checkInput("This is just a really long String to test some extreme case so the next letters will only be some copies of the letter a. aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
    expect(wrongWords).toEqual(["This", "is", "just", "a", "really", "long", "String", "to", "test", "some", "extreme", "case", "so", "the", "next", "letters", "will", "only", "be", "some", "copies", "of", "the", "letter", "a", "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"])
})


it("is able to delete whitespaces", () =>{
    const testWord = transformTextToStringArray("Hello World ");
    expect(testWord).toEqual(["Hello", "World"])
})

it("Eliminates Punctuation", () =>{
    const noPunctuation = eliminatePunctuation("Hel.lo,world?");
    expect(noPunctuation).toEqual("Hel lo world ");
})

it("Transforms correctly", () =>{
    const textarray = transformTextToStringArray("Hel lo wo rld");
    expect(textarray).toEqual(["Hel", "lo", "wo", "rld"]);
})

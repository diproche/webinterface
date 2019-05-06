import { newExpression, stringLiteral } from "@babel/types";
import { elementType } from "prop-types";
import React, { Component } from "react";
import { createPortal } from "react-dom";
import { ProofEditor } from "../components/proofEditor/proofEditor";

// --------------------------------------
// @author: Ronja K.
// ---------------------------------------

export function textToListFormat(input: String) {

    input = input.replace("$", "$EXPRESSIONMARKER");                              //prepare expressionsdetector; this is needed as marker to finde the expressions after the $ disappear by calling the split-method
    input = input.replace("\n", "\n PARAGRAPHMARKER.");                         //prepare paragraphmarker

    const separator = /[\n.!?$]+/;                                              // List all the values the input will get splitted; \n will split paragraphs, $ will split expressions, the rest split sentences

    const splittedText = input.split(separator);
    const temp = [];
    //let sentenceCount = 0;                                                  //  |optional
    //let expressionCount = 0;                                                //  |optional
    //let paragraphCount = 0;                                                 //  |optional
    for (let index = 0; index < splittedText.length; index++) {
        var element = splittedText[index].trim();                               // whitespaces between sentences are not needed
        if (element != "") {

            if (element.match(/(EXPRESSIONMARKER)/)) {
                //temp.push("Expression_" + (expressionCount + 1));           //  |optional
                //expressionCount++;                                          //  |optional
                element = element.replace("EXPRESSIONMARKER", "");
                const formattedExpression = functionFormatter(element);
                temp.push(formattedExpression);
            }

            else if (element.match(/(PARAGRAPHMARKER)/)) {
                //temp.push("Paragraph_" + (paragraphCount + 1));             // |optional
                //paragraphCount = 0;                                         // |optional
                element = element.replace("PARAGRAPHMARKER", "abs")
                const paragraph = []
                paragraph.push(element);
                temp.push(paragraph);
            }
            else {
                //temp.push("Sentence_" + (sentenceCount + 1));                // |optional
                //sentenceCount++;                                             // |optional
                const sentenceIntoWords = sentenceIntoWordList(element);
                temp.push(sentenceIntoWords);
            }

        }

    }
    const listFormat = temp;

    return listFormat;
}

export function sentenceIntoWordList(input: String) {
    const separator = /[ ,$]+/; // List all the values where the content of a sentence will get splitted: whitespace[ ] and comma[,]
    const splittedSentenceIntoListOfWords = input.split(separator);
    const temp = [];
    let index = 0;
    for (let index = 0; index < splittedSentenceIntoListOfWords.length; index++) {
        // remove all elements(senteces) which are a empty String after splitting
        if (splittedSentenceIntoListOfWords[index] == "") {
            splittedSentenceIntoListOfWords.splice(index, 1);
        } else {
            let string = splittedSentenceIntoListOfWords[index].trim();
            string.trim();
            splittedSentenceIntoListOfWords[index] = string;
            // temp.push("Word_" + (index + 1));
            temp.push(splittedSentenceIntoListOfWords[index]);
        }
    }
    const ListOfWords = temp;
    return ListOfWords;

}

export function functionFormatter(input: string) {
    const splittedInput = splitFunction(input); // split function at "="
    return splittedInput;
}

export function removeWhiteSpaces(input: string) {
    const output = input.replace(/\s+/g, ""); // delete all white spaces
    return output;
}

export function splitFunction(input: string) {

    const separators = /(|<-->|<=>|<==>|->|-->|=>|<--|<-|<=|UND|AND|ODER|OR|NOT|NICHT)+/g;
    let splittedExpression = input.split(separators);
    const temp = [];
    for (let index = 0; index < splittedExpression.length; index++) {
        var string = removeWhiteSpaces(splittedExpression[index]);
        if (string !== "") {
            temp.push(splittedExpression[index]);
        }

    }

    splittedExpression = temp;
    return splittedExpression;
}

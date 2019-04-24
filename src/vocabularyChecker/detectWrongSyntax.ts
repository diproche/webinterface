import json from "./AllowedVocab.json"

/**
 * Checks, if all words used, are allowed.
 * 
 * 
 * 
 */

function preprocessingText(text: string){
    var cleantext = eliminatePunctuation(text);
    var textarray = transformTextToStringArray(cleantext);
    return textarray;
}

export function checkInput(text: string){
    let preprocessedText : string[] = preprocessingText(text);
    let issue : string[] = []; //collect all wrong words in a stringarray
    for (const word of preprocessedText) {
        if (!json.foo.includes(word)) {//word not included in AllowedVocab.json
            console.log(word + " ist kein erlaubtes Wort. Bitte verwenden Sie ein anderes!"); //for debugging purposes. The user should get a message on screen telling him what's wrong.
            issue.push(word);
        }
    }
    let allWrongWords :string = "";
    allWrongWords += issue.join //Join all wrong words to one String
    allWrongWords += " sind nicht erlaubte Wörter. Bitte verwenden Sie andere!"
    console.log(allWrongWords); //Tell the User what's wrong
    return issue;
}

/**
 * Delete any unwanted punctuation
 */

export function eliminatePunctuation(text: string){
    var punctuationRegularExpression = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]/g;//delete some unicoe characters as well as specific punctuation signs.
    var spaceRegularExpression = /\s+/g;
    text = text.replace(punctuationRegularExpression, ' ').replace(spaceRegularExpression, ' ');
    return text;
}

/**
 * Collects all positions where there is a whitespace in a string.
 */

function findSpacePositionsInStringArray(text: string){
    var index = 0;
    var spacePositions = [];
    while((index = text.indexOf(' ', index + 1)) > 0){
        spacePositions.push(index);
    }
    return spacePositions;
}

/**
 * Seperates a given string along it's whitespaces.
 */

export function transformTextToStringArray(text: string){
    text.trim; //delete leading and trailing whitespaces
    var spacePositions = findSpacePositionsInStringArray(text);
    var tempPos = 0;
    let result :  string[] = [];
    spacePositions.forEach(element => {//this loop is problematic. Adds a whitespace to the beginning of each word after the second one.
        result.push(text.substring(tempPos, element));
        tempPos = element;
    });
    //the substring after the last whitespace seems to miss in general, if this substring is not already empty. The next line fixes this.
    if(text.substring(spacePositions[spacePositions.length - 1], text.length) != " "){
    result.push(text.substring(spacePositions[spacePositions.length - 1], text.length));
    }
    for (let index = 0; index < result.length; index++) {
        if(result[index].startsWith(' ')){
            result[index] = result[index].substring(1, result[index].length); //delete the wrong whitespaces in the beginning
        }
    }
    return result;
}
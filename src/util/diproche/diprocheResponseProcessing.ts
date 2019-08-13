import * as _ from "lodash";
import { addIssue } from "../issueHandling/issueMapping";

/**
 * collects the response from Diproche
 * @param diprocheResponse - a string containing the response from diproche within prolog
 */
export function addDiprocheIssues(diprocheResponse: string): void {
	const errorList = convertErrorListStringToJSArray(getErrorList(diprocheResponse));
	errorList[0].forEach((unverifiedLine: number) => {
		addIssue("UNVERIFIED_LINE", {
			fromIndex: unverifiedLine,
			toIndex: unverifiedLine,
		});
	});
}

function convertErrorListStringToJSArray(listAsString: string): number[][] {
	let stringCopy: string = listAsString;

	// Removing the outter brackets
	stringCopy = stringCopy.slice(1);
	stringCopy = stringCopy.slice(0, stringCopy.length - 1);

	const outterForm: string[] = stringCopy.split(",");
	const jsArray: number[][] = [];

	outterForm.forEach((innerString: string) => {
		innerString = innerString.slice(1);
		innerString = innerString.slice(0, innerString.length - 1);

		const innerArray: string[] | undefined = innerString.split(",");

		if (!innerArray || _.isEqual(innerArray, new Array(""))) {
			jsArray.push(new Array());
		} else {
			innerArray.forEach((element: string) => jsArray.push([parseInt(element, 10)]));
		}
	});

	return jsArray;
}

function getErrorList(diprocheResponse: string): string {
	const fetchErrorListRegExp = /List of Lists with unverified Input: ([^$]*)/;
	const ErrorList: RegExpExecArray | null = fetchErrorListRegExp.exec(diprocheResponse);
	if (ErrorList) {
		return ErrorList[1];
	}

	// Pretending no error happened.
	// This part of the code will be reached if the diproche server is not running or the list ist not diproche readable
	// (wrong syntax or unallowed words)
	return "[]";

}

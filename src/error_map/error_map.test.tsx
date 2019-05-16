// IMPORTS
import { addErrorToErrorMap, emptyErrorList, findErrorMessage, listCollectedErrors } from "./error_map";


test("test if finding of error messages out from the referenc map works correctly;", () => {
	emptyErrorList();
	const testErrorMessage = 104;
	const result = findErrorMessage(testErrorMessage);
	const expectedResult = "Error 104";
	expect(result).toEqual(expectedResult);

});
test("test if finding of error messages out from the referenc map works correctly", () => {
	emptyErrorList();
	const testErrorMessage = 999;
	const result = findErrorMessage(testErrorMessage);
	const expectedResult = undefined;
	expect(result).toEqual(expectedResult);
});

test("test if adding and returning of error messages works correctly", () => {
	emptyErrorList();
	addErrorToErrorMap(101);
	addErrorToErrorMap(104);
	addErrorToErrorMap(104);
	addErrorToErrorMap(103);
	const result = listCollectedErrors();
	const expectedResult = ["Error 101", "Error 104", "Error 104", "Error 103"];
	expect(result).toEqual(expectedResult);
});

import {nestedIndexOf} from "./nestedArray";

test.each`
    array | search | expectedResult

    ${[["grandfatherm"], ["grandfatherf"], ["grandmotherm"], ["grandmotherf"], ["false"]]} |
    ${["false"]} |
    ${4}

		${[["grandfatherm"], ["grandfatherf"], ["grandmotherm"], ["grandmotherf"], ["false"]]} |
    ${["grandfatherm"]} |
    ${0}
  `("$search is in $array at index $expectedResult", async ({array, search, expectedResult}) => {
		expect(nestedIndexOf(array, search)).toEqual(expectedResult);
	});

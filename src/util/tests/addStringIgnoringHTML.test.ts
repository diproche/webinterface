import addStringIgnoringHTML from "../addStringIgnoringHTML";

describe("Normal Cases", () => {
	test("Inserts Into A Normal String", () => {
		const basisString: string = "This is test";
		const stringToAdd: string = " a";
		const stringWithInsertion: string = addStringIgnoringHTML(basisString, stringToAdd, 7);
		expect(stringWithInsertion).toStrictEqual("This is a test");
	});

	test("Ignores A Single HTML Tag", () => {
		const basisString: string = "<textarea /> This is textarea";
		const stringToAdd: string = " a";
				// Inserting at index 8 because of the whitespace between the tag and the actual text
		const stringWithInsertion: string = addStringIgnoringHTML(basisString, stringToAdd, 8);
		expect(stringWithInsertion).toStrictEqual("<textarea /> This is a textarea");
	});

	test("Ignores Multiple HTML Tags", () => {
		const basisString: string = "<div><u>This</u> is <b>test</b></div>";
		const stringToAdd: string = " a";
		const stringWithInsertion: string = addStringIgnoringHTML(basisString, stringToAdd, 7);
		expect(stringWithInsertion).toStrictEqual("<div><u>This</u> is a <b>test</b></div>");
	});

	test("Avoids Doubling Up Strings As Default", () => {
		const basisString: string = "This is a test";
		const stringToAdd: string = " a";
		const stringWithInsertion: string = addStringIgnoringHTML(basisString, stringToAdd, 7);
		expect(stringWithInsertion).toStrictEqual("This is a test");
	});

	test("Doubles Up Strings If Specified", () => {
		const basisString: string = "This is a test";
		const stringToAdd: string = " a";
		const stringWithInsertion: string = addStringIgnoringHTML(basisString, stringToAdd, 7, true);
		expect(stringWithInsertion).toStrictEqual("This is a a test");
	});

	test("Will add the same string in multiple locations", () => {
		const basisString: string =  "Wenn gleich ist, dann";
		const stringToAdd: string = " X";
		const stringWithInsertion: string = addStringIgnoringHTML(basisString, stringToAdd, [4, 11, 21]);
		expect(stringWithInsertion).toStrictEqual("Wenn X gleich X ist, dann X");
	});
});

describe("Limit Cases", () => {
	test("Will Add To The Beginning Of the String With Position = 0", () => {
		const basisString: string = "is a test";
		const stringToAdd: string = "This ";
		const stringWithInsertion: string = addStringIgnoringHTML(basisString, stringToAdd, 0);
		expect(stringWithInsertion).toStrictEqual("This is a test");
	});

	test("Will Add To The End Of the String With Position = basisString.length + 1", () => {
		const basisString: string = "This is a ";
		const stringToAdd: string = "test";
		const stringWithInsertion: string = addStringIgnoringHTML(basisString, stringToAdd, basisString.length + 1);
		expect(stringWithInsertion).toStrictEqual("This is a test");
	});

	test("If The Position Is At A Closing HTML Tag It Inserts Inside The HTML Tag", () => {
		const basisString: string = "This is <b>a</b>";
		const stringToAdd: string = " test";
		const stringWithInsertion: string = addStringIgnoringHTML(basisString, stringToAdd, 9);
		expect(stringWithInsertion).toStrictEqual("This is <b>a test</b>");
	});

	test("If The Position Is At A Opening HTML Tag It Inserts Inside The HTML Tag", () => {
		const basisString: string = "This <b>a</b> test";
		const stringToAdd: string = "is ";
		const stringWithInsertion: string = addStringIgnoringHTML(basisString, stringToAdd, 5);
		expect(stringWithInsertion).toStrictEqual("This <b>is a</b> test");
	});

	test("< Doesn't Break It", () => {
		const basisString: string = "5 < 3";
		const stringToAdd: string = "5";
		const stringWithInsertion: string = addStringIgnoringHTML(basisString, stringToAdd, 5);
		expect(stringWithInsertion).toStrictEqual("5 < 35");
	});

	test("< [...] > Doesn't Break It", () => {
		const basisString: string = "5 < 3 and 35 > 5";
		const stringToAdd: string = "5";
		const stringWithInsertion: string = addStringIgnoringHTML(basisString, stringToAdd, 5);
		expect(stringWithInsertion).toStrictEqual("5 < 35 and 35 > 5");
	});
});

// Change later should be basisString without tags
describe("Error Cases", () => {
	test("Position Is Larger than basisString.length", () => {
		const basisString: string = "Four";
		const stringToAdd: string = "Somehing";
		const executeFunction = () => addStringIgnoringHTML(basisString, stringToAdd, 6);
		expect(executeFunction).toThrow("Index Out Of Bound");
	});

	test("Position Is Negative", () => {
		const basisString: string = "Four";
		const stringToAdd: string = "Something";
		const executeFunction = () => addStringIgnoringHTML(basisString, stringToAdd, -1);
		expect(executeFunction).toThrow("Index Out Of Bound");
	});
});

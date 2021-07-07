import parseStringToIntegerArray from "../parseStringToIntegerArray";

describe("Normal Cases", () => {
	test("Converts the string [16]", () => {
		expect(parseStringToIntegerArray("[16]")).toStrictEqual([16]);
	});

	test("Converts the string [16, 17, 15]", () => {
		expect(parseStringToIntegerArray("[16, 17, 15]")).toStrictEqual([16, 17, 15]);
	});
});

describe("Edge Cases", () => {
	test("Converts an empty array to an empty array", () => {
		expect(parseStringToIntegerArray("[]")).toStrictEqual([]);
	});
});

describe("Error Cases", () => {
	test("Only an opening bracket will throw an error", () => {
		expect(() => parseStringToIntegerArray("[")).toThrow();
	});

	test("Only a closing bracket will throw an error", () => {
		expect(() => parseStringToIntegerArray("]")).toThrow();
	});

	test("[16, 17, 15 will throw an error", () => {
		expect(() => parseStringToIntegerArray("[16, 17, 15")).toThrow();
	});

	test("16, 17, 15] will throw an error", () => {
			expect(() => parseStringToIntegerArray("16, 17, 15]")).toThrow();
	});

	test("16, 17, 15 will throw an error", () => {
			expect(() => parseStringToIntegerArray("16, 17, 15")).toThrow();
	});
});

import fs from "fs";
import path from "path";
import "../../../swipl-wasm/swipl-web";
import { consult, loadingComplete as swiLoadingComplete, query } from "./swiplwasmHandler";

describe("Fubar", () => {
	beforeAll(async () => {
		await swiLoadingComplete;
	}, 15000);

	test("Test whether bob and frank are men", async () => {
		await consult("man(bob).");
		expect(await query("man(bob).")).toEqual("true.");
		expect(await query("man(frank).")).toEqual("false.");
	});

	test("Waiting on previous results and maintaining order is not necessary", async () => {
		consult("man(bob).");
		const bobResult = query("man(bob).");
		const frankResult = query("man(frank).");

		expect(await frankResult).toEqual("false.");
		expect(await bobResult).toEqual("true.");
	});

	test("Can reconsult", async () => {
		consult("man(bob).");
		const bobResult = query("man(bob).");

		consult("man(frank).");
		const frankResult = query("man(frank).");

		expect(await bobResult).toEqual("true.");
		expect(await frankResult).toEqual("true.");
	});

	test("Can return concrete answer", async () => {
		await consult("man(bob).");
		expect(await query("man(N).")).toEqual("N = bob.");
	});

	/* doesn't work yet.

	test("Can return multiple answers", async () => {
		await consult("man(bob). man(frank).");
		expect(await query("man(N).")).toEqual("N = bob;", "N = frank.");
	});

	test("Handles consulting errors", async () => {
		try {
			await consult("man(bob.");
			fail("Should have thrown.");
		} catch (e) {
			expect(e.message).toBe(
				"ERROR: /file.pl:1:7: Syntax error: Operator expected",
			);
		}
	});

	test("Handles querying errors", async () => {
		await consult("man(bob).");
		await query("man(bob).");
	});
	*/
});

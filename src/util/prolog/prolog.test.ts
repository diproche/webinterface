
import { PrologSession } from "./prologSession";
import * as programs from "./testPrograms";

// Tau-Prolog always uses "false." to signify the end of the output stream. This behavior deviates from
// SWI Prolog's behavior sometimes, but it generally more consistent.

describe("Tau-Prolog Behavior", () => {
		test("Evaluates Facts Correctly (True Queries)", async () => {
			const session = programs.evenNumbersFacts;
			const results = (await session.executeQuery("even(2).")).getRawResults();

			expect(results).toStrictEqual(["true ;", "false."]);
		});

		test("Evaluates Facts Correctly (False Queries)", async () => {
				const session = programs.evenNumbersFacts;
				const results = (await session.executeQuery("even(3).")).getRawResults();

				expect(results).toStrictEqual(["false."]);
		});

		test("Evaluates Equalities Correctly (True Queries)", async () => {
				const session = programs.emptyCode;
				const results = (await session.executeQuery("2 = 2.")).getRawResults();

				expect(results).toStrictEqual(["true ;", "false."]);
		});

		test("Evaluates Equalities Correctly (False Queries)", async () => {
				const session = programs.emptyCode;
				const results = (await session.executeQuery("2 = 3.")).getRawResults();

				expect(results).toStrictEqual(["false."]);
		});

		test("Evaluates Transitiv Equalities Correctly (False Query)", async () => {
				const session = programs.emptyCode;
				const results = (await session.executeQuery("X = 2, X = 3.")).getRawResults();

				expect(results).toStrictEqual(["false."]);
		});

		test("Does Not Resolve Operators with =", async () => {
				const session = programs.emptyCode;
				const results = (await session.executeQuery("X = 2 + 3.")).getRawResults();

				expect(results).toStrictEqual(["X = '+'(2, 3) ;", "false."]);
		});

		test("Resolves Operators with the 'is'", async () => {
				const session = programs.emptyCode;
				const results = (await session.executeQuery("X is 2 + 3.")).getRawResults();

				expect(results).toStrictEqual(["X = 5 ;", "false."]);
		});

		test("Assigns Values To One Variable Correctly", async () => {
				const session = programs.evenNumbersFacts;
				const results = (await session.executeQuery("even(X).")).getRawResults();

				expect(results).toStrictEqual(["X = 2 ;", "X = 4 ;", "X = 6 ;", "X = 8 ;", "false."]);
		});

		test("Assigns Values To Two Variables Correctly", async () => {
			const session = programs.likingFacts;
			const results = (await session.executeQuery("likes(X, Y).")).getRawResults();
			expect(results).toStrictEqual(["X = lisa, Y = bob ;", "X = frank, Y = lisa ;", "false." ]);
		});

		test("Evaluates Expression with the Cut-Operator Correctly", async () => {
			const session = programs.max;
			const results = (await session.executeQuery("max(2, 5, X).")).getRawResults();
			expect(results).toStrictEqual(["X = 5 ;", "false." ]);
		});

		test("The write/1 function returns true", async () => {
			const session = programs.emptyCode;
			const results = (await session.executeQuery("write('hello').")).getRawResults();

			expect(results).toStrictEqual(["true ;", "false." ]);
		});

		test("Evaluates the maplist/3 Function Correctly", async () => {
			const session = programs.emptyCode;
			const results = (await session.executeQuery("maplist(plus(1), [1,2,3], X).")).getRawResults();

			expect(results).toStrictEqual(["X = [2,3,4] ;", "false." ]);
		});

});

describe("PrologResult.getResults()", () => {
	test('The evenNumberFacts Program returns the correct Map for "even(x)."', async () => {
		const session = programs.evenNumbersFacts;
		const results = (await session.executeQuery("even(X).")).getResults();

		const expectedResults = new Map().set("X", ["2", "4", "6", "8"]).set("booleanAnswers", [false]);

		expect(results).toStrictEqual(expectedResults);
	});

	test('The family Program returns the correct Map for "grandmother(X, son)."', async () => {
		const session = programs.family;
		const results = (await session.executeQuery("grandmother(X, son).")).getResults();

		const expectedResults = new Map().set("X", ["grandmotherm", "grandmotherf"]).set("booleanAnswers", [false]);

		expect(results).toStrictEqual(expectedResults);
	});
});

describe("PrologResult.getResultArray()", () => {
	test('The evenNumberFacts Program returns [["2"], ["4"],  ["6"], ["8"], ["false"]] for "even(x)."', async () => {
		const session = programs.evenNumbersFacts;
		const results = (await session.executeQuery("even(X).")).getResultArray();

		expect(results).toStrictEqual([["2"], ["4"],  ["6"], ["8"], ["false"]]);
	});

	test('The family Program returns [["grandmotherm"], ["grandmotherf"], ["false"]] for "grandmother(X, son)."',
	async () => {
		const session = programs.family;
		const results = (await session.executeQuery("grandmother(X, son).")).getResultArray();

		expect(results).toStrictEqual([["grandmotherm"], ["grandmotherf"], ["false"]]);
	});
});

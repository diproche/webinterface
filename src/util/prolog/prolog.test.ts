
import { PrologSession } from "./prologSession";
import * as program from "./testPrograms";

// Expected results are consistent with SWI-Prolog behavior except that they usually have an extra "false."

describe("Tau-Prolog Behavior, PrologSession.executeQuery() & PrologResult.getResultArray()", () => {
	describe("Simple Programs", () => {
		test("Truth Value (True)", async () => {
				const session = new PrologSession("likes(lisa, bob).", 1000);
				const results = (await session.executeQuery("likes(lisa, bob).")).getResultArray();

				expect(results).toStrictEqual([["true"], ["false"]]);
		});

		test("Truth Value (False)", async () => {
				const session = new PrologSession("likes(lisa, bob).", 1000);
				const results = (await session.executeQuery("likes(lisa, dieter).")).getResultArray();

				expect(results).toStrictEqual([["false"]]);
		});

		test("One Variable One Result", async () => {

				const session = new PrologSession("likes(lisa, bob).", 1000);
				const results = (await session.executeQuery("likes(lisa, X).")).getResultArray();
				expect(results).toStrictEqual([["bob"], ["false"]]);

		});

		test("Two Variables One Result", async () => {
				const session = new PrologSession("likes(lisa, bob, karl).", 1000);
				const results = (await session.executeQuery("likes(lisa, X, Y).")).getResultArray();

				expect(results).toStrictEqual([["bob", "karl"], ["false"]]);

		});

		test("Three Variables One Result", async () => {
				const session = new PrologSession("likes(lisa, bob, karl, friedrich).", 1000);
				const results = (await session.executeQuery("likes(lisa, X, Y, Z).")).getResultArray();

				expect(results).toStrictEqual([["bob", "karl", "friedrich"], ["false"]]);

		});

		test("Four Variables One Result", async () => {
				const session = new PrologSession("likes(lisa, bob, karl, friedrich, dieter).", 1000);
				const results = (await session.executeQuery("likes(lisa, X, Y, Z, A).")).getResultArray();

				expect(results).toStrictEqual([["bob", "karl", "friedrich", "dieter"], ["false"]]);

		});

		test("One Variable Two Results", async () => {

				const session = new PrologSession("likes(lisa, bob). likes(lisa, dieter).", 1000);
				const results = (await session.executeQuery("likes(lisa, X).")).getResultArray();
				expect(results).toStrictEqual([["bob"], ["dieter"], ["false"]]);

		});

		test("Two Variables Two Results", async () => {
				const session = new PrologSession("likes(lisa, bob, karl). likes(lisa, karl, bob).", 1000);
				const results = (await session.executeQuery("likes(lisa, X, Y).")).getResultArray();

				expect(results).toStrictEqual([["bob", "karl"], ["karl", "bob"], ["false"]]);

		});

		test("Three Variables Two Results", async () => {
				const session = new PrologSession("likes(lisa, bob, karl, friedrich). likes(lisa, bob, friedrich, karl).", 1000);
				const results = (await session.executeQuery("likes(lisa, X, Y, Z).")).getResultArray();

				expect(results).toStrictEqual([["bob", "karl", "friedrich"], ["bob", "friedrich", "karl"], ["false"]]);

		});

		test("Four Variables Two Results", async () => {
				const session = new PrologSession(`
					likes(lisa, bob, karl, friedrich, dieter).
					likes(lisa, bob, karl, dieter, friedrich).
					`, 1000);
				const results = (await session.executeQuery("likes(lisa, X, Y, Z, A).")).getResultArray();

				expect(results).toStrictEqual(
					[["bob", "karl", "friedrich", "dieter"], ["bob", "karl", "dieter", "friedrich"], ["false"]],
				);

		});

		test("Cut Operator Maximum Function", async () => {

				const session = new PrologSession("max(X,Y,Y)  :-  X  =<  Y, !. max(X, Y, X).", 1000);
				const results = (await session.executeQuery("max(3, 7, X).")).getResultArray();
				expect(results).toStrictEqual([["7"], ["false"]]);

		});

		test("Cut Operator Endless Loop", async () => {

				const session = new PrologSession("likes(lisa, bob, karl). likes(X, Y, Z):- likes(X, Z, Y), !.", 1000);
				const results = (await session.executeQuery("likes(lisa, Y, Z).")).getResultArray();
				expect(results).toStrictEqual([["bob", "karl"], ["karl", "bob"], ["false"]]);

		});

		test("Only Write", async () => {

				const session = new PrologSession("write('Hello').", 1000);
				const results = (await session.executeQuery("")).getResultArray();
				expect(results).toStrictEqual([["false"]]);

		});

		test("Write Function and Query", async () => {

				const session = new PrologSession("write('Hello'). likes(lisa, bob).", 1000);
				const results = (await session.executeQuery("likes(lisa, bob).")).getResultArray();
				expect(results).toStrictEqual([["true"], ["false"]]);

		});

		test("Truth Value (True) Perfomance", async () => {
				const session = new PrologSession("likes(bob, lisa).", 1000);
				const results = (await session.executeQuery("likes(bob, lisa).")).getResultArray();
				expect(results).toStrictEqual([["true"], ["false"]]);
		});

		/* No longer needed with the introduction of maps.

			test("filterBooleanResults()", async () => {

					const session = new PrologSession("likes(lisa, bob). male(bob).", 1000);
					const results = (await session.executeQuery("likes(lisa, X); male(X); true; false.")).filterBooleanResults();
					expect(results).toStrictEqual([true, false]);

			});

			test("filterVariableResults()", async () => {

					const session = new PrologSession("likes(lisa, bob). male(bob).", 1000);
					const results = (await session.executeQuery("likes(lisa, X); male(X); true; false.")).filterVariableResults();
					expect(results).toStrictEqual([["bob"], ["bob"]]);

			});
		*/
});

	describe("Family Program", () => {
		test.each`
	    input | expectedResults
	    ${"grandparent(X, daugther)."} |
			${[["grandfatherm"], ["grandfatherf"], ["grandmotherm"], ["grandmotherf"], ["false"]]}

			${"grandparent(X, son)."} |
			${[["grandfatherm"], ["grandfatherf"], ["grandmotherm"], ["grandmotherf"], ["false"]]}


			//Getting all grandmother
			${"grandmother(X, daugther)."} |
			${[["grandmotherm"], ["grandmotherf"], ["false"]]}

			${"grandmother(X, son)."} |
			${[["grandmotherm"], ["grandmotherf"], ["false"]]}


			//Getting all grandfathers
			${"grandfather(X, daugther)."} |
			${[["grandfatherm"], ["grandfatherf"], ["false"]]}

			${"grandfather(X, son)."} |
			${[["grandfatherm"], ["grandfatherf"], ["false"]]}


			//Getting all parents
			// The return of "mom" and "dad" twice would be an unwanted but expected behavior.
			//This is a problem that would have to be solved in
			//prolog, but doesn't fall into the scope of the test
			${"parent(X, _)."} |
			${[["dad"], ["mom"], ["dad"], ["mom"], ["grandfatherm"],
			["grandfatherf"], ["grandmotherm"], ["grandmotherf"], ["false"]]}

			//Getting all children
			//Same as for "Getting all parents"
			${"parent(_, X)."} |
			${[["daugther"], ["daugther"], ["son"], ["son"], ["mom"], ["dad"], ["mom"], ["dad"], ["false"]]}

			//Getting all male people
			${"male(X)."} |
			${[["dad"], ["son"], ["grandfatherm"], ["grandfatherf"], ["false"]]}

			//Getting all female people
			${"female(X)."} |
			${[["mom"], ["daugther"], ["grandmotherm"], ["grandmotherf"], ["false"]]}

			//Is grandfatherm grandparent of daugther
			${"grandparent(grandfatherm, daugther)."} |
			${[["true"], ["false"]]}

			//Is grandfatherm grandparent of son
			${"grandparent(grandfatherm, son)."} |
			${[["true"], ["false"]]}

			//Is grandfatherm grandfather of daugther
			${"grandfather(grandfatherm, daugther)."} |
			${[["true"], ["false"]]}

			//Is grandfatherm grandfather of son
			${"grandfather(grandfatherm, son)."} |
			${[["true"], ["false"]]}

			//Is grandfatherm grandmother of daugther
			${"grandmother(grandfatherm, daugther)."} |
			${[["false"]]}

			//Is grandfatherm grandmother of son
			${"grandmother(grandfatherm, son)."} |
			${[["false"]]}
	  `("The Query $input", async ({input, expectedResults}) => {
			expect((await program.familySession.executeQuery(input)).getResultArray()).toStrictEqual(expectedResults);
		});
	});
});

describe("PrologResult.getMap()", () => {
	test("Two Variables Each 3 Results & One Boolean Result", async () => {

			const session = new PrologSession("likes(lisa, bob). likes(lisa, frank). likes(bob, frank).", 1000);
			const results = (await session.executeQuery("likes(X, Y).")).getResults();
			expect(results).toStrictEqual(
				new Map()
					.set("X", new Map()
						.set(0, "lisa")
						.set(1, "lisa")
						.set(2, "bob"))

					.set("Y", new Map()
						.set(0, "bob")
						.set(1, "frank")
						.set(2, "frank"))

					.set("Boolean", new Map()
						.set(0, false)));

	});
});

describe("Limit Cases", () => {

	const expectedMap: Map<string, Map<number, string|boolean>> =
		new Map().
			set("Boolean", new Map()
				.set(0, true)
				.set(1, false));

	test("Single Call of PrologResult.getResults() (Comparison)", async () => {
			const session = new PrologSession("likes(bob, lisa).", 1000);
			const results = (await session.executeQuery("likes(bob, lisa).")).getResults();

			expect(results).toStrictEqual(expectedMap);
	});

	// The runtime should check against the single call.
	// A second call should be quicker than the first call so the run time shouldn't double.
	test("Double Call of PrologResult.getResults() (Run Time)", async () => {
			const session = new PrologSession("likes(bob, lisa).", 1000);
			(await session.executeQuery("likes(bob, lisa).")).getResults();
			const results = (await session.executeQuery("likes(bob, lisa).")).getResults();

			expect(results).toStrictEqual(expectedMap);
	});
});

/* Now private. Not necessary with the new usage of maps.
describe("PrologResult.getResultsFor()", () => {
	describe("Family Program", () => {
		test.each`
			input | expectedResults
			${"parent(mom, X), male(X)."} | ${["son"]}

			${"parent(mom, X), male(X); parent(mom, Y)."} | ${["son"]}

			${"parent(mom, X)."} | ${["daugther", "son"]}

			${"parent(Y, Z)."} | ${[]}

			${"parent(X, Y), female(X)."} | ${["mom", "mom", "grandmotherm", "grandmotherf"]}

			${"parent(X, Y), male(X)."} | ${["dad", "dad", "grandfatherm", "grandfatherf"]}
		`("The Query $input", async ({input, expectedResults}) => {
			expect((await program.familySession.executeQuery(input)).getResultsFor("X")).toStrictEqual(expectedResults);
		});
	});
});
*/

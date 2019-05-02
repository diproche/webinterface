import { PrologSession } from "./prologSession";
// Expected results are consistent with SWI-Prolog behavior except that they usually have an extra "false."

describe("Session.executeQuery()", () => {
	describe("Simple Programs", () => {
		test("Truth Value (True)", async () => {
				const session = new PrologSession("likes(lisa, bob).", 1000);
				const result = await session.executeQuery("likes(lisa, bob).");

				expect(result).toEqual([["true"], ["false"]]);
		});

		test("Truth Value (False)", async () => {
				const session = new PrologSession("likes(lisa, bob).", 1000);
				const result = await session.executeQuery("likes(lisa, dieter).");

				expect(result).toEqual([["false"]]);
		});

		test("One Variable One Result", async () => {

				const session = new PrologSession("likes(lisa, bob).", 1000);
				const result = await session.executeQuery("likes(lisa, X).");
				expect(result).toEqual([["bob"], ["false"]]);

		});

		test("Two Variables One Result", async () => {
				const session = new PrologSession("likes(lisa, bob, karl).", 1000);
				const result = await session.executeQuery("likes(lisa, X, Y).");

				expect(result).toEqual([["bob", "karl"], ["false"]]);

		});

		test("Three Variables One Result", async () => {
				const session = new PrologSession("likes(lisa, bob, karl, friedrich).", 1000);
				const result = await session.executeQuery("likes(lisa, X, Y, Z).");

				expect(result).toEqual([["bob", "karl", "friedrich"], ["false"]]);

		});

		test("Four Variables One Result", async () => {
				const session = new PrologSession("likes(lisa, bob, karl, friedrich, dieter).", 1000);
				const result = await session.executeQuery("likes(lisa, X, Y, Z, A).");

				expect(result).toEqual([["bob", "karl", "friedrich", "dieter"], ["false"]]);

		});

		test("One Variable Two Results", async () => {

				const session = new PrologSession("likes(lisa, bob). likes(lisa, dieter).", 1000);
				const result = await session.executeQuery("likes(lisa, X).");
				expect(result).toEqual([["bob"], ["dieter"], ["false"]]);

		});

		test("Two Variables Two Results", async () => {
				const session = new PrologSession("likes(lisa, bob, karl). likes(lisa, karl, bob).", 1000);
				const result = await session.executeQuery("likes(lisa, X, Y).");

				expect(result).toEqual([["bob", "karl"], ["karl", "bob"], ["false"]]);

		});

		test("Three Variables Two Results", async () => {
				const session = new PrologSession("likes(lisa, bob, karl, friedrich). likes(lisa, bob, friedrich, karl).", 1000);
				const result = await session.executeQuery("likes(lisa, X, Y, Z).");

				expect(result).toEqual([["bob", "karl", "friedrich"], ["bob", "friedrich", "karl"], ["false"]]);

		});

		test("Four Variables Two Results", async () => {
				const session = new PrologSession(`
					likes(lisa, bob, karl, friedrich, dieter).
					likes(lisa, bob, karl, dieter, friedrich).
					`, 1000);
				const result = await session.executeQuery("likes(lisa, X, Y, Z, A).");

				expect(result).toEqual([["bob", "karl", "friedrich", "dieter"], ["bob", "karl", "dieter", "friedrich"], ["false"]]);

		});

		test("Cut Operator Maximum Function", async () => {

				const session = new PrologSession("max(X,Y,Y)  :-  X  =<  Y, !. max(X, Y, X).", 1000);
				const result = await session.executeQuery("max(3, 7, X).");
				expect(result).toEqual([["7"], ["false"]]);

		});

		test("Cut Operator Endless Loop", async () => {

				const session = new PrologSession("likes(lisa, bob, karl). likes(X, Y, Z):- likes(X, Z, Y), !.", 1000);
				const result = await session.executeQuery("likes(lisa, Y, Z).");
				expect(result).toEqual([["bob", "karl"], ["karl", "bob"], ["false"]]);

		});

		test("Only Write", async () => {

				const session = new PrologSession("write('Hello').", 1000);
				const result = await session.executeQuery("");
				expect(result).toEqual([["false"]]);

		});

		test("Write Function and Query", async () => {

				const session = new PrologSession("write('Hello'). likes(lisa, bob).", 1000);
				const result = await session.executeQuery("likes(lisa, bob).");
				expect(result).toEqual([["true"], ["false"]]);

		});

		test("Truth Value (True) Perfomance", async () => {
				const session = new PrologSession("likes(bob, lisa).", 1000);
				const result = await session.executeQuery("likes(bob, lisa).");

				expect(result).toEqual([["true"], ["false"]]);
		});
});

	describe("Family Program", () => {
		// To make it more clear what the code is supposed to give back the family title is used
		// instead of names
		// grandfatherf for grandfather father side of the family
		// grandfatherm for grandfather mother side of the family
		const session = new PrologSession(`
			male(dad).
			male(son).
			male(grandfatherm).
			male(grandfatherf).

			female(mom).
			female(daugther).
			female(grandmotherm).
			female(grandmotherf).

			parent(dad, daugther).
			parent(mom, daugther).
			parent(dad, son).
			parent(mom, son).
			parent(grandfatherm, mom).
			parent(grandfatherf, dad).
			parent(grandmotherm, mom).
			parent(grandmotherf, dad).

			father(X, Y):-
			parent(X, Y),
			male(X).

			mother(X, Y):-
			parent(X, Y),
			female(X).

			grandparent(X, Z):-
			parent(X, Y),
			parent(Y, Z).

			grandfather(X, Z):-
			grandparent(X, Z),
			male(X).

			grandmother(X, Z):-
			grandparent(X, Z),
			female(X).
				`, 1000);

		test.each`
	    input | expectedResult
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
	  `("The Query $input", async ({input, expectedResult}) => {
			expect(await session.executeQuery(input)).toEqual(expectedResult);
		});
	});
});

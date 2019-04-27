import { PrologSession } from "./prolog";

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

test("Truth Value (True) Perfomance", async () => {
		const session = new PrologSession("likes(bob, lisa).", 1000);
		const result = await session.executeQuery("likes(bob, lisa).");

		expect(result).toEqual([["true"], ["false"]]);
});

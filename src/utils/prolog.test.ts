import { PrologSession } from "./prolog";

async function collectAll<T>(asyncIterable: AsyncIterable<T>): Promise<T[]> {
	const result: T[] = [];
	for await (const item of asyncIterable) {
		result.push(item);
	}
	return result;
}

test("runs at all", async () => {
	const session = new PrologSession("mag(lisa, bob).");

	const asyncResult = session.executeQuery("mag(lisa, bob).");

	const result = await collectAll(asyncResult);

	expect(result).toEqual(["true ;", "false."]);
});

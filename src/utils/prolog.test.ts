import { PrologSession } from "./prolog";

test("runs at all", async () => {
    const session = new PrologSession("mag(lisa, bob).");
    const result = await session.executeQuery("mag(lisa, bob).");

    expect(result).toEqual(["true ;", "false."]);
});

test("writes", async () => {
    const session = new PrologSession("mag(lisa, bob).");
    const result = await session.executeQuery(`write("fubar").`);

    // expect(result.map(r => typeof r)).toEqual([]);

    expect(result).toEqual(["fubar", "true."]);
});

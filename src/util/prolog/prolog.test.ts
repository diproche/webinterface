import { PrologSession } from "./prolog";
import { format_answer, type } from "tau-prolog/modules/core";

const pathFile : string = "src/util/prolog/fetch";

test("runs at all", async () => {
    const session = new PrologSession("mag(lisa, bob).", 1000);
    const result = await session.executeQuery("mag(lisa, bob).");

    expect(result).toEqual(["true ;", "false."]);
});


test("writes", async () => {
    const session = new PrologSession("mag(lisa, bob). ?- open('" + pathFile +"', append, Stream), write(Stream, 'bar'), close(Stream).", 1000);

    // expect(result.map(r => typeof r)).toEqual([]);

});

test("prolog code in executeQuery()", async () => {
    const session = new PrologSession("", 1000);
    const result = await session.executeQuery(``);

    // expect(result.map(r => typeof r)).toEqual([]);

    expect(result).toEqual(["true ;", "false."]);

});

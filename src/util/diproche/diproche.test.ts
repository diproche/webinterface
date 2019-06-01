import {Diproche} from "./diproche";

test("Returns unverifiable lines and a false", async () => {
	const query = "diproche_fo([[wir,zeigen,[a,and,b],<->,[b,and,a]], [=>],[angenommen,a,and,b],[dann,a],[ferner,gilt,b],[damit,folgt,b,and,a],[qed],[abs],[<=],[nehmen,wir,jetzt,an,dass,b,and,a],[dann,folgt,a],[ausserdem,folgt,b],[also,gilt,nun,a,and,b],[qed],[damit,gilt,[a,and,b],<->,[c,and,a]]], X).";

 const diproche = new Diproche();
 const results = await (diproche.getFeedback(query));

 const expected = new Map()
										.set("X", ["[16]", "[]", "[]"])
										.set("booleanAnswers", [false]);

 expect(results).toStrictEqual(expected);
});

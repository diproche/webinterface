import "../../../swipl-wasm/swipl-web";
import { loadingFinishedPromise, query, result } from "./fubar";

describe("Fubar", () => {
	test("Tests bob is a man", async () => {
		await loadingFinishedPromise;
		query("man(bob).");
		console.log("Inside the test");
		console.log(result);
	});

	test("Tests frank is not a man", async () => {
		await loadingFinishedPromise;
		query("diproche_fo([[wir,zeigen,[a,and,b],<->,[b,and,a]],[=>],[angenommen,a,and,b],[dann,a],[ferner,gilt,b],[damit,folgt,b,and,a],[qed],[abs],[<=],[nehmen,wir,jetzt,an,dass,b,and,a],[dann,folgt,a],[ausserdem,folgt,b],[also,gilt,nun,a,and,b],[qed],[damit,gilt,[a,and,b],<->,[c,and,a]]], X).");
		console.log("Inside the test");
		console.log(result);
	});

	test("Gets X", async () => {
		await loadingFinishedPromise;
		query("man(X).");
		console.log("Inside the test");
		console.log(result);
	});
});

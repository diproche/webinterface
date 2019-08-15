import "../../../swipl-wasm/swipl-web";
import { loadingFinishedPromise, query } from "./fubar";

describe("Fubar", () => {
	test("Tests bob is a man", async () => {
		await loadingFinishedPromise;
		query("man(bob).");
	});

	test("Tests frank is not a man", async () => {
		await loadingFinishedPromise;
		query("man(frank).");
	});
});

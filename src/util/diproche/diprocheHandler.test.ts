import DiprocheHandler from "./diprocheHandler";
import tests from "./diprocheTestAssets.json";

describe("Diproche Handler", () => {

	const diproche = new DiprocheHandler();

	beforeAll(async () => {
		await diproche.loadDiproche();
	}, 15000);

	test("Will return 16 for test1", async () => {
		const result = await diproche.query(tests.test1);
		expect(result).toEqual([16]);
	}, 50000);

});

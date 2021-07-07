import fs from "fs";
import path from "path";

// The order of these two imports makes a functional difference
// tslint:disable: ordered-imports
import "../swipl-wasm/swipl-web";
import { consult, loadingComplete as swiLoadingComplete, query } from "../prolog/swiplwasmHandler";
// tslint:enable: ordered-imports

const diprocheProgramCode: string = fs.readFileSync(
	path.resolve(__dirname, "../../../diproche.pl"),
	{encoding: "utf-8"},
);

class DiprocheHandler {
	public async loadDiproche(): Promise<void> {
		await swiLoadingComplete;
		await consult(diprocheProgramCode);
		console.log("Diproche was loaded");
	}

	public async query(queryString: string): Promise<string> {
		let copyQueryString: string = queryString;
		copyQueryString = copyQueryString.substr(0, copyQueryString.length - 1);

		const result: string = await query("diproche_fo(" + copyQueryString + ", X).");
		return result;

	}

}

export default DiprocheHandler;

import {PrologResult} from "../prolog/prologResult";
import {importFile, PrologSession} from "../prolog/prologSession";

export class Diproche {
	private readonly session: PrologSession;

	constructor() {
		this.session = importFile("./diprocheProgram/diproche.pl");
	}

	public async getFeedBack(input: string): PrologResult {
		const results: PrologResult | Promise<PrologResult> =  this.session.executeQuery(input);
		return results;
	}

}

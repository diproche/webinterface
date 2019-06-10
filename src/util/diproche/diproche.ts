import {importFile, PrologSession} from "../prolog/prologSession";

export default class Diproche {
private readonly session: PrologSession;

	constructor() {
		this.session = importFile("../../.././readable_node_module_copies/diproche/diproche.pl");
	}

	public async getFeedback(input: string): Promise<ReadonlyMap<string, Array<string | boolean>>> {
		const resultObject =  await this.session.executeQuery(input);
		return new Promise(resolve => resolve(resultObject.getResults()));
	}

}

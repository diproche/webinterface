import { format_answer, type } from "tau-prolog/modules/core";

export class PrologSession {
	public readonly session: any;

	constructor(program?: string, limit?: number) {
		this.session = new type.Session(limit);
		if (program !== undefined) {
			this.session.consult(program);
		}
	}

	public async *executeQuery(query: string) {
		this.session.query(query);

		let result: string;
		do {
			yield result = await this.getNextAnswer();
		} while (result[result.length - 1] !== ".");
	}

	private getNextAnswer() {
		return new Promise<string>(resolve => {
			this.session.answers((x: any) => {
				resolve(format_answer(x));
			});
		});
	}
}

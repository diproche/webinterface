import { format_answer, type } from "tau-prolog/modules/core";
import {PrologResult} from "./prologResult";

export class PrologSession {

		public readonly session: any;

		constructor(program: string, limit?: number) {
				this.session = new type.Session(limit);
				this.session.consult(program);
		}

		public async executeQuery(query: string): Promise<PrologResult> {
				this.session.query(query);

				const rawResults: string[] = [];
				let result: string;

				do {
						result = await this.getNextAnswer();
						rawResults.push(result);
				} while (result[result.length - 1] !== ".");

				return new PrologResult(rawResults);
		}

		private getNextAnswer() {
				return new Promise<string>((resolve, reject) => {
						this.session.answers((x: any) => {
								resolve(format_answer(x));
						});
				});
		}
}

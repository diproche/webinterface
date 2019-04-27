import { format_answer, type } from "tau-prolog/modules/core";

export class PrologSession {
		public readonly session: any;

		constructor(program: string, limit?: number) {
				this.session = new type.Session(limit);
				// Loadig the program already fetches writes to a file in case of open -> write -> close
				this.session.consult(program);
		}

		public async executeQuery(query: string): Promise<string[][]> {
				this.session.query(query);

				const results: string[][] = [];

				let result: string;
				do {
						result = await this.getNextAnswer();
						this.formatMultiArray(result, results);
				} while (result[result.length - 1] !== ".");
				// this could be checked more reliably with the this.session.step() method
				// it returns an undefined if the end of the threat has been reached, but it does a step when called

				return results;
		}

		private getNextAnswer() {
				return new Promise<string>((resolve, reject) => {
						this.session.answers((x: any) => {
								resolve(format_answer(x));
						});
				});
		}

		private formatMultiArray(source: string, goal: string[][]): void {
			goal.push([]);
			// There is probably a more elegant way to fetch these cases
			if (source.includes("true")) { goal[goal.length - 1][0] = "true"; return; }
			if (source.includes("false")) { goal[goal.length - 1][0] = "false"; return; }

			const pattern: any = /= (\w*|\[.*\])?(,| ;|.)/g;
			const components: any = source.match(pattern);

			components.forEach((e: any) => {
				// Throws out the first two chars (= and a blank) and the last char (either , ; or .)
				const toAdd: string = e.substring(2, e.length - 1).trim();

				goal[goal.length - 1].push(toAdd);
			});
		}
}

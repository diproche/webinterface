import { format_answer, type } from "tau-prolog/modules/core";

export class PrologSession {

		public readonly session: any;

		constructor(program: string, limit?: number) {
				this.session = new type.Session(limit);
				this.session.consult(program);
		}

		// Options
		// 0 means return all values (boolean and variable values)
		// 1 means only return boolean returns
		// 2 means only return variable values
		public async executeQuery(query: string, option: number = 0): Promise<string[][]> {
				this.session.query(query);

				const results: string[][] = [];
				let result: string;

				do {
						result = await this.getNextAnswer();
						this.formatNestedArray(result, results);
				} while (result[result.length - 1] !== ".");
				// this could be checked more reliably with the this.session.step() method
				// it returns an undefined if the end of the threat has been reached, but it does a step when called
				// though it seems Tau-Prolog always signifies an end of program with "false."

				// Tau-Prolog seems to always end a program with "false." which is different from SWI-Prolog
				// when the return value is not a single false
				// The second part might be unneccesary but is there assure only ["false"] will ever be removed.
				if (results.length > 1 && results[results.length - 1][0] === "false") {
					results.pop();
				}

				return results;
		}

		private getNextAnswer() {
				return new Promise<string>((resolve, reject) => {
						this.session.answers((x: any) => {
								resolve(format_answer(x));
						});
				});
		}

		private formatNestedArray(source: string, goal: string[][]): void {
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

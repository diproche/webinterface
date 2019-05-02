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

				return this.filterResults(results, option);

		}

		private getNextAnswer() {
				return new Promise<string>((resolve, reject) => {
						this.session.answers((x: any) => {
								resolve(format_answer(x));
						});
				});
		}

		private filterResults(results: string[][], option: number): string[][] {
			return results;

			/*
			if (option === 0) { return results; }

			if (option === 1) {

			}

			if (option === 2) {

				// ct - check true (if and where a ["true"] occurs)
				// cf - check false (if and where a ["false"] occurs)
				let ct: number = 0;
				let cf: number = 0;

				while (ct !== -1 || cf !== -1) {
					// doesn't work since the indexOf doesn't work as expected with nested Arrays
					ct = results.indexOf(["true"]);
					cf = results.indexOf(["false"]);
					results.splice(ct, 1);
					results.splice(cf, 1);
				}
				results.indexOf(["false"]);
			}
			*/

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

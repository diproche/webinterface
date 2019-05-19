import fs from "fs";
import path from "path";
import { format_answer, type } from "tau-prolog/modules/core";
import {PrologResult} from "./prologResult";

// RegExp group one will be the file to be imported. Note: not global
const fetchPrologImportsRegExp = /:-( |)use_module\(([a-zA-Z1-9]*)\)\./;

export function importFile(relativePath: string): PrologSession {
	const absolutePath = path.resolve(__dirname, relativePath);
	const program = fs.readFileSync(absolutePath, "utf-8");
	return new PrologSession(program, path.dirname(absolutePath));
}

export class PrologSession {

		public readonly session: any;

		constructor(program: string, defaultPath: string = __dirname, limit?: number) {
				this.session = new type.Session(limit);

				let matchGroups: string[] | null;
				let importedCode: string;

				while ((matchGroups = fetchPrologImportsRegExp.exec(program)) !== null) {
					 importedCode = fs.readFileSync(defaultPath + path.sep + matchGroups[2] + ".pl", "utf-8");
					 program = program.replace(fetchPrologImportsRegExp, importedCode);
				}

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

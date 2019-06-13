import fs from "fs";
import path from "path";
import { format_answer, type } from "tau-prolog/modules/core";
import getTopologicalOrder, {Edge} from "../getTopologicalOrder";
import {fetchAllMatchesForAGroup} from "../regExpUtils";
import { PrologResult } from "./prologResult";
// PSM ~ prologStringManipulation
import * as PSM from "./prologStringManipulation";

// RegExp group one will be the file to be imported.
const fetchPrologImportsRegExp = /:-(?: |)use_module\(([a-zA-Z1-9]*)\) *\./g;

// relativePath is relative to this very file (prologSession.ts)
export function importFile(relativePath: string): PrologSession {
	const absolutePath = path.resolve(__dirname, relativePath);
	const program = fs.readFileSync(absolutePath, "utf-8");
	const fileName = PSM.removeFileExtension(path.basename(absolutePath));
	return new PrologSession(program, path.dirname(absolutePath), fileName);
}

function resolveImports(program: string, defaultPath: string, currentFileName: string = "main"): string {
		const dependencyGraph: Set<Edge> = getDependencyGraph(program, defaultPath, currentFileName);
		const importList: string[] = getTopologicalOrder(dependencyGraph);
		importList.shift();
		console.log(importList);
		let importedPrograms: string = "";
		importList.forEach((importFileName: string) => {
			let currentImport = fs.readFileSync(path.resolve(defaultPath, importFileName + ".pl"), "utf-8");
			currentImport = PSM.removeNonFunctionalities(currentImport);
			importedPrograms = importedPrograms + PSM.fixVariableShadowingInImport(importedPrograms + program, currentImport);
		});

		return importedPrograms + program;
}

function getDependencyGraph(
	program: string,
	defaultPath: string,
	currentFileName: string,
	currentGraph?: Set<Edge>): Set<Edge> {

		if (currentGraph === undefined) {
			currentGraph = new Set<Edge>();
		}

		const graph = currentGraph;

		fetchAllMatchesForAGroup(program, fetchPrologImportsRegExp, 1).forEach((fileName: string) => {
			const edgeToInsert: Edge = {origin: currentFileName, target: fileName};
			graph.add(edgeToInsert);
			const absolutePath = path.resolve(defaultPath, fileName + ".pl");
			const importedProgram = fs.readFileSync(absolutePath, "utf-8");
			getDependencyGraph(importedProgram, defaultPath, fileName, currentGraph);
		});

		return graph;
}

export class PrologSession {

		public readonly session: any;

		constructor(program: string, defaultPath: string = __dirname, fileName?: string, limit?: number) {
				program = PSM.removeNonFunctionalities(program);
				program = resolveImports(program, defaultPath, fileName);

				this.session = new type.Session(limit);
				program = PSM.removeModuleDeclarations(program);
				program = PSM.removeModuleImports(program);

				fs.writeFileSync(path.resolve(__dirname, "program.pl"), program);

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

		private getNextAnswer(): Promise<string> {
				return new Promise<string>((resolve) => {
						this.session.answers((x: any) => {
								resolve(format_answer(x));
						});
				});
		}

}

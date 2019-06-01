import fs from "fs";
import path from "path";
import { format_answer, type } from "tau-prolog/modules/core";
import getTopologicalOrder, {Edge} from "../getTopologicalOrder";
import {fetchAllMatchesForAGroup} from "../regExpUtils";
import { PrologResult } from "./prologResult";
import { removeFileExtension, removeModuleDeclarations, removeNonFunctionalities } from "./prologStringManipulation";

// RegExp group one will be the file to be imported.
const fetchPrologImportsRegExp = /:-(?: |)use_module\(([a-zA-Z1-9]*)\) *\./g;

// relativePath is relative to this very file (prologSession.ts)
export function importFile(relativePath: string): PrologSession {
	const absolutePath = path.resolve(__dirname, relativePath);
	const program = fs.readFileSync(absolutePath, "utf-8");
	const fileName = removeFileExtension(path.basename(absolutePath));
	return new PrologSession(program, path.dirname(absolutePath), fileName);
}

function resolveImports(program: string, defaultPath: string, currentFileName: string = "main"): string {
		const dependencyGraph: Set<Edge> = getDependencyGraph(program, defaultPath, currentFileName);
		const importList: string[] = getTopologicalOrder(dependencyGraph);
		let importedPrograms: string = "";
		importList.forEach((importFileName: string) => {
			const currentImport = fs.readFileSync(path.resolve(defaultPath, importFileName + ".pl"), "utf-8");
			importedPrograms = importedPrograms + currentImport;
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
				program = removeNonFunctionalities(program);
				program = resolveImports(program, defaultPath, fileName);

				this.session = new type.Session(limit);
				this.session.consult((removeModuleDeclarations(program)));
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

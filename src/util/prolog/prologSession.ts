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

/**
	* Imports a prolog file
	* @param relativePath - Relative to this very file (/src/util/prolog/prologSession.ts)
	* @return A Prolog Session running on the imported file
	*/
export function importFile(relativePath: string): PrologSession {
	const absolutePath = path.resolve(__dirname, relativePath);
	const program = fs.readFileSync(absolutePath, "utf-8");
	const fileName = PSM.removeFileExtension(path.basename(absolutePath));
	return new PrologSession(program, path.dirname(absolutePath), fileName);
}

/**
	* Resolves prolog intern imports. Files have to be in the same folder.
	* @param program - The program code to resolve imports for
	* @param defaultPath - The path in which to look for the file names
	* @param currentFileName - The name of the file which imports are being resolved
	* @return The program code with imported files at the top
	*/
function resolveImports(program: string, defaultPath: string, currentFileName: string = "main"): string {
		const dependencyGraph: Set<Edge> = getDependencyGraph(program, defaultPath, currentFileName);
		const importList: string[] = getTopologicalOrder(dependencyGraph);
		let importedPrograms: string = "";
		importList.forEach((importFileName: string) => {
			const currentImport = fs.readFileSync(path.resolve(defaultPath, importFileName + ".pl"), "utf-8");
			importedPrograms = importedPrograms + PSM.fixVariableShadowingInImport(importedPrograms + program, currentImport);
		});

		return importedPrograms + program;
}

/**
	* Creates the dependency graph for imports of the prolog files recursively
	* @param program - The program code to look for imports
	* @param defaultPath - The path in which to look for the file names
	* @param currentFileName - The name of the file which imports are being resolved
	* @param currentGraph - The current graph to implement recursion
	* @return The full dependency graph of the imports
	*/
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

/** Executes the prolog programs and queries, fetches the raw results and creates the PrologResult */
export class PrologSession {

	public readonly session: any;

	/**
		* @param program - The program code to run
		* @param defaultPath - Only needed for forwarding methode internally
		* @param fileName - Only needed for forwarding methode internally
		* @param maxSteps - The maximum amount of resolving steps to do before aborting a query
		*/
	constructor(program: string, defaultPath: string = __dirname, fileName?: string, maxSteps?: number) {
			program = PSM.removeNonFunctionalities(program);
			program = resolveImports(program, defaultPath, fileName);

			this.session = new type.Session(maxSteps);
			this.session.consult((PSM.removeModuleDeclarations(program)));
	}

	/**
		* Executes the query on the program and creates the result
		* @param query - The query to run on the given codebase
		* @return The result for the query
		*/
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
	/**
		* Receives the answers for the query set by set
		* @return The next result set
		*/
	private getNextAnswer(): Promise<string> {
			return new Promise<string>((resolve) => {
					this.session.answers((x: any) => {
							resolve(format_answer(x));
					});
			});
	}

}

import fs from "fs";
import path from "path";
import { format_answer, type } from "tau-prolog/modules/core";
import getTopologicalOrder, {Edge} from "../getTopologicalOrder";
import {fetchAllMatchesForAGroup} from "../regExpUtils";
import { PrologResult } from "./prologResult";
import { removeFileExtension, removeModuleDeclarations, removeNonFunctionalities } from "./prologStringManipulation";

// RegExp group one will be the file to be imported.
const fetchPrologImportsRegExp = /:-(?: |)use_module\(([a-zA-Z1-9]*)\) *\./g;

/**
	* Imports a prolog file
	* @param {string} relativePath - Relative to this very file (/src/util/prolog/prologSession.ts)
	* @return {PrologSession} A Prolog Session running on the imported file
	*/
export function importFile(relativePath: string): PrologSession {
	const absolutePath = path.resolve(__dirname, relativePath);
	const program = fs.readFileSync(absolutePath, "utf-8");
	const fileName = removeFileExtension(path.basename(absolutePath));
	return new PrologSession(program, path.dirname(absolutePath), fileName);
}

/**
	* Resolves prolog intern imports. Files have to be in the same folder.
	* @param {string} program - The program code to resolve imports for
	* @param {string} defaultPath - The path in which to look for the file names
	* @param {string} currentFileName - The name of the file which imports are being resolved
	* @return {PrologSession} The program code with imported files at the top
	*/
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

/**
	* Creates the dependency graph for imports of the prolog files recursively
	* @param {string} program - The program code to look for imports
	* @param {string} defaultPath - The path in which to look for the file names
	* @param {string} currentFileName - The name of the file which imports are being resolved
	* @param {Set<Edge>} currentGraph - The current graph to implement recursion
	* @return {Set<Edge>} The full dependency graph of the imports
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
		* @param {string} program - The program code to run
		* @param {string} defaultPath - Only needed for forwarding methode internally
		* @param {string} fileName - Only needed for forwarding methode internally
		* @param {number} maxSteps - The maximum amount of resolving steps to do before aborting a query
		*/
	constructor(program: string, defaultPath: string = __dirname, fileName?: string, maxSteps?: number) {
			program = removeNonFunctionalities(program);
			program = resolveImports(program, defaultPath, fileName);

			this.session = new type.Session(maxSteps);
			this.session.consult((removeModuleDeclarations(program)));
	}

	/**
		* Executes the query on the program and creates the result
		* @param {string} query - The query to run on the given codebase
		* @return {Promise<PrologResult>} The result for the query
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
		* @return {Promise<string>} The next result set
		*/
	private getNextAnswer(): Promise<string> {
			return new Promise<string>((resolve) => {
					this.session.answers((x: any) => {
							resolve(format_answer(x));
					});
			});
	}

}

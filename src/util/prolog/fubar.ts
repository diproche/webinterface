import fs from "fs";
import path from "path";
import { FS } from "../../../swipl-wasm/swipl-web";

// tslint:disable-next-line:prefer-const
let bindings: any = null;
let stdin = "";
let stdinPosition = 0;

const basePathDiproche: string = path.resolve(__dirname, "../../../diproche_source");
const diprocheFiles: string[] = fs.readdirSync(basePathDiproche);
const diprocheMap: Map<string, string> = new Map();
diprocheFiles.forEach((fileName: string) => {
	const filePath: string = path.resolve(basePathDiproche, "./" + fileName);
	diprocheMap.set(fileName.replace(".pl", ""), fs.readFileSync(filePath, "utf8"));
});

// var to make this variable global
// tslint:disable-next-line:no-var-keyword
export var result: string[] = [];

// We use this to provide data into
// the SWI stdin.
const setStdin = (s: string) => {
	stdin = s;
	stdinPosition = 0;
};
const readStdin = () => {
	if (stdinPosition >= stdin.length) {
		return null;
	} else {
		const code = stdin.charCodeAt(stdinPosition);
		stdinPosition++;
		return code;
	}
};

/**
 * Helper function to call a query.
 */
export function query(queryText: string) {
	setStdin(queryText);
	// This will execute one iteration of toplevel.
	call(bindings, "break"); // see call.js
}

// Creates bindings to the SWI foreign API.
function createBindings(bindingModule: any) {
	return {
		PL_initialise: bindingModule.cwrap("PL_initialise", "number", [
			"number",
			"number",
		]),
		PL_new_term_ref: bindingModule.cwrap("PL_new_term_ref", "number", []),
		PL_chars_to_term: bindingModule.cwrap("PL_chars_to_term", "number", [
			"string",
			"number",
		]),
		PL_call: bindingModule.cwrap("PL_call", "number", ["number", "number"]),
	};
}

// Helper function to parse a JavaScript
// string into a Prolog term and call is as a query.
function call(callBindings: any, callQuery: any) {
	const ref = callBindings.PL_new_term_ref();
	if (!callBindings.PL_chars_to_term(callQuery, ref)) {
		throw new Error("Query has a syntax error: " + callQuery);
	}
	return !!callBindings.PL_call(ref, 0);
}

// This will set up the arguments necessary for the PL_initialise
// function and will call it.
// See http://www.swi-prolog.org/pldoc/doc_for?object=c(%27PL_initialise%27)
function initialise(initBindings: any, initModule: any) {
	const argvArray = [
		initModule.allocate(
			initModule.intArrayFromString("swipl"),
			"i8",
			initModule.ALLOC_NORMAL,
		),
		initModule.allocate(
			initModule.intArrayFromString("-x"),
			"i8",
			initModule.ALLOC_NORMAL,
		),
		initModule.allocate(
			initModule.intArrayFromString("wasm-preload/swipl.prc"),
			"i8",
			initModule.ALLOC_NORMAL,
		),
		initModule.allocate(
			initModule.intArrayFromString("--nosignals"),
			"i8",
			initModule.ALLOC_NORMAL,
		),
	];
	const argvPtr = initModule._malloc(argvArray.length * 4);
	for (let i = 0; i < argvArray.length; i++) {
		initModule.setValue(argvPtr + i * 4, argvArray[i], "*");
	}
	if (!initBindings.PL_initialise(4, argvPtr)) {
		throw new Error("SWI-Prolog initialisation failed.");
	}
	// Set the path of the preloaded (from swipl-web.dat) standard library.
	// This makes it possible to call use_module(library(lists)) and so on.
	call(
		initBindings,
		"assert(user:file_search_path(library, 'wasm-preload/library')).",
	);
}

function pushToResultArray(value: string): void {
	result.push(value);
}

const swiplWasm = fs.readFileSync("swipl-wasm/swipl-web.wasm");
const swiplWasmData = fs.readFileSync("swipl-wasm/swipl-web.data").buffer;

// Stub Module object. Used by swipl-web.js to
// populate the actual Module object.
export const Module = {
	noInitialRun: true,
	locateFile: (url: string) => `swipl-wasm/${url}`,
	print: pushToResultArray,
	printErr: console.error,
	wasmBinary: swiplWasm,
	preRun: [() => FS.init(readStdin)], // sets up stdin
	getPreloadedPackage: (fileName: string) =>
		fileName === "swipl-wasm/swipl-web.data" ? swiplWasmData : null,
	onRuntimeInitialized: () => {
		// Bind foreign functions to JavaScript.
		bindings = createBindings(Module);
		// Initialise SWI-Prolog.
		initialise(bindings, Module);

		diprocheMap.forEach((programCode: string, fileName: string) => {
			FS.writeFile("/" + fileName + ".pl", programCode);
		});

		query("consult('/diproche.pl').");

		loadingFinished();
	},
};

let loadingFinished!: () => void;

export const loadingFinishedPromise = new Promise<void>(resolve => {
	loadingFinished = () => resolve();
});

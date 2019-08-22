import fs from "fs";
import path from "path";
import { FS } from "../swipl-wasm/swipl-web";

/**
 * Runs a query on the consulted program.
 * @param program The program to consult
 * @returns A promise that is resolved when the new program is loaded.
 */
export function query(queryText: string): Promise<string> {
	const previousPromise = lastPromise;
	const promise = new Promise<string>(async (resolve, _) => {
		let result: string;
		await previousPromise;
		printListener = str => {
			result = str;
			if (str.endsWith(".")) {
				resolve(result);
			} else {
				return query("bagof(X, " + queryText.substr(0, queryText.length - 1) + ", Xs).");
			}
		};
		errorListener = __ => {
			clear_exception();
		};
		setStdin(queryText);
		call("break");
	});
	lastPromise = promise;
	return promise;
}

/**
 * Consults a new prolog program. Waits for all previously started operations to finish.
 * @param program The program to consult
 * @returns A promise that is resolved when the new program is loaded.
 */
export function consult(program: string): Promise<void> {
	const previousPromise = lastPromise;
	const promise = new Promise<void>(async (resolve, reject) => {
		await previousPromise;
		printListener = str => {
			if (str === "true.") {
				resolve();
			}
		};
		errorListener = error => {
			clear_exception();
		};
		FS.writeFile("/file.pl", program);
		setStdin("consult('/file.pl').");
		call("break");
	});
	lastPromise = promise;
	return promise;
}

let loadingFinished!: () => void;
/** An awaitable promise to make sure SWI is loaded and responsive. */
export const loadingComplete = new Promise<void>(resolve => {
	loadingFinished = () => resolve();
});
let printListener: ((str: string) => void) | undefined;
let errorListener: ((str: string) => void) | undefined;
let lastPromise: Promise<unknown> = loadingComplete;

let bindings: any = null;
let stdin = "";
let stdinPosition = 0;

// We use this to provide data into
// the SWI stdin.
function setStdin(s: string) {
	stdin = s;
	stdinPosition = 0;
}

function readStdin() {
	if (stdinPosition >= stdin.length) {
		return null;
	} else {
		const code = stdin.charCodeAt(stdinPosition);
		stdinPosition++;
		return code;
	}
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
		PL_clear_exception: bindingModule.cwrap("PL_clear_exception", "number", []),
	};
}

// Helper function to parse a JavaScript
// string into a Prolog term and call is as a query.
function call(callQuery: string) {
	const ref = bindings.PL_new_term_ref();
	if (!bindings.PL_chars_to_term(callQuery, ref)) {
		throw new Error("Query has a syntax error: " + callQuery);
	}
	return !!bindings.PL_call(ref, 0);
}

function clear_exception() {
	bindings.PL_clear_exception();
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
	call("assert(user:file_search_path(library, 'wasm-preload/library')).");
}

const swiplWasm = fs.readFileSync(path.resolve(__dirname, "../swipl-wasm/swipl-web.wasm"));
const swiplWasmData = fs.readFileSync(path.resolve(__dirname, "../swipl-wasm/swipl-web.data")).buffer;

// Stub Module object. Used by swipl-web.js to
// populate the actual Module object.
export const Module = {
	noInitialRun: true,
	locateFile: (url: string) => `swipl-wasm/${url}`,
	print: (str: string) => {
		if (str === "") {
			return;
		}

		if (printListener) {
			printListener(str);
		} else {
			console.error(
				`Prolog printed "${str}", but no print listener was attached.`,
			);
		}
	},
	printErr: (str: string) => {
		if (str === "") {
			return;
		}

		if (errorListener) {
			errorListener(str);
		}
		console.error(str);
	},
	wasmBinary: swiplWasm,
	preRun: [() => FS.init(readStdin)], // sets up stdin
	getPreloadedPackage: (fileName: string) =>
		fileName === "swipl-wasm/swipl-web.data" ? swiplWasmData : null,
	onRuntimeInitialized: () => {
		// Bind foreign functions to JavaScript.
		bindings = createBindings(Module);
		// Initialise SWI-Prolog.
		initialise(bindings, Module);

		loadingFinished();
	},
};

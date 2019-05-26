import fs from "fs";
import path from "path";
import {PrologSession} from "./prologSession";

// Programs

// To make it more clear what the code is supposed to give back the family title is used
// instead of names
// grandfatherf for grandfather father side of the family
// grandfatherm for grandfather mother side of the family
export const family = new PrologSession(`
  male(dad).
  male(son).
  male(grandfatherm).
  male(grandfatherf).

  female(mom).
  female(daugther).
  female(grandmotherm).
  female(grandmotherf).

  parent(dad, daugther).
  parent(mom, daugther).
  parent(dad, son).
  parent(mom, son).
  parent(grandfatherm, mom).
  parent(grandfatherf, dad).
  parent(grandmotherm, mom).
  parent(grandmotherf, dad).

  father(X, Y):-
  parent(X, Y),
  male(X).

  mother(X, Y):-
  parent(X, Y),
  female(X).

  grandparent(X, Z):-
  parent(X, Y),
  parent(Y, Z).

  grandfather(X, Z):-
  grandparent(X, Z),
  male(X).

  grandmother(X, Z):-
  grandparent(X, Z),
  female(X).
  `);

export const max = new PrologSession(`
  max(X,Y,Y)  :-  X  =<  Y, !.
  max(X, Y, X).
  `);

export const evenNumbersFacts = new PrologSession(`
  even(2).
  even(4).
  even(6).
  even(8).
  `);

export const emptyCode = new PrologSession("");

export const likingFacts = new PrologSession(`
  likes(lisa, bob).
  likes(frank, lisa).
  `);

// Strings

export const stringManipulationsBasis: string = readTestFile("stringManipulationsBasis");
export const expectedRMD: string = readTestFile("removeModuleDeclarations");
export const expectedRC: string = readTestFile("removeComments");
export const rawDW: string = "None So far.  Now one occurence. Three Whitespaces follow   Like this.    ";
export const expectedDW: string = "None So far. Now one occurence. Three Whitespaces follow Like this. ";
export const expectedNF: string = readTestFile("removeNonFunctionalities");

// Helper Function

function readTestFile(fileName: string) {
	return fs.readFileSync(path.resolve(__dirname, "./testImports/" + fileName + ".pl"), "utf-8");
}

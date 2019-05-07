import {PrologSession} from "./prologSession";

// To make it more clear what the code is supposed to give back the family title is used
// instead of names
// grandfatherf for grandfather father side of the family
// grandfatherm for grandfather mother side of the family
export const familySession = new PrologSession(`
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
    `, 1000);

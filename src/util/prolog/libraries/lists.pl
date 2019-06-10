:-use_module(library(lists)).

memberchk(Elem, List):-
  member(Elem, List),
  !.


union([], L, L) :- !.

union([H|T], L, R) :-
  memberchk(H, L),
  !,
  union(T, L, R).

union([H|T], L, [H|R]) :-
  union(T, L, R).


subset([], _) :- !.

subset([E|R], Set) :-
  memberchk(E, Set),

subset(R, Set).

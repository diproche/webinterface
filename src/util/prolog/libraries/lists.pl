:- use_module(library(lists)).

member(El, [H|T]) :-
  member_(T, El, H).

member_(_, El, El).
member_([H|T], El, _) :-
  member_(T, El, H).

memberchk(Elem, List):-
  member(Elem, List),
  !.

length(0,[]).
length(L+1, [H|T]):-
  length_1(L,T).

maplist(Goal, List1, List2) :-
  maplist_(List1, List2, Goal).

maplist_([], [], _).
maplist_([Elem1|Tail1], [Elem2|Tail2], Goal) :-
  call(Goal, Elem1, Elem2),
  maplist_(Tail1, Tail2, Goal).



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

flatten(List, FlatList) :-
  flatten(List, [], FlatList0),
  !,
  FlatList = FlatList0.

flatten(Var, Tl, [Var|Tl]) :-
  var(Var),
  !.
flatten([], Tl, Tl) :- !.
flatten([Hd|Tl], Tail, List) :-
  !,
  flatten(Hd, FlatHeadTail, List),
flatten(Tl, Tail, FlatHeadTail).
flatten(NonList, Tl, [NonList|Tl]).

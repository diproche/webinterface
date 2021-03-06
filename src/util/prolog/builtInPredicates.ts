	/**
  * List of built in predicates from tau-prolog. Doesn't contain library predicates.
  * @see {@link http://tau-prolog.org/documentation}
  */
const tauPrologBuiltInPredicates: Set<string> = new Set(
	[
	"call",
	"catch",
	"fail",
	"false",
	"throw",
	"true",
	"subsumes_term",
	"unify_with_occurs_check",
	"abolish",
	"assert",
	"assertz",
	"retract",
	"retractall",
	"clause",
	"current_predicate",
	"arg",
	"copy_term",
	"functor",
	"term_variables",
	"acyclic_term",
	"atom",
	"atomic",
	"callable",
	"compound",
	"float",
	"ground",
	"integer",
	"is_list",
	"nonvar",
	"number",
	"var",
	"once",
	"repeat",
	"atomic_list_concat",
	"atom_chars",
	"atom_codes",
	"atom_concate",
	"atom_length",
	"char_code",
	"downcase_atom",
	"number_chars",
	"number_codes",
	"sub_atom",
	"upcase_atom",
	"bagof",
	"findall",
	"setof",
	"between",
	"is",
	"succ",
	"current_prolog_flag",
	"halt",
	"set_prolog_flag",
	"current_op",
	"op",
	"at_end_of_stream",
	"close",
	"current_input",
	"current_output",
	"flush_output",
	"open",
	"set_input",
	"set_output",
	"set_stream_position",
	"stream_property",
	"get_char",
	"get_code",
	"nl",
	"peek_char",
	"peek_code",
	"put_char",
	"put_code",
	"get_byte",
	"peek_byte",
	"put_byte",
	"read",
	"read_term",
	"write",
	"writeq",
	"write_canonical",
	"write_term",
	"use_module",
	"module"]);

export default tauPrologBuiltInPredicates;

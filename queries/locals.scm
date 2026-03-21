; Scopes
(block) @local.scope
(function_def) @local.scope
(for_statement) @local.scope
(while_statement) @local.scope
(loop_statement) @local.scope
(if_statement) @local.scope
(match_arm) @local.scope
(impl_block) @local.scope

; Definitions
(function_def
  name: (identifier) @local.definition)

(parameter
  name: (identifier) @local.definition)

(var_statement
  name: (identifier) @local.definition)

(const_def
  name: (identifier) @local.definition)

(static_def
  name: (identifier) @local.definition)

(for_statement
  variable: (identifier) @local.definition)

(struct_def
  name: (identifier) @local.definition)

(enum_def
  name: (identifier) @local.definition)

(codec_def
  name: (identifier) @local.definition)

(macro_def
  name: (identifier) @local.definition)

(category_def
  name: (identifier) @local.definition)

(type_alias
  name: (identifier) @local.definition)

(generic_param
  (identifier) @local.definition)

; References
(identifier) @local.reference

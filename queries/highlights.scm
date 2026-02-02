;; Keywords
[
  "fn"
  "struct"
  "enum"
  "latent"
  "const"
  "var"
  "static"
  "category"
  "extend"
  "extern"
  "import"
  "mod"
  "pub"
] @keyword

[
  "if"
  "else"
  "for"
  "while"
  "loop"
  "break"
  "continue"
  "return"
  "match"
] @keyword.control

[
  "in"
  "out"
  "inout"
] @keyword.modifier

[
  "mut"
  "ref"
  "as"
  "pure"
  "comptime"
  "unsafe"
  "uniform"
  "shared"
  "atomic"
] @keyword.modifier

;; Operators
[
  "+"
  "-"
  "*"
  "/"
  "%"
  "&"
  "|"
  "^"
  "!"
  "~"
  "<<"
  ">>"
  "&&"
  "||"
  "=="
  "!="
  "<"
  ">"
  "<="
  ">="
  "="
  "+="
  "-="
  "*="
  "/="
  ".."
  "..="
] @operator

[
  "=>"
] @punctuation.special

;; Delimiters
[
  "("
  ")"
  "["
  "]"
  "{"
  "}"
] @punctuation.bracket

[
  ","
  ";"
  ":"
  "::"
  "."
  "->"
] @punctuation.delimiter

;; Types
(primitive_type) @type.builtin

(struct_def
  name: (identifier) @type)

(enum_def
  name: (identifier) @type)

(latent_def
  name: (identifier) @type)

(category_def
  name: (identifier) @type)

(generic_type
  name: (identifier) @type)

(generic_param
  (identifier) @type.parameter)

;; Functions
(function_def
  name: (identifier) @function)

(call_expression
  function: (identifier) @function.call)

(call_expression
  function: (member_expression
    member: (identifier) @function.method.call))

;; Parameters
(parameter
  name: (identifier) @variable.parameter)

(self_param
  "self" @variable.builtin)

;; Fields
(field
  name: (identifier) @property)

(latent_field
  name: (identifier) @property)

(field_init
  (identifier) @property)

(member_expression
  member: (identifier) @property)

;; Variables
(var_statement
  name: (identifier) @variable)

(const_def
  name: (identifier) @constant)

(static_def
  name: (identifier) @variable.builtin)

;; Patterns
(pattern
  (identifier) @variable)

(constructor_pattern
  (identifier) @type)

;; Enum variants
(variant
  name: (identifier) @type.enum.variant)

;; Literals
(integer_literal) @number

(float_literal) @number.float

(string_literal) @string

(char_literal) @character

(escape_sequence) @string.escape

(bool_literal) @boolean

;; Comments
(line_comment) @comment

(block_comment) @comment

;; Attributes
(attribute
  (identifier) @attribute)

"#" @attribute

;; Special identifiers
((identifier) @variable.builtin
  (#match? @variable.builtin "^(self|Self)$"))

((identifier) @type
  (#match? @type "^[A-Z]"))

;; Paths
(path
  (identifier) @module)

(import_decl
  (path
    (identifier) @module))

"*" @character.special

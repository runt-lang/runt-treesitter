/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

export default grammar({
  name: "runt",

  extras: ($) => [/\s/, $.line_comment, $.block_comment],

  word: ($) => $.identifier,

  conflicts: ($) => [
    [$.match_statement, $.match_expression],
    [$.if_statement, $.if_expression],
  ],

  rules: {
    source_file: ($) => repeat($._item),

    //*****************************************************************************
    // ITEMS
    //*****************************************************************************

    _item: ($) =>
      choice(
        $.function_def,
        $.struct_def,
        $.enum_def,
        $.latent_def,
        $.macro_def,
        $.const_def,
        $.static_def,
        $.category_def,
        $.extend_def,
        $.extern_def,
        $.import_decl,
        $.mod_decl,
        $.attribute,
      ),

    //*****************************************************************************
    // FUNCTIONS
    //*****************************************************************************

    function_def: ($) =>
      seq(
        optional($.visibility),
        "fn",
        field("name", $.identifier),
        optional($.generic_params),
        $.param_list,
        optional(seq("->", field("return_type", $._type))),
        choice($.block, ";"),
      ),

    param_list: ($) => seq("[", optional(commaSep($._param)), "]"),

    _param: ($) => choice($.self_param, $.parameter),

    self_param: ($) => seq(optional("mut"), "self"),

    parameter: ($) =>
      seq(
        optional($.direction),
        optional("mut"),
        field("name", $.identifier),
        ":",
        field("type", $._type),
      ),

    direction: ($) => choice("in", "out", "inout"),

    //*****************************************************************************
    // STRUCTS
    //*****************************************************************************

    struct_def: ($) =>
      seq(
        optional($.visibility),
        "struct",
        field("name", $.identifier),
        optional($.generic_params),
        $.field_list,
        optional(";"),
      ),

    field_list: ($) => seq("[", optional(commaSep($.field)), "]"),

    field: ($) =>
      seq(
        optional($.visibility),
        field("name", $.identifier),
        ":",
        field("type", $._type),
      ),

    //*****************************************************************************
    // ENUMS
    //*****************************************************************************

    enum_def: ($) =>
      seq(
        optional($.visibility),
        "enum",
        field("name", $.identifier),
        optional($.generic_params),
        $.variant_list,
        optional(";"),
      ),

    variant_list: ($) => seq("[", optional(commaSep($.variant)), "]"),

    variant: ($) => seq(field("name", $.identifier), optional($.variant_data)),

    variant_data: ($) => seq("[", commaSep($._type), "]"),

    //*****************************************************************************
    // LATENT
    //*****************************************************************************

    latent_def: ($) =>
      seq(
        optional($.visibility),
        "latent",
        field("name", $.identifier),
        $.latent_field_list,
        optional(";"),
      ),

    latent_field_list: ($) => seq("[", optional(commaSep($.latent_field)), "]"),

    latent_field: ($) =>
      seq(
        field("name", $.identifier),
        ":",
        $.byte_range,
        "as",
        field("type", $._type),
      ),

    byte_range: ($) => seq("[", $.byte_offset, "..", $.byte_offset, "]"),

    byte_offset: ($) =>
      seq($.integer_literal, optional(seq(":", $.integer_literal))),

    //*****************************************************************************
    // MACRO
    //*****************************************************************************

    macro_def: ($) =>
      seq(optional($.visibility), "macro", $.macro_field_list, optional(";")),

    macro_field_list: ($) => seq("{", optional($.macro_block), "}"),

    macro_block: ($) => repeat(seq("")),

    //*****************************************************************************
    // CONST / STATIC / VAR
    //*****************************************************************************

    const_def: ($) =>
      seq(
        optional($.visibility),
        "const",
        field("name", $.identifier),
        ":",
        field("type", $._type),
        "=",
        field("value", $._expression),
        ";",
      ),

    static_def: ($) =>
      seq(
        optional($.visibility),
        "static",
        optional("var"),
        field("name", $.identifier),
        ":",
        field("type", $._type),
        optional(seq("=", field("value", $._expression))),
        ";",
      ),

    var_statement: ($) =>
      seq(
        "var",
        optional("mut"),
        field("name", $.identifier),
        optional(seq(":", field("type", $._type))),
        optional(seq("=", field("value", $._expression))),
        ";",
      ),

    //*****************************************************************************
    // CATEGORY / EXTEND
    //*****************************************************************************

    category_def: ($) =>
      seq(
        optional($.visibility),
        "category",
        field("name", $.identifier),
        optional($.generic_params),
        choice(seq("[", optional(commaSep($._category_item)), "]"), $.block),
        optional(";"),
      ),

    _category_item: ($) => choice($.function_def),

    extend_def: ($) =>
      seq("extend", field("type", $._extend_type), $.impl_block),

    impl_block: ($) =>
      seq("{", repeat(choice($.function_def, $.attribute)), "}"),

    // Separate type rule for extend to avoid conflicts
    _extend_type: ($) =>
      choice($.primitive_type, $._type_identifier, $.generic_type),

    //*****************************************************************************
    // EXTERN / IMPORT / MOD
    //*****************************************************************************

    extern_def: ($) =>
      seq(
        "extern",
        "fn",
        field("name", $.identifier),
        $.param_list,
        optional(seq("->", field("return_type", $._type))),
        ";",
      ),

    import_decl: ($) => seq("import", $.import_path, ";"),

    import_path: ($) =>
      seq(
        $.identifier,
        repeat(seq("::", $.identifier)),
        optional(
          seq("::", choice("*", seq("(", commaSep1($.identifier), ")"))),
        ),
      ),

    mod_decl: ($) =>
      seq(
        optional($.visibility),
        "mod",
        field("name", $.identifier),
        choice($.block, ";"),
      ),

    //*****************************************************************************
    // ATTRIBUTES
    //*****************************************************************************

    attribute: ($) =>
      seq(
        "#",
        "[",
        $.identifier,
        optional(seq("(", commaSep($._expression), ")")),
        repeat(
          seq(
            optional($.identifier),
            optional(seq("(", commaSep($._expression), ")")),
          ),
        ),
        "]",
      ),

    //*****************************************************************************
    // TYPES
    //*****************************************************************************

    _type: ($) =>
      choice(
        $.primitive_type,
        $._type_identifier,
        $.generic_type,
        $.pointer_type,
        $.array_type,
      ),

    _type_identifier: ($) => alias($.identifier, $.type_identifier),

    primitive_type: ($) =>
      choice(
        "bool",
        "char",
        "str",
        "ptr",
        "type",
        "u8",
        "u16",
        "u32",
        "u64",
        "usize",
        "i8",
        "i16",
        "i32",
        "i64",
        "isize",
        "f16",
        "f32",
        "f64",
        "vec2",
        "vec3",
        "vec4",
        "ivec2",
        "ivec3",
        "ivec4",
        "uvec2",
        "uvec3",
        "uvec4",
        "bvec2",
        "bvec3",
        "bvec4",
        "mat2",
        "mat3",
        "mat4",
        "dmat2",
        "dmat3",
        "dmat4",
      ),

    generic_type: ($) =>
      prec(1, seq(field("name", $.identifier), "<", commaSep1($._type), ">")),

    pointer_type: ($) => seq("*", $._type),

    array_type: ($) => seq("[", $._type, ";", $._expression, "]"),

    //*****************************************************************************
    // GENERICS
    //*****************************************************************************

    generic_params: ($) => seq("<", commaSep1($.generic_param), ">"),

    generic_param: ($) =>
      seq($.identifier, optional(seq(":", $.type_constraint))),

    type_constraint: ($) => sep1($.identifier, "+"),

    //*****************************************************************************
    // STATEMENTS
    //*****************************************************************************

    block: ($) => seq("{", repeat($._statement), "}"),

    _statement: ($) =>
      choice(
        $.var_statement,
        $.expression_statement,
        $.return_statement,
        $.if_statement,
        $.while_statement,
        $.for_statement,
        $.loop_statement,
        $.match_statement,
        $.break_statement,
        $.continue_statement,
        $.block,
      ),

    expression_statement: ($) => seq($._expression, ";"),

    return_statement: ($) => seq("return", optional($._expression), ";"),

    break_statement: ($) => seq("break", ";"),

    continue_statement: ($) => seq("continue", ";"),

    if_statement: ($) =>
      seq(
        "if",
        field("condition", $._expression),
        field("consequence", $.block),
        optional(
          seq("else", field("alternative", choice($.if_statement, $.block))),
        ),
      ),

    while_statement: ($) =>
      seq("while", field("condition", $._expression), field("body", $.block)),

    for_statement: ($) =>
      seq(
        "for",
        field("variable", $.identifier),
        "in",
        field("iterator", $._expression),
        field("body", $.block),
      ),

    loop_statement: ($) => seq("loop", $.block),

    match_statement: ($) =>
      seq(
        "match",
        field("value", $._expression),
        "[",
        commaSep($.match_arm),
        "]",
      ),

    match_arm: ($) => seq($.pattern, "=>", choice($._expression, $.block)),

    pattern: ($) =>
      choice(
        $.pattern_identifier,
        $.integer_literal,
        $.range_pattern,
        $.constructor_pattern,
        "_",
      ),

    pattern_identifier: ($) => $.identifier,

    range_pattern: ($) =>
      prec(1, seq($.integer_literal, "..", $.integer_literal)),

    constructor_pattern: ($) =>
      prec(1, seq($.identifier, "(", optional(commaSep($.pattern)), ")")),

    //*****************************************************************************
    // EXPRESSIONS
    //*****************************************************************************

    _expression: ($) =>
      choice(
        $.identifier,
        $._literal,
        $.unary_expression,
        $.binary_expression,
        $.call_expression,
        $.index_expression,
        $.member_expression,
        $.cast_expression,
        $.struct_literal,
        $.array_literal,
        $.range_expression,
        $.if_expression,
        $.match_expression,
        $.grouped_expression,
        $.path_expression,
      ),

    grouped_expression: ($) => seq("(", $._expression, ")"),

    unary_expression: ($) =>
      prec.left(
        8,
        seq(
          field("operator", choice("!", "-", "*", "&")),
          field("operand", $._expression),
        ),
      ),

    binary_expression: ($) =>
      choice(
        prec.right(
          1,
          seq(
            $._expression,
            choice("=", "+=", "-=", "*=", "/="),
            $._expression,
          ),
        ),
        prec.left(2, seq($._expression, "||", $._expression)),
        prec.left(3, seq($._expression, "&&", $._expression)),
        prec.left(4, seq($._expression, choice("|", "^", "&"), $._expression)),
        prec.left(5, seq($._expression, choice("==", "!="), $._expression)),
        prec.left(
          6,
          seq($._expression, choice("<", ">", "<=", ">="), $._expression),
        ),
        prec.left(7, seq($._expression, choice("<<", ">>"), $._expression)),
        prec.left(8, seq($._expression, choice("+", "-"), $._expression)),
        prec.left(9, seq($._expression, choice("*", "/", "%"), $._expression)),
      ),

    call_expression: ($) =>
      prec(
        10,
        seq(
          field("function", $._expression),
          "(",
          optional(commaSep($._expression)),
          ")",
        ),
      ),

    index_expression: ($) =>
      prec(
        10,
        seq(
          field("array", $._expression),
          "[",
          field("index", $._expression),
          "]",
        ),
      ),

    member_expression: ($) =>
      prec(
        10,
        seq(field("object", $._expression), ".", field("member", $.identifier)),
      ),

    cast_expression: ($) => prec.left(7, seq($._expression, "as", $._type)),

    struct_literal: ($) =>
      prec(
        1,
        seq(
          field("type", $.identifier),
          "{",
          optional(commaSep($.field_init)),
          "}",
        ),
      ),

    field_init: ($) => seq($.identifier, "=", $._expression),

    array_literal: ($) =>
      choice(
        seq("[", optional(commaSep($._expression)), "]"),
        seq("[", $._expression, ";", $._expression, "]"),
      ),

    range_expression: ($) =>
      prec.left(5, seq($._expression, choice("..", "..="), $._expression)),

    if_expression: ($) =>
      prec.right(
        seq(
          "if",
          field("condition", $._expression),
          field("consequence", $.block),
          "else",
          field("alternative", choice($.if_expression, $.block)),
        ),
      ),

    match_expression: ($) =>
      seq(
        "match",
        field("value", $._expression),
        "[",
        commaSep($.match_arm),
        "]",
      ),

    path_expression: ($) => seq($.identifier, repeat1(seq("::", $.identifier))),

    //*****************************************************************************
    // LITERALS
    //*****************************************************************************

    _literal: ($) =>
      choice(
        $.integer_literal,
        $.float_literal,
        $.string_literal,
        $.char_literal,
        $.bool_literal,
      ),

    integer_literal: ($) =>
      token(
        seq(
          choice(/[0-9][0-9_]*/, /0x[0-9a-fA-F_]+/, /0b[01_]+/, /0o[0-7_]+/),
          optional(/[uif](?:8|16|32|64|size)?/),
        ),
      ),

    float_literal: ($) =>
      token(
        seq(
          /[0-9][0-9_]*/,
          choice(
            seq(".", /[0-9][0-9_]*/),
            seq(/[eE][+-]?/, /[0-9][0-9_]*/),
            seq(".", /[0-9][0-9_]*/, /[eE][+-]?/, /[0-9][0-9_]*/),
          ),
          optional(/f(?:16|32|64)?/),
        ),
      ),

    string_literal: ($) =>
      seq('"', repeat(choice(/[^"\\]+/, $.escape_sequence)), '"'),

    char_literal: ($) => seq("'", choice(/[^'\\]/, $.escape_sequence), "'"),

    escape_sequence: ($) =>
      token.immediate(
        seq("\\", choice(/[\\'"nrt0]/, /x[0-9a-fA-F]{2}/, /u\{[0-9a-fA-F]+\}/)),
      ),

    bool_literal: ($) => choice("true", "false"),

    //*****************************************************************************
    // MISC
    //*****************************************************************************

    visibility: ($) => "pub",

    identifier: ($) => /[a-zA-Z_][a-zA-Z0-9_]*/,

    line_comment: ($) => token(choice(seq("//", /.*/), seq("///", /.*/))),

    block_comment: ($) => token(seq("/*", /[^*]*\*+([^/*][^*]*\*+)*/, "/")),
  },
});

/**
 * @param {Rule} rule
 */
function commaSep(rule) {
  return optional(commaSep1(rule));
}

/**
 * @param {Rule} rule
 */
function commaSep1(rule) {
  return seq(rule, repeat(seq(",", rule)), optional(","));
}

/**
 * @param {Rule} rule
 * @param {string} separator
 */
function sep1(rule, separator) {
  return seq(rule, repeat(seq(separator, rule)));
}

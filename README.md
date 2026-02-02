# tree-sitter-runt

Tree-sitter grammar for the [Runt](https://github.com/jarred/runt) programming language.

## Usage

### Neovim

Add to your tree-sitter configuration.

### Zed

Install the `runt` extension from the Zed extension marketplace.

### Node.js

```js
const Parser = require('tree-sitter');
const Runt = require('tree-sitter-runt');

const parser = new Parser();
parser.setLanguage(Runt);
```

### Rust

```rust
let language = tree_sitter_runt::language();
```

## Development

```bash
# Generate parser from grammar
npm run generate

# Run tests
npm test

# Parse a file
npm run parse -- path/to/file.runt
```

## License

MIT
# runt-treesitter

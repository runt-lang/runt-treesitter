package tree_sitter_runt_test

import (
	"testing"

	tree_sitter "github.com/smacker/go-tree-sitter"
	"github.com/tree-sitter/tree-sitter-runt"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_runt.Language())
	if language == nil {
		t.Errorf("Error loading Runt grammar")
	}
}

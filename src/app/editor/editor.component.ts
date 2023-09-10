import * as monaco from 'monaco-editor';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { naiveGuesser } from '../helpers/naive-guesser';
import { SuggestionsService } from '../suggestions.service';
import { Suggestions } from 'src/models/suggestions';

@Component({
  selector: 'my-application-editor',
  template: `
    <div
      style="height:100%"
      #editorContainer
    >test</div>
  `
})
export class EditorComponent implements OnInit {
  @ViewChild('editorContainer', { static: true }) _editorContainer!: ElementRef;
  codeEditorInstance!: monaco.editor.IStandaloneCodeEditor;
  suggestions: Suggestions = new Suggestions();
  completionItems!: monaco.IDisposable;

  constructor(private suggestionService: SuggestionsService) {}

  loadSuggestions(): void {
    this.suggestionService.getSuggestions().subscribe((sugg) => {
        this.suggestions = sugg;
        if(this.completionItems != null)
            this.completionItems.dispose();
        this.completionItems = this.editCompletionItems();
    });
  }

  editCompletionItems(): monaco.IDisposable {
    return monaco.languages.registerCompletionItemProvider('editlang', {
        provideCompletionItems: (model, position, token) => {
            const word = model.getWordUntilPosition(position);
            const range: monaco.IRange = {
                startLineNumber: position.lineNumber,
                endLineNumber: position.lineNumber,
                startColumn: word.startColumn,
                endColumn: word.endColumn
            };
            const possibilities = naiveGuesser.extractPossibilities(word.word, this.suggestions);

            const suggestions = [
                ...possibilities.map(w => {
                    return {
                        label: w,
                        kind: monaco.languages.CompletionItemKind.Variable,
                        insertText: w,
                        range: range
                    };
                })
            ];
            return { suggestions: suggestions };
        }
    });
  }

  ngOnInit() {
    this.loadSuggestions();

    monaco.languages.register({id: 'editlang'});
    let keywords = ["#"];
    monaco.languages.setMonarchTokensProvider('editlang', {
        keywords,
        tokenizer: {
            root: [
                [/@?[a-zA-Z][\w$]*/, {
                    cases: {
                        '@keywords': 'keyword',
                        '@default': 'variable'
                    }
                }],
                [/".*?"/, 'string'],
                [/\/\//, 'comment']
            ]
        }
    });
    monaco.editor.defineTheme('editlang-theme', {
        base: 'vs',
        rules: [
            { token: 'keyword', foreground: '#FF6600', fontStyle: 'bold' },
            { token: 'comment', foreground: '#999999' },
            { token: 'string', foreground: '#009966' },
            { token: 'variable', foreground: '#006699' }
        ],
        inherit: true,
        colors: {}
    });

    this.codeEditorInstance = monaco.editor.create(this._editorContainer.nativeElement, {
      theme: 'vs',
      wordWrap: 'on',
      wrappingIndent: 'indent',
      language: 'editlang',
      // minimap: { enabled: false },
      automaticLayout: true,
    });
  }
}
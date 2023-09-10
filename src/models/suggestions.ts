import { guessModel } from "./guessModel";

export class Suggestions {
    suggestionList: guessModel[];
    constructor() {
        this.suggestionList = [];
    }

    setSuggestions(suggestions: guessModel[]) {
        this.suggestionList = suggestions;
    }

    addSuggestion(suggestion: guessModel): void {
        this.suggestionList.push(suggestion);
    }

    removeLessAccurateSuggestions(numSuggestions: number): void {
        this.sortSuggestions();
        for(let i = 0; i < numSuggestions; ++i) this.suggestionList.pop()
    }

    sortSuggestions(): void {
        this.suggestionList = this.suggestionList.sort(this.compareSuggestions);
    }

    private compareSuggestions(a: guessModel, b: guessModel): number {
        if (a.score < b.score) return 1; 
        if (a.score > b.score) return -1;
        return a.guess.length < b.guess.length ? 1 : -1;
    }
}
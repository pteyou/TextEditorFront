import { Suggestions } from "src/models/suggestions";

export class naiveGuesser {
    static extractPossibilities = (word: string, suggestions: Suggestions): string[] => {
        suggestions.sortSuggestions();
        console.log(suggestions.suggestionList)
        return suggestions.suggestionList.filter(w => w.guess.includes(word))
        .map(ww => ww.guess.substring(ww.guess.lastIndexOf(word)).replaceAll('@@', ' '));
    }
}
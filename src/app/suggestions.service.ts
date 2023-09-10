import { Injectable, OnInit } from '@angular/core';
import { guessModel } from 'src/models/guessModel';
import { Suggestions } from 'src/models/suggestions';
import { SUGGESTIONS as SUGG } from './mock-suggestions';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SuggestionsService {

  _subject: Subject<guessModel> = new Subject<guessModel>();
  _suggSubject: Subject<Suggestions> = new Subject<Suggestions>();
  suggestions = new Suggestions();

  constructor() {
    this.suggestions.setSuggestions(SUGG.map(w => new guessModel(w, 1.0)));
    console.log(1);
    setInterval(() => {
      console.log("ixi");
      this._subject.next(new guessModel(`je@@viens@@${new Date()}`, Math.random()))
    }, 4000);

    this._subject.subscribe(guess => {
      this.suggestions.addSuggestion(guess)
      if(this.suggestions.suggestionList.length > 10)
        this.suggestions.removeLessAccurateSuggestions(1);
      this._suggSubject.next(this.suggestions);
    });
  }

  getSuggestions(): Subject<Suggestions> {
    return this._suggSubject;
  }
}

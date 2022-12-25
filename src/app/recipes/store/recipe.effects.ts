import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {catchError, map, of, switchMap} from "rxjs";
import {Store} from "@ngrx/store";
import {Actions, createEffect, ofType} from "@ngrx/effects";

import {Recipe} from "../recipe.model";
import * as fromApp from "../../store/app.reducer";
import * as RecipeActions from "./recipe.actions";

@Injectable()
export class RecipeEffects {

  constructor(private actions$: Actions,
              private store: Store<fromApp.AppState>,
              private http: HttpClient) {
  }
}

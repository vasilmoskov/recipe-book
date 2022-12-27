import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Recipe } from "./recipe.model";
import { map, Observable, of, switchMap, take } from "rxjs";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";

import * as fromApp from "../store/app.reducer";
import * as RecipeActions from "./store/recipe.actions";
import { Actions, ofType } from "@ngrx/effects";

@Injectable({ providedIn: 'root' })
export class RecipeResolverService implements Resolve<Recipe[]> {

  constructor(private store: Store<fromApp.AppState>, 
              private actions$: Actions
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Recipe[]> | Promise<Recipe[]> | Recipe[] {
    return this.store.select('recipe')
      .pipe(
        take(1),
        map(recipeState => recipeState.recipes),
        switchMap(recipes => {
          if(recipes.length === 0) {
            this.store.dispatch(new RecipeActions.FetchRecipes());

            return this.actions$.pipe(
              ofType(RecipeActions.SET_RECIPES),
              take(1)
            )
          } else {
            return of(recipes);
          }
        })
      )
  }
}

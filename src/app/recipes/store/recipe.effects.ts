import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, switchMap } from "rxjs";
import { Actions, createEffect, ofType } from "@ngrx/effects";

import { Recipe } from "../recipe.model";
import * as RecipeActions from "./recipe.actions";

@Injectable()
export class RecipeEffects {
  fetchRecipes = createEffect(() => this.actions$.pipe(
    ofType(RecipeActions.FETCH_RECIPES),
    switchMap(() => {
      return this.http
        .get<Recipe[]>(
          'https://ng-course-recipe-book-cabb2-default-rtdb.europe-west1.firebasedatabase.app/recipes.json'
        )
    }),
    map(recipes => {
      return recipes.map(recipe => {
        return {
          ...recipe,
          ingredients: recipe.ingredients ? recipe.ingredients : []
        }
      })
    }),
    map(recipes => {
      return new RecipeActions.SetRecipes(recipes);
    })
  ));

  constructor(private actions$: Actions,
    private http: HttpClient) {
  }
}

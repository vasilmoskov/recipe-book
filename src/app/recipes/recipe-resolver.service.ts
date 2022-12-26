import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Recipe } from "./recipe.model";
import { Observable, take } from "rxjs";
import { Injectable } from "@angular/core";
import { DataStorageService } from "../shared/data-storage.service";
import { RecipeService } from "./recipe.service";
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
    this.store.dispatch(new RecipeActions.FetchRecipes());

    return this.actions$.pipe(
      ofType(RecipeActions.SET_RECIPES),
      take(1)
    )
  }

}

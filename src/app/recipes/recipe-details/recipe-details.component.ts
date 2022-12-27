import {Component, OnInit} from '@angular/core';
import {Recipe} from "../recipe.model";
import {ActivatedRoute, Params, Router} from "@angular/router";
import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs';

import * as fromApp from "../../store/app.reducer";
import * as RecipeActions from "../store/recipe.actions";
import * as ShoppingListActions from "../../shopping-list/store/shopping-list.actions";

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.css']
})
export class RecipeDetailsComponent implements OnInit {
  recipe: Recipe;
  id: number;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private store: Store<fromApp.AppState>) {
  }

  ngOnInit(): void {
    this.route.params
      .pipe(
        map((params: Params) => {
          return +params['id'];
        }),
        switchMap(id => {
          this.id = id;
          return this.store.select('recipe')
        }),
        map(recipesState => {
          return recipesState.recipes.find((recipe, index) => {
            return index === this.id
          });
        })
      )
      .subscribe(recipe => {
        this.recipe = recipe
    })
  }

  onAddToShoppingList() {
    this.store.dispatch(new ShoppingListActions.AddIngredients(this.recipe.ingredients));
  }

  onEditRecipe() {
    this.router.navigate(['edit'], {relativeTo: this.route})
  }

  onDeleteRecipe() {
    this.store.dispatch(new RecipeActions.DeleteRecipe(this.id));
    this.router.navigate(['/recipes']);
  }
}

import {Ingredient} from "../shared/ingredient.model";
import {EventEmitter} from "@angular/core";
import {Subject} from "rxjs";

export class ShoppingListService {

  private ingredients: Ingredient[] = [];

  ingredientsChanged = new Subject<Ingredient[]>();
  startedEditing = new Subject<number>();

  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
    this.ingredientsChanged.next(this.getIngredients());
  }

  getIngredients() {
    return this.ingredients.slice();
  }

  getIngredient(index: number) {
    return this.ingredients[index];
  }

  addIngredients(ingredients: Ingredient[]) {
    this.ingredients.push(...ingredients);
    this.ingredientsChanged.next(this.getIngredients());
  }

  editIngredient(index: number, ingredient: Ingredient) {
    this.ingredients[index] = ingredient;
  }
}

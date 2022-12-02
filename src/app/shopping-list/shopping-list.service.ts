import {Ingredient} from "../shared/ingredient.model";
import {EventEmitter} from "@angular/core";

export class ShoppingListService {

  private ingredients: Ingredient[] = [];

  ingredientsChanged = new EventEmitter<Ingredient[]>();

  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
    this.ingredientsChanged.emit(this.getIngredients());
  }

  getIngredients() {
    return this.ingredients.slice();
  }

  addIngredients(ingredients: Ingredient[]) {
    this.ingredients.push(...ingredients);
    this.ingredientsChanged.emit(this.getIngredients());
  }
}

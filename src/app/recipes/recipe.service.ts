import {Recipe} from "./recipe.model";
import {EventEmitter} from "@angular/core";

export class RecipeService {
  selectedRecipe = new EventEmitter<Recipe>();

  private recipes: Recipe[] = [
    new Recipe('Mousaka', 'Bulgarian one', 'https://m.1001recepti.com/images/photos/recipes/size_5/musaka-s-kaima-i-zalivka-3-[1369].jpg'),
    new Recipe('Tarator', 'With fresh cucumber', 'https://www.forlife.bg/wp-content/uploads/2022/02/tarator.jpg')
  ];

  getRecipes() {
    return this.recipes.slice();
  }
}

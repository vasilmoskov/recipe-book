import {Recipe} from "./recipe.model";
import {Injectable} from "@angular/core";
import {Ingredient} from "../shared/ingredient.model";
import {ShoppingListService} from "../shopping-list/shopping-list.service";
import {Subject} from "rxjs";

@Injectable()
export class RecipeService {
  private recipes: Recipe[] = [
    new Recipe(
      'Mousaka',
      'Bulgarian one',
      'https://m.1001recepti.com/images/photos/recipes/size_5/musaka-s-kaima-i-zalivka-3-[1369].jpg',
      [new Ingredient('carrot', 5), new Ingredient('Hackfleisch', 1)]
    ),
    new Recipe(
      'Tarator',
      'With fresh cucumber',
      'https://www.forlife.bg/wp-content/uploads/2022/02/tarator.jpg',
      [new Ingredient('cucumber', 3), new Ingredient('milk', 2)])
  ];

  recipeManipulated = new Subject<Recipe[]>();

  constructor(private shoppingListService: ShoppingListService) {}

  getRecipes() {
    return this.recipes.slice();
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.shoppingListService.addIngredients(ingredients);
  }

  getRecipe(index: number) {
    return this.recipes[index]
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipeManipulated.next(this.getRecipes())
  }

  updateRecipe(index: number, recipe: Recipe) {
    this.recipes[index] = recipe;
    this.recipeManipulated.next(this.getRecipes())
  }
}

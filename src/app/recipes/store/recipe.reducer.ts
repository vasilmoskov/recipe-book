import * as RecipeActions from "./recipe.actions";
import { Recipe } from "../recipe.model";

export interface State {
  recipes: Recipe[],
  showedRecipeIndex: number,
  showedRecipe: Recipe,
  editMode: boolean,
  editedIngredientIndex: number
}

const initialState: State = {
  recipes: [],
  showedRecipeIndex: -1,
  showedRecipe: null,
  editMode: false,
  editedIngredientIndex: -1
}

export function recipeReducer(state = initialState, action: RecipeActions.RecipeActions) {
  switch (action.type) {
    case RecipeActions.SET_RECIPES:
      return {
        ...state,
        recipes: action.payload
      }

    case RecipeActions.ADD_RECIPE:
      return {
        ...state,
        recipes: [...state.recipes, action.payload]
      }

    case RecipeActions.UPDATE_RECIPE:
      const newRecipes = [...state.recipes];

      const updatedRecipe = {
          ...newRecipes[action.payload.index],
          ...action.payload.recipe
      }

      newRecipes[action.payload.index] = updatedRecipe;

      return {
        ...state,
        recipes: newRecipes
      }

    case RecipeActions.DELETE_RECIPE:
      return {
        ...state,
        recipes: [...state.recipes].filter((recipe, index) => {
          return index !== action.payload 
        })
      }

    default:
      return state;
  }
}

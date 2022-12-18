import {Ingredient} from "../../shared/ingredient.model";
import * as ShoppingListActions from "./shopping-list.actions";

const initialState = {
  ingredients: [
    new Ingredient('Tomatoes', 5),
    new Ingredient('Apples', 10),
  ]
}

export function shoppingListReducer(state = initialState, action: ShoppingListActions.ShoppingListActions) {
  switch (action.type) {
    case ShoppingListActions.ADD_INGREDIENT:
      return {
        ...state,
        ingredients: [...state.ingredients, action.payload]
      };
    case ShoppingListActions.ADD_INGREDIENTS:
      return {
        ...state,
        ingredients: [...state.ingredients, ...action.payload]
      };
    case ShoppingListActions.EDIT_INGREDIENT:
      const updatedIngredient = {
        ...state.ingredients[action.payload.index], // copies the ingredient at the given index
        ...action.payload.ingredient // overwrites the ingredient with the new passed ingredient
      }

      const updatedIngredients = [...state.ingredients];
      updatedIngredients[action.payload.index] = updatedIngredient;

      return {
        ...state,
        ingredients: updatedIngredients
      };
    case ShoppingListActions.DELETE_INGREDIENT:
      return {
        ...state,
        ingredients: [...state.ingredients].filter((ingredient, index) => {
          return index !== action.payload
        })
      };
    default:
      return state;
  }
}

import {Component, ViewChild} from '@angular/core';
import {Ingredient} from "../../shared/ingredient.model";
import {ShoppingListService} from "../shopping-list.service";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent {

  @ViewChild('f') ingredientForm: NgForm;

  constructor(private shoppingListService: ShoppingListService) {
  }

  onAddIngredient() {
    this.shoppingListService.addIngredient(
      new Ingredient(
        this.ingredientForm.value.name,
        this.ingredientForm.value.amount
      )
    );

    this.ingredientForm.reset();
  }
}

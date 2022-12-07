import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Ingredient} from "../../shared/ingredient.model";
import {ShoppingListService} from "../shopping-list.service";
import {NgForm} from "@angular/forms";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  editMode = false;
  editSubscription: Subscription;
  editedIngredientIndex: number;
  editedIngredient: Ingredient;

  @ViewChild('f') ingredientForm: NgForm;

  constructor(private shoppingListService: ShoppingListService) {
  }

  ngOnInit(): void {
    this.editSubscription = this.shoppingListService.startedEditing.subscribe(
      (index: number) => {
        this.editMode = true;
        this.editedIngredientIndex = index;
        this.editedIngredient = this.shoppingListService.getIngredient(index);

        this.ingredientForm.setValue({
          'name': this.editedIngredient.name,
          'amount': this.editedIngredient.amount,
        })
      }
    )
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

  ngOnDestroy(): void {
    this.editSubscription.unsubscribe();
  }
}

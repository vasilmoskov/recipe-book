import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Ingredient} from "../../shared/ingredient.model";
import {ShoppingListService} from "../shopping-list.service";
import {NgForm} from "@angular/forms";
import {Subscription} from "rxjs";
import {Store} from "@ngrx/store";
import * as ShoppingListActions from "../store/shopping-list.actions";

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

  constructor(private shoppingListService: ShoppingListService,
              private store: Store<{ shoppingList: { ingredients: Ingredient[] } }>) {
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

  onSubmit() {
    let name = this.ingredientForm.value.name;
    let amount = this.ingredientForm.value.amount;
    let ingredient = new Ingredient(name, amount);

    if (this.editMode) {
      this.shoppingListService.editIngredient(this.editedIngredientIndex, ingredient);
      console.log(this.editedIngredientIndex);
    } else {
      // this.shoppingListService.addIngredient(ingredient);
      this.store.dispatch(new ShoppingListActions.AddIngredient(ingredient));
    }

    this.editMode = false;
    this.ingredientForm.reset();
  }

  onClear() {
    this.editMode = false;
    this.ingredientForm.reset();
  }

  ngOnDestroy(): void {
    this.editSubscription.unsubscribe();
  }

  onDelete() {
    this.shoppingListService.deleteIngredient(this.editedIngredientIndex);
  }
}

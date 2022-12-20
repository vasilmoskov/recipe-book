import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Ingredient} from "../../shared/ingredient.model";
import {NgForm} from "@angular/forms";
import {Subscription} from "rxjs";
import {Store} from "@ngrx/store";
import * as ShoppingListActions from "../store/shopping-list.actions";
import * as fromApp from "../../store/app.reducer";

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  editMode = false;
  editSubscription: Subscription;
  editedIngredient: Ingredient;

  @ViewChild('f') ingredientForm: NgForm;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit(): void {
    this.editSubscription = this.store.select('shoppingList').subscribe((state) => {
      if (state.editedIngredientIndex !== -1) {
        this.editMode = true;
        this.editedIngredient = state.editedIngredient;

        this.ingredientForm.setValue({
          'name': this.editedIngredient.name,
          'amount': this.editedIngredient.amount,
        });
      } else {
        this.editMode = false;
      }
    })
  }

  onSubmit() {
    let name = this.ingredientForm.value.name;
    let amount = this.ingredientForm.value.amount;
    let ingredient = new Ingredient(name, amount);

    if (this.editMode) {
      this.store.dispatch(new ShoppingListActions.EditIngredient(ingredient)
      );
    } else {
      this.store.dispatch(new ShoppingListActions.AddIngredient(ingredient));
    }

    this.editMode = false;
    this.ingredientForm.reset();
  }

  onClear() {
    this.editMode = false;
    this.ingredientForm.reset();
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

  ngOnDestroy(): void {
    this.editSubscription.unsubscribe();
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

  onDelete() {
    this.store.dispatch(new ShoppingListActions.DeleteIngredient());
    this.onClear();
  }
}

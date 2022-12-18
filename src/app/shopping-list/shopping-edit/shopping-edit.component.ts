import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Ingredient} from "../../shared/ingredient.model";
import {ShoppingListService} from "../shopping-list.service";
import {NgForm} from "@angular/forms";
import {Subscription} from "rxjs";
import {Store} from "@ngrx/store";
import * as ShoppingListActions from "../store/shopping-list.actions";
import * as fromShoppingList from "../store/shopping-list.reducer";

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
              private store: Store<fromShoppingList.AppState>) {
  }

  ngOnInit(): void {
    this.editSubscription = this.store.select('shoppingList').subscribe((state) => {
      if (state.editedIngredientIndex !== -1) {
        this.editMode = true;
        this.editedIngredient = state.editedIngredient;
        this.editedIngredientIndex = state.editedIngredientIndex;

        this.ingredientForm.setValue({
          'name': this.editedIngredient.name,
          'amount': this.editedIngredient.amount,
        });
      } else {
        this.editMode = false;
      }
    })

    // this.editSubscription = this.shoppingListService.startedEditing.subscribe(
    //   (index: number) => {
    //     this.editMode = true;
    //     this.editedIngredientIndex = index;
    //     this.editedIngredient = this.shoppingListService.getIngredient(index);
    //
    //     this.ingredientForm.setValue({
    //       'name': this.editedIngredient.name,
    //       'amount': this.editedIngredient.amount,
    //     })
    //   }
    // )
  }

  onSubmit() {
    let name = this.ingredientForm.value.name;
    let amount = this.ingredientForm.value.amount;
    let ingredient = new Ingredient(name, amount);

    if (this.editMode) {
      // this.shoppingListService.editIngredient(this.editedIngredientIndex, ingredient);
      this.store.dispatch(new ShoppingListActions.EditIngredient({
          index: this.editedIngredientIndex,
          ingredient
        })
      );
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
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

  ngOnDestroy(): void {
    this.editSubscription.unsubscribe();
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

  onDelete() {
    // this.shoppingListService.deleteIngredient(this.editedIngredientIndex);
    this.store.dispatch(new ShoppingListActions.DeleteIngredient(this.editedIngredientIndex));
    this.onClear();
  }
}

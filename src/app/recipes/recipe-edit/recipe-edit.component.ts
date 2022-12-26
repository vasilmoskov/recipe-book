import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from "@angular/router";
import {
  FormArray,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import { RecipeService } from "../recipe.service";
import { Store } from '@ngrx/store';
import * as fromApp from "../../store/app.reducer";
import { map } from 'rxjs';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode = false;

  recipeForm: FormGroup;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private store: Store<fromApp.AppState>) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.editMode = params['id'] != null;
      this.initForm();
    });
  }

  private initForm() {
    let name = '';
    let imageUrl = '';
    let description = '';
    let ingredients = [];

    if (this.editMode) {
      this.store.select('recipe')
        .pipe(
          map(recipesState => {
            return recipesState.recipes.find((recipe, index) => {
              return index === this.id
            })
          })
        )
        .subscribe(recipe => {
          name = recipe.name;
          imageUrl = recipe.imageUrl;
          description = recipe.description;
          recipe.ingredients.forEach(i => ingredients.push(
            new FormGroup({
              'name': new FormControl(i.name, Validators.required),
              'amount': new FormControl(i.amount,
                [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)]),
            })
          ));
        })
    }

    this.recipeForm = new FormGroup({
      'name': new FormControl(name, Validators.required),
      'imageUrl': new FormControl(imageUrl, Validators.required),
      'description': new FormControl(description, Validators.required),
      'ingredients': new FormArray(ingredients)
    });
  }

  getIngredientControls() {
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  onSubmit() {
    if (this.editMode) {
      this.recipeService.updateRecipe(this.id, this.recipeForm.value);
    } else {
      this.recipeService.addRecipe(this.recipeForm.value)
    }

    this.recipeForm.reset();
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(new FormGroup({
      'name': new FormControl(null, Validators.required),
      'amount': new FormControl(null,
        [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)]),
    }));
  }

  onRemoveIngredient(index: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }
}

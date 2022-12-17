import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {RecipeService} from "../recipe.service";

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode = false;

  recipeForm: UntypedFormGroup;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private recipeService: RecipeService) {
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
      let recipe = this.recipeService.getRecipe(this.id);

      name = recipe.name;
      imageUrl = recipe.imageUrl;
      description = recipe.description;
      recipe.ingredients.forEach(i => ingredients.push(
        new UntypedFormGroup({
          'name': new UntypedFormControl(i.name, Validators.required),
          'amount': new UntypedFormControl(i.amount,
            [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)]),
        })
      ));
    }

    this.recipeForm = new UntypedFormGroup({
      'name': new UntypedFormControl(name, Validators.required),
      'imageUrl': new UntypedFormControl(imageUrl, Validators.required),
      'description': new UntypedFormControl(description, Validators.required),
      'ingredients': new UntypedFormArray(ingredients)
    });
  }

  getIngredientControls() {
    return (<UntypedFormArray> this.recipeForm.get('ingredients')).controls;
  }

  onSubmit() {
    if (this.editMode) {
      this.recipeService.updateRecipe(this.id, this.recipeForm.value);
    } else {
      this.recipeService.addRecipe(this.recipeForm.value)
    }

    this.recipeForm.reset();
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  onAddIngredient() {
    (<UntypedFormArray> this.recipeForm.get('ingredients')).push(new UntypedFormGroup({
      'name': new UntypedFormControl(null, Validators.required),
      'amount': new UntypedFormControl(null,
        [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)]),
    }));
  }

  onRemoveIngredient(index: number) {
    (<UntypedFormArray> this.recipeForm.get('ingredients')).removeAt(index);
  }
}

import {NgModule} from "@angular/core";
import {RecipeListComponent} from "./recipe-list/recipe-list.component";
import {RecipeItemComponent} from "./recipe-list/recipe-item/recipe-item.component";
import {RecipeDetailsComponent} from "./recipe-details/recipe-details.component";
import {RecipesComponent} from "./recipes.component";
import {RecipeStartComponent} from "./recipe-start/recipe-start.component";
import {RecipeEditComponent} from "./recipe-edit/recipe-edit.component";
import {CommonModule} from "@angular/common";
import {AppRoutingModule} from "../app-routing.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    RecipeListComponent,
    RecipeItemComponent,
    RecipeDetailsComponent,
    RecipesComponent,
    RecipeStartComponent,
    RecipeEditComponent,
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  exports: [
    RecipeListComponent,
    RecipeItemComponent,
    RecipeDetailsComponent,
    RecipesComponent,
    RecipeStartComponent,
    RecipeEditComponent,
  ]
})
export class RecipesModule {

}

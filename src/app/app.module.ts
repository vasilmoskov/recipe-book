import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { RecipeListComponent } from './recipes/recipe-list/recipe-list.component';
import {RecipeItemComponent} from "./recipes/recipe-list/recipe-item/recipe-item.component";
import { RecipeDetailsComponent } from './recipes/recipe-details/recipe-details.component';
import {HeaderComponent} from "./header/header.component";
import { RecipesComponent } from './recipes/recipes.component';
import { ShoppingEditComponent } from './shopping-list/shopping-edit/shopping-edit.component';
import {ShoppingListComponent} from "./shopping-list/shopping-list.component";
import {DropdownDirective} from "./shared/dropdown.directive";
import {ShoppingListService} from "./shopping-list/shopping-list.service";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    RecipeListComponent,
    RecipeItemComponent,
    RecipeDetailsComponent,
    ShoppingListComponent,
    RecipesComponent,
    ShoppingEditComponent,
    DropdownDirective
  ],
  imports: [
    BrowserModule
  ],
  providers: [ShoppingListService],
  bootstrap: [AppComponent]
})
export class AppModule { }

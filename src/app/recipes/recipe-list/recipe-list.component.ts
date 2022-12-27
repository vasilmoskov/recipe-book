import {Component, OnInit} from '@angular/core';
import {Recipe} from "../recipe.model";
import {ActivatedRoute, Router} from "@angular/router";
import {map} from "rxjs";
import * as fromApp from "../../store/app.reducer";
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private store: Store<fromApp.AppState>) {
  }

  ngOnInit(): void {
    this.store.select('recipe')
      .pipe(map(recipeState => recipeState.recipes))
      .subscribe(recipes => this.recipes = recipes);
  }

  onNewRecipe() {
    this.router.navigate(['new'], {relativeTo: this.route})
  }
}

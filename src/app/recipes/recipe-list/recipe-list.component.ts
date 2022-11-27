import {Component, OnInit} from '@angular/core';
import {Recipe} from "../recipe.model";

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [
    new Recipe('Mousaka', 'Bulgarian one', 'https://m.1001recepti.com/images/photos/recipes/size_5/musaka-s-kaima-i-zalivka-3-[1369].jpg'),
    new Recipe('Tarator', 'With fresh cucumber', 'https://www.forlife.bg/wp-content/uploads/2022/02/tarator.jpg')
  ];

  constructor() {
  }

  ngOnInit(): void {
  }

}

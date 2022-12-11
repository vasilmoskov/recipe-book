import {Component, EventEmitter, Output} from "@angular/core";
import {DataStorageService} from "../shared/data-storage.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html"
})
export class HeaderComponent {

  constructor(private dataStorageSerice: DataStorageService) {
  }

  onSaveData() {
    this.dataStorageSerice.storeRecipes();
  }

  onFetchData() {
    this.dataStorageSerice.fetchRecipes();
  }
}

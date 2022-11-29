import {Component, EventEmitter, Output} from "@angular/core";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html"
})
export class HeaderComponent {

  @Output()
  navigation = new EventEmitter<string>();

  onSelectNavigation(navigation: string) {
    this.navigation.emit(navigation);
  }
}

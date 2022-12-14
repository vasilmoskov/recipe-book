import {Component, EventEmitter, OnDestroy, OnInit, Output} from "@angular/core";
import {DataStorageService} from "../shared/data-storage.service";
import {Subscription} from "rxjs";
import {AuthService} from "../auth/auth.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html"
})
export class HeaderComponent implements OnInit, OnDestroy {
  userSub: Subscription;
  isAuthenticated = false;

  constructor(private dataStorageSerice: DataStorageService, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(user => this.isAuthenticated = !!user);
  }

  onSaveData() {
    this.dataStorageSerice.storeRecipes();
  }

  onFetchData() {
    this.dataStorageSerice.fetchRecipes().subscribe();
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}

import {Component} from "@angular/core";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent {
  inLoginMode = true;

  onSwitchMode() {
    this.inLoginMode = !this.inLoginMode;
  }
}

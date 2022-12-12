import {Component} from "@angular/core";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent {
  inLoginMode = true;

  onSwitchMode() {
    this.inLoginMode = !this.inLoginMode;
  }

  onSubmit(f: NgForm) {
    console.log(f.value);
    f.reset();
  }
}

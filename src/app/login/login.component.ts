import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {UserService} from '../user.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService]
})
export class LoginComponent {
  public error:any;

login(email,password) {
  this.userService.login(email, password).then((data)=> {

    this.router.navigate(['user/' + data.uid]);
  })
  .catch((error:any)=> {
    if (error) {
      this.error = error;
    }
  });
}

loginGoogleButton() {
  return this.userService.loginGoogle().then((data) => {
    this.router.navigate(['user/' + data.uid]);
  })
}

  constructor(private userService:UserService, private router:Router) { }

}

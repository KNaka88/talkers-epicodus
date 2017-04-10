import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {UserService} from '../user.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  public error:any;

login(email,password) {
  this.userService.login(email, password).then((data)=> {
    this.router.navigate(['user/1']);
  })
  .catch((error:any)=> {
    if (error) {
      this.error = error;
    }
  });
}

  constructor(private userService:UserService, private router:Router) { }

}

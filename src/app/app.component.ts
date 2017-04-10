import { Component } from '@angular/core';
import { UserService } from './user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService]
})
export class AppComponent {
  public isLoggedIn: boolean;

  constructor(
    private userService:UserService,
    private router: Router,
  ){
    this.userService.af.auth.subscribe(
      (auth) => {
        if (auth === null) {
          this.isLoggedIn = false;
          this.router.navigate([""]);
        } else {
          if(auth.google) {
            this.userService.displayName = auth.google.displayName;
            this.userService.email = auth.google.email;
          } else {
            this.userService.displayName = userService.getUserName(auth.uid).subscribe(
              (userObject) => {
                this.userService.displayName = userObject.displayName;
              });
              this.userService.email = auth.auth.email;
              this.isLoggedIn = true;
              this.router.navigate(['user/' + auth.uid]);
            }
          }
        }
      );
    }


  logout() {
    this.userService.logout();
    console.log("componenet")
  }
}

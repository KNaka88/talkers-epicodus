import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { User } from '../user.model';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  public error: any;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
  }


  registerUserButton(name, email, password){
    let lat: number = 45.5206223;
    let lng: number = -122.6795871;
    let timestamp: string = '';
    let messageKey: Array<any>;

    this.userService.registerUser(email, password).then( (user) => {
      let newUser = new User (name, email, lat, lng, timestamp, messageKey);
      this.userService.saveUserInfoFromForm(user.uid, newUser).then(() => {
        this.router.navigate(['user/' + user.uid]);
      })
      // when register user method failed, catch error
      .catch((error) => {
        this.error = error;
      });
    })
    // when register method failed, catch error
    .catch((error) => {
        this.error = error;
    });
  }

}

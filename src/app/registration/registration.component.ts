import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../user.model';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
  providers: [UserService]
})
export class RegistrationComponent implements OnInit {
  public error: any;
  public icon = '1';

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
  }


  registerUserButton(name, email, password, iconNumber){
    let lat: number = 45.5206223;
    let lng: number = -122.6795871;
    let timestamp: string = '';
    let messageKey: Array<any>;
    let icon:string ="../assets/img/icon" + iconNumber + '.png';

    this.userService.registerUser(email, password).then( (user) => {
      let newUser = new User (name, email, lat, lng, timestamp, icon);
      this.userService.saveUserInfoFromForm(user.uid, newUser).then(() => {
        this.router.navigate(['user/' + user.uid]);
      })
      // when register user method failed, catch error
      .catch((error) => {
        this.error = error;
        alert(error.message);
      });
    })
    // when register method failed, catch error
    .catch((error) => {
        this.error = error;
        alert(error.message);
        console.log(error)
    });
  }
  iconPreview(e) {
    console.log(e);
    this.icon = e;
  }
  setPreview(){
    return 'assets/img/icon' + this.icon + '.png';
  }

}

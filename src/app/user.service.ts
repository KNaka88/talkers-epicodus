import { Injectable } from '@angular/core';
import {AngularFire, AuthProviders, AuthMethods, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2';


@Injectable()
export class UserService {
  // email:string;
  // password:string;

  constructor(private af:AngularFire) { }

  login(email,password) {
    return this.af.auth.login(
      {
        email: email,
        password:password,
      },
      {
        provider: AuthProviders.Password,
        method: AuthMethods.Password
      });
  }

}

import { Injectable } from '@angular/core';
import {AngularFire, AuthProviders, AuthMethods, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2';
import { User } from './user.model';


@Injectable()
export class UserService {
  user: FirebaseObjectObservable<any>

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

  loginGoogle(){
    return this.af.auth.login(
      {
        provider: AuthProviders.Google,
        method: AuthMethods.Popup
      }
    )
  }


  registerUser(email, password){
    return this.af.auth.createUser({
      email: email,
      password: password,
    });
  }

  saveUserInfoFromForm(uid: string, newUser: User) {
    return this.af.database.object('registeredUsers/' + uid).set({
      displayName: newUser.name,
      email: newUser.email,
      lat: newUser.lat,
      lng: newUser.lng
    });
  }

  getUserById(uid: string) {
    return this.af.database.object("registeredUsers/" + uid);
  }

  updateUserInfo(lat, lng, uid){
    this.af.database.object("registeredUsers/" + uid).update({
      lat: lat,
      lng: lng,
      timestamp: Date.now()
    });
  }
}

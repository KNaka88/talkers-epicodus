import { Injectable } from '@angular/core';
import {AngularFire, AuthProviders, AuthMethods, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2';
import { User } from './user.model';


@Injectable()
export class UserService {
  users:FirebaseListObservable<any[]>;
  public displayName:any;
  public email:any;
  public messages: FirebaseListObservable<any>

  constructor(public af:AngularFire) {
    this.users = af.database.list('registeredUsers');
    this.messages = af.database.list('messages');
   }

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
      lng: newUser.lng,
      icon: newUser.icon
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

  getAllUsers() {
    return this.users;
  }

  logout(){
    return this.af.auth.logout();
  }

  getUserName(uid: string){
     return this.af.database.object('registeredUsers/' + uid);
  }

  sendMessage(newMessage, friendUid, uid){
    //create a message
    let message = {
        from: uid,
        to: friendUid,
        message: newMessage,
        timestamp: Date.now(),
    };

    this.messages.push(message).then( (data) =>{
      //get $key of the message
      let messageKey = data.path.o[1];

      //push to the each registeredUsers' data as a list
      this.af.database.list('registeredUsers/' + friendUid + '/messages').push(messageKey);
      this.af.database.list('registeredUsers/' + uid + '/messages').push(messageKey);
    });



  }
}

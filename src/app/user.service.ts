import { Injectable } from '@angular/core';
import {AngularFire, AuthProviders, AuthMethods, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2';
import { User } from './user.model';


@Injectable()
export class UserService {
  users: FirebaseListObservable<any[]>;
  public displayName: any;
  public email: any;
  public fbListFriends: FirebaseListObservable<any[]>;
  public pendingFriends: any[];

  constructor(public af: AngularFire) {
    this.users = af.database.list('registeredUsers');
  }

  login(email, password) {
    return this.af.auth.login(
      {
        email: email,
        password: password,
      },
      {
        provider: AuthProviders.Password,
        method: AuthMethods.Password
      });
  }

  loginGoogle() {
    return this.af.auth.login(
      {
        provider: AuthProviders.Google,
        method: AuthMethods.Popup
      }
    );
  }


  registerUser(email, password) {
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

  updateUserInfo(lat, lng, uid) {
    this.af.database.object("registeredUsers/" + uid).update({
      lat: lat,
      lng: lng,
      timestamp: Date.now()
    });
  }

  getAllUsers() {
    return this.users;
  }

  logout() {
    return this.af.auth.logout();
  }

  getUserName(uid: string) {
    return this.af.database.object('registeredUsers/' + uid);
  }

  getFriends(uid) {
    this.fbListFriends = this.af.database.list('registeredUsers/' + uid + "/friends");
    console.log(this.fbListFriends);
    return this.fbListFriends;
  }

  sendFriendRequest(userUid, friendUid) {
    let pushObj = {
      friend1Id: userUid,
      friend2Id: friendUid
    };
    let fbFriends = this.af.database.list('friends');
    fbFriends.push(pushObj).then((pushObj) => {
      console.log("this is the push id key: " +pushObj.key);
      let userFriendsList = this.af.database.list('registeredUsers/' + userUid + "/friends");
      userFriendsList.push({key: pushObj.key});
    });






    // this.pendingFriends.push(fbFriends);
    // fbFriends.push({
    //   friend1Id: userUid,
    //   friend2Id: friendUid
    // });

    //   acceptFriendRequest(friendId, Uid)
    //   let userFriendsList = this.af.database.list('registeredUsers' + userUid + "/friends");
    //   let friendsFriendsList = this.af.database.list('registeredUsers' + friendUid + "/friends");

    //   friendsFriendsList.push(friendEntry.$key);
  }
}

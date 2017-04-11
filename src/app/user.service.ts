import { Injectable } from '@angular/core';
import {AngularFire, AuthProviders, AuthMethods, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2';
import { User } from './user.model';


@Injectable()
export class UserService {
  users:FirebaseListObservable<any[]>;
  public displayName:any;
  public email:any;
  public messages: FirebaseListObservable<any>;
  public friendsListOfUser: any;
  public friendsListOfFriend: any;
  public fbListFriends: FirebaseListObservable<any[]>;
  public pendingFriends: any[];

  constructor(public af: AngularFire) {
    this.users = af.database.list('registeredUsers');
    this.messages = af.database.list('messages');
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
      // console.log("this is the push id key: " +pushObj.key);
      let userFriendsList = this.af.database.list('registeredUsers/' + userUid + "/friends");
      userFriendsList.push({key: pushObj.key});
    });
  }

  sendMessage(newMessage, friendName, userName, friendsUid){
    //create a message
    let message = {
        from: userName,
        to: friendName,
        message: newMessage,
        timestamp: Date.now(),
    };

    this.messages.push(message).then( (data) =>{
      //get $key of the message
      let messageKey = data.path.o[1];
      //push to the friends table data as a list
      this.af.database.list('friends/' + friendsUid + '/').push(messageKey);
    });
  }

  getUserFriendsUid(userUid){
    //get friendsUid list of user
    return this.af.database.list('registeredUsers/' + userUid + '/friends');
    }

  getFriendFriendsUid(friendUid){
    //get friendsUid list of friend
    return this.af.database.list('registeredUsers/' + friendUid + '/friends');
  }

  checkIfMutualFriends(userLists, friendsList){
    for(let i = 0; i < userLists.length; i++){
      for(let j = 0; j <friendsList.length; j++ ){
        if(userLists[i].key === friendsList[j].key){
          return userLists[i].key;
        }
      }
      // console.log("Check:" + userLists[i].key);
      // if(friendsList.includes(userLists[i].key)){
      //   console.log("Matched:" + userLists[i]);
      //   return this.af.database.list('friends/' + userLists[i]);
      // }
    }
    return "no matching";
  }

  getFriendsTableById(userFriendsList){

    let friendsTableList = [];
      for(let i=0; i<userFriendsList.length; i++){
        this.af.database.list('friends/' + userFriendsList[i].key).subscribe( (data)=> {
        let fireData = data;
        friendsTableList.push(fireData);
        });
      }
     return friendsTableList;
  }
}

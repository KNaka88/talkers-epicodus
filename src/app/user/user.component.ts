import { Component, OnInit, ElementRef } from '@angular/core';
import { SebmGoogleMap, SebmGoogleMapMarker, SebmGoogleMapInfoWindow } from
'angular2-google-maps/core';
import { User } from '../user.model';
import { FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { UserService } from '../user.service';
import { ActivatedRoute, Params } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  providers: [UserService]
})
export class UserComponent implements OnInit {
  // preset location and icon
  public uid: string;
  public lat: number = 45.5206726;
  public lng: number = -122.67779689999999;
  public userFbObj: FirebaseObjectObservable<any>;
  public timestamp: any;
  public currentUser: User;
  public userName: string;
  public friendsUid: string;
  users: FirebaseListObservable<any[]>;
  usersFriends: FirebaseListObservable<any[]>;
  public infoWindow: boolean = false;
  public userFriendsList: any;
  public friendFriendsList: any;
  public allFriends: any[];
  public friend:FirebaseObjectObservable<any>;
  public status: boolean = false;
  public friendRequestStatus: any;
  public friendsTableFirebase: FirebaseListObservable<any>;
  public friend1Id: any;
  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((location) => {
          this.setLatLng(location.coords.latitude, location.coords.longitude);
      });
    }
    this.route.params.forEach((urlParameters) => {
      this.uid = urlParameters['id'];
    });

    this.userFbObj = this.userService.getUserById(this.uid);
    this.users = this.userService.getAllUsers();
    this.usersFriends = this.userService.getFriends(this.uid);
  }

  setLatLng(lat: number, lng: number) {
    this.lat = lat;
    this.lng = lng;
    this.userService.updateUserInfo(this.lat, this.lng, this.uid);
  }

  showInfoWindow(){
    this.infoWindow = true;

  }


  addFriend(friendUid) {
    this.userService.sendFriendRequest(this.uid, friendUid);
    this.getAllFriendsById();

  }

  sendMessage(newMessage, friend){

    this.getMutualFriendId(friend);

    // 2. get friendName and userName
    let friendName = friend.displayName;

    this.userService.getUserById(this.uid).subscribe( (user) => {
      this.userName = user.displayName;
    });

    // 3. call userService sendNessage function, passing variables
    if(this.friendsUid !== "noMatching"){
      this.userService.sendMessage(newMessage, friendName, this.userName, this.friendsUid);
    }
  }

  getAllFriendsById(){
    this.userService.getUserFriendsUid(this.uid).subscribe( (userFriendsListData) => {
      this.userFriendsList = userFriendsListData;
      this.allFriends = this.userService.getFriendsTableById(this.userFriendsList);
    });
  }

  // hideInfoWindow(){
  //   this.infoWindow = false;
  // }

  sendFriendData(user){
    this.friend = user;
    this.friendRequestStatus = "";
    this.getMutualFriendId(user);
    this.userService.getFriendRequestStatus(this.friendsUid).subscribe((result)=>{
        if(result.length !== 0 ){ //avoid error when no friend request is sent yet (empty)
          result.forEach((object)=> {
            if(object.$key === "friend1Id"){
              this.friend1Id = object.$value;
            }else if (object.$key === "status"){
              this.status = object.$value;
            }
          });
          if(this.uid === this.friend1Id){
            //this person sent friend request
            this.friendRequestStatus = "YouSent";
          }else{
            //friend sent friend request
            this.friendRequestStatus = "FriendSent";
          }
        }
    });

    this.friendsTableFirebase = this.userService.getFriendRequestStatus(this.friendsUid);

  }

  confirmFriendRequest(user){
    this.getMutualFriendId(user);
    this.userService.confirmFriendRequest(this.friendsUid);

  }


  getMutualFriendId(friend){
    // 1. get FriendsUid that matches
    this.friendsUid =  "";

    //get user friends list
    this.userService.getUserFriendsUid(this.uid).subscribe( (userFriendsListData) => {
      this.userFriendsList = userFriendsListData;
    });

    // get friend's friend list
    this.userService.getFriendFriendsUid(friend.$key).subscribe( (friendFriendsListData) => {
      this.friendFriendsList = friendFriendsListData;
    });
    this.friendsUid = this.userService.checkIfMutualFriends(this.userFriendsList, this.friendFriendsList);
  }

  logoutButtonClicked() {
    this.userService.logout();
  }


}

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

  public infoWindow: boolean = false;

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
  }

  setLatLng(lat: number, lng: number) {
    this.lat = lat;
    this.lng = lng;
    this.userService.updateUserInfo(this.lat, this.lng, this.uid);
  }

  showInfoWindow(){
    this.infoWindow = true;
    console.log(this.infoWindow);
  }


  sendMessage(newMessage, friend){
    // 1. get FriendsUid that matches
    this.friendsUid =  "";

    // this.userService.getFriendsUid(this.uid, friend.$key).subscribe( (data) => {
    //   this.friendsUid = data.$key
    // });
    this.userService.getUserFriendsUid(this.uid)

    this.userService.getFriendFriendsUid(friend.$key);

    // 2. get friendName and userName
    let friendName = friend.displayName;

    this.userService.getUserById(this.uid).subscribe( (user) => {
      this.userName = user.displayName;
    });

    // 3. call userService sendNessage function, passing variables
    // this.userService.sendMessage(newMessage, friendName, this.userName, this.friendsUid);
  }

  // hideInfoWindow(){
  //   this.infoWindow = false;
  // }
}

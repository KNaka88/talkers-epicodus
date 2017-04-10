import { Component, OnInit, ElementRef } from '@angular/core';
import { SebmGoogleMap, SebmGoogleMapMarker, SebmGoogleMapInfoWindow } from
'angular2-google-maps/core';
import { User } from '../user.model';
import { FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { UserService } from '../user.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  providers: [UserService]
})
export class UserComponent implements OnInit {
  // preset location and icon
  public uid: string;
  public lat: number = 45.5206223;
  public lng: number = -122.6795871;
  public userFbObj: FirebaseObjectObservable<any>;
  public currentUser: User;

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

    this.userService.getUserById(this.uid).subscribe( (userFbObj) => {
      this.currentUser = new User(
        userFbObj.displayName,
        userFbObj.email,
        this.lat,
        this.lng,
        Date.now()
      );
      console.log(this.currentUser);
    });

  }

  setLatLng (lat: number, lng: number) {
  this.lat = lat;
  this.lng = lng;
  }



}

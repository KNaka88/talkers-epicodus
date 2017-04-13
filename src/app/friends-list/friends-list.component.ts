import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../user.model';
import { FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

@Component({
  selector: 'app-friends-list',
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.css'],
  providers:[UserService]
})
export class FriendsListComponent implements OnInit {
  // @Input()friendsList;
  @Input()uid;


  allUsers:FirebaseListObservable<any[]>;
  friends:any[];
  friendsId:FirebaseListObservable<any>;
  results: any[];


    ngOnInit(){
      this.getFriendsId();
    }

    constructor(private userService: UserService) { }

    getFriendsId() {
    this.friendsId = this.userService.getUserFriendsUid(this.uid);
      this.getFriendsListById(this.friendsId);
    }

    getFriendsListById(friendsId) {
      friendsId.subscribe((data)=>{
        let pushkey:any = [];
        for (let i = 0; i < data.length; i++) {
          pushkey.push(data[i].Pushkey);
        }
         this.userService.getFriendsListById(pushkey, this.uid);
      });
    }

    getFriendsList() {
      this.getFriendsListById(this.friendsId);
    }
}

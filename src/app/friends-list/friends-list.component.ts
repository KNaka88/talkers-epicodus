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
  idArray:any[];


    ngOnInit(){
      this.idArray = [] ;
      this.getFriendsId();
      this.allUsers = this.userService.getAllUsers();
      this.allUsers.subscribe((data)=> {
        for(var i=0; i<data.length; i++){
          let key = data[i].$key;
          this.idArray.push(key);
        }
        return this.idArray
      });
    }

    constructor(private userService: UserService) { }

    getFriendsId() {
    this.friendsId = this.userService.getUserFriendsUid(this.uid);
      this.getFriendsListById(this.friendsId);
    }

    getFriendsListById(friendsId) {
      let friendsListOfIds = [];
      let friendObjectArray = [];
      friendsId.subscribe((data)=>{
        let pushkey:any = [];
        for (let i = 0; i < data.length; i++) {
          pushkey.push(data[i].Pushkey);
        }
         let friendsPushkeyList = this.userService.getFriendsListById(pushkey);
         friendsPushkeyList.forEach(elem => {
           elem.subscribe(res=> {
             if(res[0].$value === this.uid && res[3].$value === "true") {
               friendsListOfIds.push(res[1].$value);
             }else {
               friendsListOfIds.push(res[0].$value);
             }
             friendsListOfIds.forEach( (elem)=> {
             });
           });
         });
       });
            for(var i = 0; i<friendsListOfIds.length; i++) {
              for(var i = 0; i<this.idArray.length; i++){
                console.log(this.idArray[i]);
                  if(this.idArray[i] === friendsListOfIds[i]){
                    console.log("it workd!!")
                  }
                }
              }
            }

    getFriendsList() {
      this.getFriendsListById(this.friendsId);
    }
}

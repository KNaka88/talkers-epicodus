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
  @Input()friendsList;
  @Input()uid;

  constructor(private userService: UserService) { }
  friends:FirebaseListObservable<any[]>;

  ngOnInit() {
    this.friends = this.userService.getFriends(this.uid);
    console.log('this.friends')
    console.log(this.friends)
    console.log('this.friends')
  }

}

import { Component, Input, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { User } from '../user.model';
import { UserService } from '../user.service';
import {FirebaseListObservable, FirebaseObjectObservable} from "angularfire2";

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
  providers: [UserService]
})
export class MessageComponent implements AfterViewChecked {
  @Input() friend: any;
  @Input() friendsUid: string;
  @Input() userFbObj: FirebaseObjectObservable<any>;
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  public newMessage: string;
  public messages:FirebaseListObservable<any>;


  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    }catch(err) {console.log("scroll to bottom failed")}
  }


  constructor(private userService: UserService) { }

  isYou(email) {
    if(email === this.userService.email) {
      return true;
    } else {
      return false;
    }
  }

  isMe(email) {
    if(email === this.userService.email) {
      return false;
    } else {
      return true;
    }
  }

  sendMessage(){

    let userName = "";
    this.userFbObj.subscribe((user) => {
      console.log(user);
      userName = user.displayName;
    })

    console.log(this.newMessage);
    console.log(this.friend.displayName);
    console.log(this.userFbObj);
    this.userService.sendMessage(this.newMessage, this.friend.displayName, userName, this.friendsUid);
    this.newMessage="";
  }

  // getMessagesById(){
  //   this.messages = this.userService.getMessagesById(this.friendsUid);
  // }
}

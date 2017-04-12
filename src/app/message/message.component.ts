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
  @Input() friend: FirebaseObjectObservable<any>;

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;


  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    }catch(err) {console.log("scroll to bottom failed")}
  }

  public newMessage:string;
  public messages:FirebaseListObservable<any>

  constructor(private userService:UserService) { }

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
  sendMessage(userName, friendUid, message){
    this.userService.sendMessage(this.newMessage, this.friend, userName, friendUid);
    this.newMessage="";
  }



}

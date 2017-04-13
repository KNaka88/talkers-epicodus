import { Component, Input, AfterViewChecked, ElementRef, ViewChild, OnInit} from '@angular/core';
import { User } from '../user.model';
import { UserService } from '../user.service';
import {FirebaseListObservable, FirebaseObjectObservable} from "angularfire2";

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
  providers: [UserService]
})
export class MessageComponent implements OnInit, AfterViewChecked {
  @Input() friend: any;
  @Input() friendsUid: string;
  @Input() userFbObj: FirebaseObjectObservable<any>;
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  public newMessage: string;
  public messagesId:FirebaseListObservable<any>;
  public messages:any;
  // public messages:FirebaseListObservable<any[]>;
  public results: any = [];

  ngOnInit(){
    this.getMessagesId();
  }

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
      userName = user.displayName;
    })

    this.userService.sendMessage(this.newMessage, this.friend.displayName, userName, this.friendsUid);
    this.newMessage="";
  }

  getMessagesId(){
    //neeed to grab messages!! not friend firebase data!!!''
    this.messagesId = this.userService.getMessagesId(this.friendsUid);
    this.getMessagesById(this.messagesId);
  }

  getMessagesById(messagesId){

    messagesId.subscribe( (dataLists) => {
      this.messages = this.userService.getMessagesById(dataLists)
      this.messages.forEach(elem=>{
        elem.subscribe(res=>{
          let data = res;
          console.log(data);
          this.results.push(data);
        })
      })
    });
  }

  getMessages(){
    this.getMessagesById(this.messagesId);
  }
}

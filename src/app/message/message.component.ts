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
    console.log("start");

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
    // messagesId.subscribe( (dataLists) => {
    //   this.messages = this.userService.getMessagesById(dataLists);
    //   console.log(this.messages);
    //   console.log("messages ran")
    // });

    messagesId.subscribe( (dataLists) => {
      this.messages = this.userService.getMessagesById(dataLists)
      this.messages.forEach(elem=>{
        elem.subscribe(res=>{
          let data = res;
          this.results.push(data);
          console.log(res);
        })
      })
      // console.log(this.messages);
      console.log("messages ran")
    });

    // console.log(this.messages);

    // this.userService.getMessagesById(messagesId).subscribe( (data)=>{
    //   console.log(data);
    //   this.messages = data;
    // });

    // this.messages = this.userService.getMessagesById(messagesId);
  }

  getMessages(){
    this.getMessagesById(this.messagesId);
  }
}

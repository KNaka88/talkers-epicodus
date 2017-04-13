import { Component, Input, AfterViewChecked, ElementRef, ViewChild,  OnInit} from '@angular/core';
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
  @Input() friendsTableFirebase: FirebaseListObservable<any>;
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  public newMessage: string;
  public messagesId:FirebaseListObservable<any>;
  public messages:any;
  public results: any[];
  public userName:string;
  public userEmail:string;

  ngOnInit(){
    this.userFbObj.subscribe((user) => {
      this.userName = user.displayName;
      this.userEmail = user.email;
    })
  }

  ngOnChanges() {
      this.getMessagesId(this.friendsUid);
  }


  ngAfterViewChecked() {
    // this.scrollToBottom();
  }

  scrollToBottom() {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    }catch(err) {console.log("scroll to bottom failed")}
  }


  constructor(private userService: UserService) { }

  isYou(email) {
    if(email === this.userEmail) {
      return true;
    } else {
      return false;
    }
  }

  isMe(email) {
    if(email === this.userEmail) {
      return false;
    } else {
      return true;
    }
  }

  sendMessage(){
    let userName = "";
    let userEmail = "";
    this.userService.sendMessage(this.newMessage, this.friend.displayName, userName, this.friendsUid, userEmail );
    this.newMessage="";
    this.scrollToBottom();
  }

  getMessagesId(friendsUid){
    this.friendsUid = friendsUid;
    this.userService.getMessagesId(this.friendsUid).subscribe( (messagesId)=>{
        this.getMessagesById(messagesId);
    });
  }

  getMessagesById(messagesId){
      this.messages = this.userService.getMessagesById(messagesId);
      this.results = [];
      if(this.messages.length !== 0){
        this.messages.forEach( (elem)=>{
          elem.subscribe( (res)=>{
            let data = res;
            this.results.push(data);
          });
        });
      } else {
        //if there are no messages
        console.log("else");
      }

  }

  getMessages(){
    this.getMessagesById(this.messagesId);
  }
}

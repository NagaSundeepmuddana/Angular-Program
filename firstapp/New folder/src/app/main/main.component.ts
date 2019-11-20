import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from "../services/auth/authentication.service";
import { MetadataService } from '../services/metadata/metadata.service';
import { Notification } from '../../models/Notification';
import { Role, Permissions, UserPermissions } from '../../models/Role';
import * as $ from 'jquery'; window["$"] = $; window["jQuery"] = $;
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  userProfile: any;
  Notifications: Notification[] = [];
  NotificationCount: number = 0;
  UserPermissionsList: UserPermissions;
  CanViewProject: boolean = false;

  constructor(public auth: AuthenticationService, public metadata: MetadataService) {
    auth.handleAuthentication();
    this.userProfile = this.auth.useProfile;
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));    
    this.GetNotifications();
    this.UserPermissionsList = JSON.parse(localStorage.getItem('rolespermissionslist'));
  }

  GetNotifications() {
    this.metadata.GetNotifications().subscribe(data => {
      console.log(data);
      this.Notifications = data;
      this.NotificationCount = this.Notifications.length;
    },
      err => {
        console.log('Project items Data Fetch Failed..');
      });
  }
  
  // refresh(): void {
  //   this.refresh()
  //   }
  ngOnInit() {
    // if(this.auth.isAuthenticated()){
    //   console.log('Yes User authenticated.. main component oninit');
    //   this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    // }else{
    //   console.log('Yes User not authenticated.. main component oninit');
    //   this.auth.logout();
    // }
  }
}

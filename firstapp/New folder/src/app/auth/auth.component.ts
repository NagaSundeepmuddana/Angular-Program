import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from "../services/auth/authentication.service";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AuthComponent implements OnInit {
  
    constructor(public auth:AuthenticationService) {
      
     }
  
    ngOnInit() {
    }
  
  }
  
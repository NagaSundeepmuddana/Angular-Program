import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as auth0 from 'auth0-js';
import { AUTH0_Config } from "./auth0Setup";
import { UserService } from '../user/user.service';
import { SecurityService } from '../security/security.service';
import { Role, Permissions, UserPermissions } from '../../../models/Role';

@Injectable()
export class AuthenticationService {
  useProfile:any;
  UserPermissionsList: UserPermissions[] = [];
  auth0 = new auth0.WebAuth({
    clientID: AUTH0_Config.ClientID,
    domain: AUTH0_Config.Domain,
    responseType: 'token id_token',
    audience: `https://${AUTH0_Config.Domain}/userinfo`,
    redirectUri: AUTH0_Config.CallBackURL,
    scope: 'openid profile'
  });

  constructor(public router: Router, public usrService:UserService, public secService: SecurityService) { }
  public login(): void {
    console.log(auth0);
    this.auth0.authorize({
      clientID: AUTH0_Config.ClientID,
      domain: AUTH0_Config.Domain,
      responseType: 'token id_token',
      audience: `https://${AUTH0_Config.Domain}/userinfo`,
      redirectUri: AUTH0_Config.CallBackURL,
      scope: 'openid profile'
    });
  }

  public handleAuthentication(): void {
    console.log('Handle Authentication: 1');
    this.auth0.parseHash((err, authResult) => {
      console.log('Handle Authentication: 2');
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        this.setSession(authResult);
        this.auth0.client.userInfo(authResult.accessToken, (err, profile)=>{
          console.log('Handle Authentication: 3');
          console.log(err);
          this.useProfile = profile;
          this.usrService.GetUserInfo(this.useProfile).subscribe(data => {
            if(data)
            {
              profile.given_name = data.given_name;
              profile.family_name = data.family_name;
              localStorage.setItem('userprofile', JSON.stringify(profile));
              //Fetch all the Users Permissions and store in localstorage -- START
              this.secService.GetUserPermissions(this.useProfile).subscribe(data => {
                if(data)
                {
                  localStorage.setItem('rolespermissionslist', JSON.stringify(data));
                  window.location.reload(true);
                }
              }, err => {
                console.log(err);
              });
              //END
            }
          }, err => {
            console.log(err);
          });
        });
        console.log('Handle Authentication: 4');
      } else if (err) {
        this.router.navigate(['/auth']);
        console.log(err);
        alert(`Error: ${err.error}. Check the console for further details.`);
      }
      console.log('Handle Authentication: 5');
    });
    console.log('Handle Authentication: 6');
  }

  private setSession(authResult): void {
    // Set the time that the access token will expire at
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
  }

  public logout(): void {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    // Go back to the home route
    this.router.navigate(['/']);
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // access token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }
}

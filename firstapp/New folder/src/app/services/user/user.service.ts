import { Injectable } from '@angular/core';
import { PrimcomService } from '../utilities/primcom.service';
import { Http } from '@angular/http';
import { User, PITUser, UserRoles,Roles } from '../../../models/User';
import { EndPointsConfig } from '../../../models/endpointsconfig';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UserService {
  PITUserList: PITUser[];
  UsersList: User[];
  constructor(
    private http: Http,
    private pcom: PrimcomService) { }

  //Get Users
  GetUsers():Observable<User[]> {
    // if (this.UsersList && this.UsersList.length > 0) {
    //   return Observable.of(this.UsersList);
    // } else {
      return this.http.get(EndPointsConfig.HostName + EndPointsConfig.Users, this.pcom.getOptions()).map(res => res.json() as User[]);
    //}
  }

  AddUser(user:any):Observable<User>{
    return this.http.post(EndPointsConfig.HostName+EndPointsConfig.Users,this.pcom.generateBody(user),this.pcom.getOptions()).map(res => res.json() as User);
  }
  GetUserInfo(user:any):Observable<User>{
    console.log(user);
    return this.http.get(EndPointsConfig.HostName+EndPointsConfig.Users+'/'+user.sub,this.pcom.getOptions()).map(res => res.json() as User);
  }
  UpdateUser(user:any):Observable<User>{
    console.log(user);
    return this.http.put(EndPointsConfig.HostName+EndPointsConfig.Users+'/'+user.user_id,this.pcom.generateBody(user),this.pcom.getOptions()).map(res => res.json() as User);
  }
  GetUsersEmailSignature(userID):Observable<PITUser> {
      return this.http.get(EndPointsConfig.HostName + EndPointsConfig.UsersEmailSignature+'/' + userID , this.pcom.getOptions()).map(res => res.json() as PITUser);
  }
  UpdateEmailSignature(PITUser:any):Observable<PITUser>{
    return this.http.put(EndPointsConfig.HostName+EndPointsConfig.UsersEmailSignature+'/'+ PITUser.UserID,this.pcom.generateBody(PITUser),this.pcom.getOptions()).map(res => res.json() as PITUser);
  }
  ActiveInactiveUser(userID):Observable<PITUser> {
    return this.http.delete(EndPointsConfig.HostName + EndPointsConfig.Users+'/' + userID , this.pcom.getOptions()).map(res => res.json() as PITUser);
  }
  
  GetUsersRole(UserID):Observable<UserRoles[]> {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.UserRoles +'/'+ UserID, this.pcom.getOptions()).map(res => res.json() as UserRoles[]);
}
GetAvailableUserRoleDropdownList(UserID):Observable<UserRoles[]> {
  return this.http.get(EndPointsConfig.HostName + EndPointsConfig.UserRoles + "?UserID=" + UserID, this.pcom.getOptions()).map(res => res.json() as UserRoles[]);
}
AddRoleToUser(userRoles:any):Observable<UserRoles>{
  return this.http.post(EndPointsConfig.HostName + EndPointsConfig.UserRoles,this.pcom.generateBody(userRoles),this.pcom.getOptions()).map(res => res.json() as UserRoles);
}
DeleteRolesToUser(RoleToUserMappingID):Observable<UserRoles[]> {
  return this.http.delete(EndPointsConfig.HostName + EndPointsConfig.UserRoles  +'/'+ RoleToUserMappingID, this.pcom.getOptions()).map(res => res.json() as UserRoles[]);
}

 GetBusinessManager():Observable<PITUser[]> {
  if (this.PITUserList && this.PITUserList.length > 0) {
    return Observable.of(this.PITUserList);
  } else {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.BusinessManager, this.pcom.getOptions()).map(res => res.json() as PITUser[]);
  }
}
}

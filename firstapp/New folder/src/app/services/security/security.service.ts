import { Injectable } from '@angular/core';
import { Role, Permissions, RolesPermissions, UserPermissions } from '../../../models/Role';
import { PrimcomService } from '../utilities/primcom.service';
import { Http } from '@angular/http';
import { EndPointsConfig } from '../../../models/endpointsconfig';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SecurityService {
  rolesInformation:Role[];
  constructor(private http: Http, private pcom: PrimcomService) { }

    //Get Roles
    GetRoles():Observable<Role[]> {
      // if (this.rolesInformation && this.rolesInformation.length > 0) {
      //   return Observable.of(this.rolesInformation);
      // } else {
        return this.http.get(EndPointsConfig.HostName + EndPointsConfig.Roles, this.pcom.getOptions()).map(res => res.json() as Role[]);
      //}
    }
    AddRole(role:any):Observable<Role>{
      return this.http.post(EndPointsConfig.HostName+EndPointsConfig.Roles,this.pcom.generateBody(role),this.pcom.getOptions()).map(res => res.json() as Role);
    }
    UpdateRole(role:any):Observable<Role>{
      return this.http.put(EndPointsConfig.HostName+EndPointsConfig.Roles+'/'+role.RoleID,this.pcom.generateBody(role),this.pcom.getOptions()).map(res => res.json() as Role);
    }
    GetPermissionssss(Id: number):Observable<Permissions[]> {
        return this.http.get(EndPointsConfig.HostName + EndPointsConfig.RolesToPermissions + '/' + Id, this.pcom.getOptions()).map(res => res.json() as Permissions[]);
    }
    GetPermissions(Id: number):Observable<Permissions[]> {
      return this.http.get(EndPointsConfig.HostName + EndPointsConfig.Permissions + "?RoleID="+ Id, this.pcom.getOptions()).map(res => res.json() as Permissions[]);
    }
    GetPermissionsByRole(Id: number):Observable<Permissions[]> {
      return this.http.get(EndPointsConfig.HostName + EndPointsConfig.Permissions + '/' + Id, this.pcom.getOptions()).map(res => res.json() as Permissions[]);
    }
    GetUserPermissions(user: any):Observable<UserPermissions> {
      return this.http.get(EndPointsConfig.HostName + EndPointsConfig.Permissions +'/'+user.sub, this.pcom.getOptions()).map(res => res.json() as UserPermissions);
    }
    MapRolesAndPermissions(RolesPer:any):Observable<RolesPermissions>{
      return this.http.put(EndPointsConfig.HostName+EndPointsConfig.RolesToPermissions+'/'+RolesPer.RoleID,this.pcom.generateBody(RolesPer),this.pcom.getOptions()).map(res => res.json() as RolesPermissions);
    }
    // this.rolesInformation = [{
    //   RoleID:1,
    //   Name: 'Administrator',
    //   Active: true,
    //   CreatedBy: 'Mohan Kodali',
    //   CreatedDate : '12/24/2017',
    //   Description:'Administrator will have full access to the application',
    //   LastModifiedBy:'',
    //   LastModifiedDate:''
    // }]
  }

import { Component, OnInit, ViewChild, NgModule } from '@angular/core';
import { User, PITUser, UserRoles } from '../../../models/User';
import { DxDataGridComponent, DxDataGridModule, DxFormModule, DxFormComponent } from "devextreme-angular";
import { UserService } from '../../services/user/user.service';
import notify from 'devextreme/ui/notify';
import { Role, Permissions, UserPermissions } from '../../../models/Role';
@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
    UserPermissionsList: UserPermissions;
    IsResetPassword: boolean = false;
    PWloadingVisible: boolean = false;
    IsResetPasswordBoxOpenDisabled: boolean = false;
    TodaysDate: Date = new Date();
    @ViewChild(DxFormComponent) form: DxFormComponent;
    private UserRoles: UserRoles[];
    UserRolesData: UserRoles[];
    UserRolesList: UserRoles;
    users: User[];
    CurrentUser: User;
    pITUser: PITUser;
    currentUserName: string;
    currentUserEmail: string;
    applyFilterTypes: any;
    UserID: string;
    RoleID: number;
    EmailSignature: string;
    IsUserRoleBoxOpen: boolean = false;
    IsSignatureBoxOpen: boolean = false;
    IsSignatureBoxOpenDisabled: boolean = false;
    loadingVisible: boolean = false;
    userProfile: any;
    IsDisabled: boolean = true;
    IsPopupDisabled: boolean = true;
    Role: string = "";
    selectedRows: number[];
    UserRolesDataSource: any;
    @ViewChild("UserGrid") usersgridContainer: DxDataGridComponent;
    @ViewChild("grid") itmGrid: DxDataGridComponent;
    @ViewChild(DxDataGridComponent) dxDataGrid: DxDataGridComponent;
    onToolbarPreparing(e) {
        var toolbarItems = e.toolbarOptions.items;
        // Modifies an existing item
        toolbarItems.forEach((item) => {
            if (item.name == "addRowButton") {
                item.options.text = "Add User";
                item.options.hint = "Add User";
                item.options.icon = "";
                item.showText = "always";
                console.log(item);
            }
        });
    }
    constructor(private userService: UserService) {
        this.UserPermissionsList = JSON.parse(localStorage.getItem('rolespermissionslist'));
        if (this.userService.UsersList && this.userService.UsersList.length > 0) {
            this.users = this.userService.UsersList;
        } else {
            this.GetallUsers();
        }
    }

    ngOnInit() {
    }

    GetallUsers()
    {
        this.userService.GetUsers().subscribe(data => {
            this.userService.UsersList = data;
            this.users = data;
            console.log(data);
        }, err => {
            console.log('Get users data failed..');
        });
    }

    initNewRow(e) {
            e.data.Active = true;
      }

    AddNewUser(e) {
        console.log(e);
        var user = {
            email: e.data.Email,
            email_verified: false,
            given_name: e.data.FirstName,
            family_name: e.data.LastName,
            created_at: $('#today').val(),
            blocked: false,
            password: e.data.password,

        }
        this.userService.AddUser(user).subscribe(data => {
            if (data) {
                this.usersgridContainer.instance.refresh();
                this.GetallUsers();
                notify('User saved successfully.', 'success', 2000);
            }
        }, err => {
            this.GetallUsers();
            notify('This User is already exists .' ,'error', 5000);
            console.log('error type--',err);
        });
    }

    UpdateUser(e) {
        var User = {
            given_name: e.key.FirstName,
            family_name: e.key.LastName,
            user_id: e.key.UserID,
            blocked: e.key.Active,
            email: e.key.Email
        }
        this.userService.UpdateUser(User).subscribe(data => {
            if (data) {
                this.usersgridContainer.instance.refresh();
                notify('User updated successfully.', 'success', 2000);
            }
        }, err => {
            this.usersgridContainer.instance.refresh();
            this.GetallUsers();
            notify(err, 'error', 5000);
        });
    }

    passwordComparison = () => {
        return this.form.instance.option("formData").Password;
    };

    OpenSignature(e) {
        
        this.EmailSignature = "";
        this.CurrentUser = e.data;
        if(e.data.FirstName!=null || e.data.LastName!=null)
            this.currentUserName = e.data.FirstName + " " +e.data.LastName;
        this.currentUserEmail = e.data.Email;
        this.UserID = e.data.UserID; //e.data.user_id;
        //this.pITUser = null;
        this.userService.GetUsersEmailSignature(e.data.UserID).subscribe(data => {
            if(data)
            {
                // $('#Designation').val('');
                // $('#PhoneNo').val('');
                this.pITUser = null;
                this.pITUser = data;
            }
                //this.IsEmailSignatureFetched = true;
                this.IsSignatureBoxOpen = true;
            }, err => {
                console.log('Users Email Signature data failed.');
            });
        }
        AddUpdateEmailSignature() {
            var phone = $('#PhoneNo input').val().toString().replace(/\s/g, '');  
            
            if(phone.toString().length==10)
			{
            this.IsSignatureBoxOpenDisabled = true;
            this.loadingVisible = true;
            this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
            var PITUser = {
                // UserID: this.CurrentUser.user_id,
                // Email: this.CurrentUser.email,
                // EmailVerified: this.CurrentUser.email_verified,
                // FirstName: this.CurrentUser.given_name,
                // LastName: this.CurrentUser.family_name,
                // CreatedDate: this.CurrentUser.created_at,
                // Picture: this.CurrentUser.picture,
                UserID: this.CurrentUser.UserID,
                Email: this.CurrentUser.Email,
                //EmailVerified: this.CurrentUser.email_verified,
                FirstName: this.CurrentUser.FirstName,
                LastName: this.CurrentUser.LastName,
                CreatedDate: this.CurrentUser.CreatedDate,
                //Picture: this.CurrentUser.picture,
                CreatedBy: "WebUser",
                EmailSignature: this.EmailSignature,
                Designation: $('#Designation').val(),
                PhoneNumber: $('#PhoneNo input').val(),
                LastModifiedBy: this.userProfile.sub
            }
            this.userService.UpdateEmailSignature(PITUser).subscribe(data => {
                if (data) {
                    this.GetallUsers();
                    notify('Email Signature updated successfully.', 'success', 2000);
                    this.IsSignatureBoxOpenDisabled = false;
                    this.loadingVisible = false;
                    this.IsSignatureBoxOpen = false;
                }
            }, err => {
                notify(err, 'error', 5000);
                this.IsSignatureBoxOpenDisabled = false;
                this.loadingVisible = false;
                this.IsSignatureBoxOpen = false;
            })
            console.log($('#PhoneNo input').val());
        }
        else
        {
            return true;
        }
        }   
        
    CloseCommentPopup() {
        this.IsSignatureBoxOpen = false;
    }
    /***Start Mapping Roles to User */
    OpenUserRole(e) {
        this.UserID = e.data.UserID;
        this.RoleID = null; 
        this.GetMappedUserRoles(this.UserID);
        this.GetAvailableUserRoleDropdown(this.UserID);
        this.IsUserRoleBoxOpen = true;
    }
    GetMappedUserRoles(UserID) {
        this.userService.GetUsersRole(this.UserID).subscribe(data => {
            this.UserRoles = data;
        },
            err => {
                notify('Roles Data Fetch Failed.', 'Error', 5000);
            });
    }
    GetAvailableUserRoleDropdown(UserID) {
        console.log(this.UserID);
        this.userService.GetAvailableUserRoleDropdownList(this.UserID).subscribe(data => {
            this.UserRolesData = data;
            this.UserRolesData.sort(function (a, b) { return (a.Name > b.Name) ? 1 : ((b.Name > a.Name) ? -1 : 0); });
        },
            err => {
                notify('Roles Data Fetch Failed.', 'Error', 5000);
            });
    }
    CreateRoleToUser() {
        if (this.RoleID != null) {
            this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
            var userRoles = {
                RoleID: this.RoleID,
                UserID: this.UserID,
                Active: true,
                CreatedBy: this.userProfile.sub,
                CreatedDate: new Date(Date.now()),
                LastModifiedBy: this.userProfile.sub,
                LastModifiedDate: new Date(Date.now())
            }
            $('#RoleID').css("border", "1px solid #dddddd");
            //SAVE OR UPDATE Role To User
            this.userService.AddRoleToUser(userRoles).subscribe(data => {
                this.GetMappedUserRoles(this.UserID);
                this.GetAvailableUserRoleDropdown(this.UserID);
                this.RoleID = null;
                notify('Role added successfully.', 'success', 2000);
            }, err => {
                console.log('Roles data fetch failed');
            });
        } else {
            $('#RoleID').css("border", "1px solid red");
            notify('Please select Role.', 'Error', 6000);
        }
    }
    DeleteRolesToUser(e: any) {
        this.userService.DeleteRolesToUser(e.data.RoleToUserMappingID).subscribe(data => {
            notify('Role deleted successfully.', 'success', 2000);
            this.GetMappedUserRoles(e.key.UserID);
            this.GetAvailableUserRoleDropdown(e.key.UserID);
        }, err => {
            notify('Failed to delete Role.', 'Error', 5000);
        });
    }
    CloseRolesPopup() {
        this.IsUserRoleBoxOpen = false;
        $('#RoleID').css("border", "1px solid #dddddd");
    }
    /***End Mapping Roles to User */

    ActiveInactive(e) {
        this.userService.ActiveInactiveUser(e.data.user_id).subscribe(data => {
            if(data)
            {
                this.pITUser = null;
                this.pITUser = data;
            }
                //this.IsEmailSignatureFetched = true;
                this.IsSignatureBoxOpen = true;
            }, err => {
                console.log('Users Email Signature data failed.');
            });
        }

        OpenPassword(e) {
            
            $('#PasswordVal').val('');
            $('#RePassword').val('');
            this.IsResetPassword = true;
            this.UserID = e.data.UserID;
            this.CurrentUser = e.data;
            }
            CloseResetPWPopup()
            {
                this.IsResetPassword = false;
            }
            ResetPassword()
            {
                if($('#PasswordVal').val() == "" &&  $('#RePassword').val() == "")
                    return 1;
                this.IsResetPasswordBoxOpenDisabled = true;
                this.PWloadingVisible = true;
                var User = {
                    given_name: this.CurrentUser.FirstName,
                    family_name: this.CurrentUser.LastName,
                    blocked: true,
                    password: $('#PasswordVal').val(),
                    user_id: this.UserID
                }
                this.userService.UpdateUser(User).subscribe(data => {
                    if (data) {
                        this.userService.GetUsers().subscribe(data => {
                            this.userService.UsersList = data;
                            this.users = data;
                        }, err => {
                        });
                        this.IsResetPassword = false;
                        this.IsResetPasswordBoxOpenDisabled = false;
                        this.PWloadingVisible = false;
                        notify('Password updated successfully.', 'success', 2000);
                    }
                }, err => {
                    notify(err, 'error', 5000);
                });
            }
            OnUserEditStart(e)
            {
                console.log("----");
                if(e.parentType == "dataRow" && e.dataField == "password" && !e.row.inserted)
                {
                    
                    e.editorOptions.disabled = true;
                    //e.editorOptions.css('background-color', 'red !important');
                }
               // e.editorOptions.disabled = e.parentType == "dataRow" && e.dataField == "password" && !e.row.inserted;   
            }
}

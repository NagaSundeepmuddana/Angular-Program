import { Component, OnInit } from '@angular/core';
import { Role, Permissions, UserPermissions } from '../../../models/Role';
import { SecurityService } from '../../services/security/security.service';
import { DxDataGridComponent, DxDataGridModule, DxFormModule, DxFormComponent, DxTextAreaModule } from "devextreme-angular";
import { Permission } from '../../../models/Permission';
import notify from 'devextreme/ui/notify';
import 'devextreme/integration/jquery';
@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.css']
})
export class SecurityComponent implements OnInit {
  UserPermissionsList: UserPermissions;
  SelectedRoleID: number;
  SelectedRolesPermissions: string;
  SelectedParentPermissions: string;
  isDataFetched: boolean = false;
  isPermissionDataFetched: boolean = false;
  loadingVisible: boolean = false;
  userProfile: any;
  roleInformation:Role[];
  roleInContext:Role;
  roleInformationPopup:boolean = false;
  PermissionsListData: Permissions[];
  permissionsList:Permission[];
  selectedRowKeys: any[];// = [3,5];
  recursiveSelectionEnabled = true;
  onToolbarPreparing(e) {
    var toolbarItems = e.toolbarOptions.items;
    toolbarItems.forEach((item) => {
      if (item.name == "addRowButton") {
        item.options.text = "Add Role";
        item.options.hint = "Add Role";
        item.options.icon="";
        item.showText = "always";
        console.log(item);
      }
    });
  }

  constructor(private securityService:SecurityService) {
    this.UserPermissionsList = JSON.parse(localStorage.getItem('rolespermissionslist'));
    //this.roleInformation = this.securityService.rolesInformation;
    //this.roleInContext = this.roleInformation[0];

    // if(this.securityService.rolesInformation && this.securityService.rolesInformation.length > 0){
    //     this.roleInformation  = this.securityService.rolesInformation;
    // }else{
        this.GetRoles();
    //}
  
    
    this.permissionsList = [
      {
          PermissionID: 1,
          ParentPermissionID: 0,
          Name: "PLROOT",
          Description: "Root",
          Priority: 1
      },
      {
          PermissionID: 2,
          ParentPermissionID: 1,
          Name: "PL000000",
          Description: "Projects",
          Priority: 1
      },
      {
          PermissionID: 3,
          ParentPermissionID: 2,
          Name: "PL000001",
          Description: "View Projects",
          Priority: 1
      },
      {
        PermissionID: 4,
        ParentPermissionID: 2,
        Name: "PL000002",
        Description: "Edit Projects",
        Priority: 2   
      },
      {
        PermissionID: 5,
        ParentPermissionID: 2,
        Name: "PL000003",
        Description: "Add Projects",
        Priority: 3 
      },
      {
          PermissionID: 6,
          ParentPermissionID: 2,
          Name: "PL000004",
          Description: "Delete Projects",
          Priority: 4
      },
      {
          PermissionID: 7,
          ParentPermissionID: 2,
          Name: "PL000005",
          Description: "Lock Projects",
          Priority: 5
      },
      {
          PermissionID: 8,
          ParentPermissionID: 2,
          Name: "PL000006",
          Description: "View Quotes",
          Priority: 6
      },
      {
          PermissionID: 9,
          ParentPermissionID: 2,
          Name: "PL000007",
          Description: "Replicate Quotes",
          Priority: 7
      },
      {
          PermissionID: 10,
          ParentPermissionID: 2,
          Name: "PL000008",
          Description: "Lock Quotes",
          Priority: 8
      },
      {
          PermissionID: 11,
          ParentPermissionID: 1,
          Name: "PL000009",
          Description: "Divisions",
          Priority: 1
      },
      {
          PermissionID: 12,
          ParentPermissionID: 11,
          Name: "PL000010",
          Description: "View Divisions",
          Priority: 1
      },
      {
          PermissionID: 13,
          ParentPermissionID: 11,
          Name: "PL000011",
          Description: "Edit Divisions",
          Priority: 2
      },
      {
          PermissionID: 14,
          ParentPermissionID: 11,
          Name: "PL000012",
          Description: "Add Divisions",
          Priority: 3
      },
      {
          PermissionID: 15,
          ParentPermissionID: 11,
          Name: "PL000013",
          Description: "Delete Divisions",
          Priority: 4
      },
      {
          PermissionID: 16,
          ParentPermissionID: 1,
          Name: "PL000014",
          Description: "ProductLines",
          Priority: 1
      },
      {
          PermissionID: 17,
          ParentPermissionID: 16,
          Name: "PL000015",
          Description: "View ProductLines",
          Priority: 1
      },
      {
          PermissionID: 18,
          ParentPermissionID: 16,
          Name: "PL000016",
          Description: "Edit ProductLines",
          Priority: 2
      },
      {
          PermissionID: 19,
          ParentPermissionID: 16,
          Name: "PL000017",
          Description: "Add ProductLines",
          Priority: 3
      },
      {
          PermissionID: 20,
          ParentPermissionID: 16,
          Name: "PL000018",
          Description: "Delete ProductLines",
          Priority: 4
      }
  ];
  
  }

  GetRoles()
  {
    this.securityService.GetRoles().subscribe(data => {
        this.securityService.rolesInformation = data;
        this.roleInformation = data;
        this.isDataFetched = true;
    }, err => {
        console.log('Get roles data failed..');
    });
  }
  AddNewRole(e) {
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    var role = {
        Name: e.data.Name,
        Description: e.data.Description,
        CreatedBy: this.userProfile.sub,
        Active: true
    }
    this.securityService.AddRole(role).subscribe(data => {
        if (data) {
          this.GetRoles();
          notify('Role added successfully.', 'success', 2000);
        }
      }, err => {
      });
  }
  RoleEditorPreparing(e)
  {
    if (e.dataField == "Description") {
        e.editorName = "dxTextArea";
        e.editorOptions.height = 70;
      }
  }
  UpdateRoles(e)
  {
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    var role = {
        RoleID: e.RoleID,
        Name: e.Name,
        Description: e.Description,
        CreatedBy: e.CreatedByID,
        CreatedDate: e.CreatedDate,
        LastModifiedBy: this.userProfile.sub,
        LastModifiedDate: ""
    }
      this.securityService.UpdateRole(role).subscribe(data => {
        if (data) {
            this.GetRoles();
          notify('Role updated successfully.', 'success', 2000);
        }
      }, err => {
      });
  }
  openPermissionMapByRole(d:any){
    this.SelectedRoleID = d.data.RoleID;
    this.isPermissionDataFetched = false;
    this.securityService.GetPermissions(d.data.RoleID).subscribe(data => {
        if (data) {
            this.PermissionsListData = data;
            console.log(this.PermissionsListData);
            this.PermissionsListData.forEach(element => {
                if(element.ParentPermissionID == 0 || element.ParentPermissionID == 1)
                    element.IsParent = true;
                else   
                    element.IsParent = false;
            });
            this.isPermissionDataFetched = true;
            this.roleInformationPopup = true;
            this.selectedRowKeys = this.PermissionsListData.filter(n => n.RoleID === d.data.RoleID && n.ParentPermissionID!=0  && n.ParentPermissionID!=1 ).map(m => m.PermissionID);;
        } 
      }, err => {
      });
    this.roleInContext = this.roleInformation[0];
  }
  SelectedOrderRow(e) {
    console.log(e);
    if(e.selectedRowsData.length)
    this.SelectedRolesPermissions = this.SelectedRoleID +"-";
    this.SelectedParentPermissions = "";
    for (var index: number = 0; index < e.selectedRowsData.length; index++) {
        if(e.selectedRowsData[index].IsParent == true)
            this.SelectedParentPermissions += e.selectedRowsData[index].PermissionID + ",";
        else
            this.SelectedRolesPermissions += e.selectedRowsData[index].PermissionID + ",";
    }
    console.log(this.SelectedRolesPermissions);
    console.log(this.SelectedParentPermissions);
  }
  savePermissionsByRole(){
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    this.loadingVisible = true;
    var permissions = {
        RoleID: this.SelectedRoleID,
        InputParms: this.SelectedRolesPermissions,
        CreatedBy: this.userProfile.sub,
        ParentPermissions: this.SelectedParentPermissions
    }
      this.securityService.MapRolesAndPermissions(permissions).subscribe(data => {
        if (data) {
            this.GetRoles();
            notify('Permissions saved successfully.', 'success', 2000);
            this.loadingVisible = false;
            this.roleInformationPopup = false;
        }
      }, err => {
      });
  }
  closePermissionsByRolePopup(){
    this.roleInformationPopup = false;
  }
  ngOnInit() {
      
  }
}

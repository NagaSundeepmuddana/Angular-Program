import { Component, OnInit } from '@angular/core';
import { Division } from '../../../models/division';
import { MetadataService } from '../../services/metadata/metadata.service';
import notify from 'devextreme/ui/notify';
import { ProductLines } from '../../../models/ProductLines';
import { UserService } from '../../services/user/user.service';
import { User } from '../../../models/User';
import { Role, Permissions, UserPermissions } from '../../../models/Role';
import { AuthenticationService } from "../../services/auth/authentication.service";

@Component({
  selector: 'app-dvs',
  templateUrl: './dvs.component.html',
  styleUrls: ['./dvs.component.css']
})
export class dvsComponent implements OnInit {
  UserPermissionsList: UserPermissions;
  private DivisionList: Division[] = [];
  dvs: Division[] = [];
  DivisionPopupVisible: boolean = false;
  private ProductLinesList: ProductLines[] = [];
  ProductLinesPopupVisible: boolean = false;
  IsPopupDisabled: boolean = false;
  userProfile: any;
  divName: string;
  Description: string;
  SubAccount: string;
  Status: boolean;
  DivisionLoading: boolean = false;
  onToolbarPreparing(e) {
    var toolbarItems = e.toolbarOptions.items;
    // Modifies an existing item
    toolbarItems.forEach((item) => {
      if (item.name == "addRowButton") {
        item.options.text = "Add Division";
        item.options.hint = "Add Division";
        item.options.icon="";
        item.showText = "always";
      }
    });
  }
  constructor(private metaService: MetadataService, private userService: UserService, public auth: AuthenticationService) {
    this.UserPermissionsList = JSON.parse(localStorage.getItem('rolespermissionslist'));
    this.userProfile = this.auth.useProfile;
    this.GetAllDivisionss();
  }
  /** Get Divisions data */
  GetAllDivisionss() {
    this.metaService.GetAllDivisions().subscribe(data => {
      this.DivisionList = data;
    },
      err => {
        console.log('Division Data Fetch Failed..');
      });
  }
  ngOnInit() {
  }
  /** Add New Division */
  AddNewDivision(e) {
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    this.metaService.PostDivision(e.data.Name, e.data.Description, e.data.ExternalReferenceNo, e.data.SubAccount, true,
      this.userProfile.sub, new Date(Date.now()), e.data.LastModifiedBy, e.data.LastModifiedDate).subscribe(data => {
        if (data) {
          console.log(data);
          notify('Division saved successfully.', 'success', 2000);
          this.GetAllDivisionss();
        }
        else {
          this.GetAllDivisionss();
          notify('Division name already exists.', 'error', 5000);
        }
      }, err => {
        notify('Failed to add Division.', 'Error', 5000);
      });
  }

  /** Edit Division */
  EditDivision(e) {
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    console.log("My edit data" + e.key.Name);
    console.log(e);
    this.metaService.PutDivision(e.key.DivisionID, e.key.Name, e.key.Description, e.key.ExternalReferenceNo, e.key.SubAccount, e.key.Active,
      e.key.CreatedBy, e.key.CreatedDate, this.userProfile.sub, new Date(Date.now())).subscribe(data => {
        if (data) {
          notify('Division updated successfully.', 'success', 2000);
          this.GetAllDivisionss();
        }
        else {
          this.GetAllDivisionss();
          notify('Division name already exists.', 'error', 5000);
        }
      }, err => {
        notify('Failed to update Division.', 'Error', 5000);
      });
  }
  /**Delete Division */
  DeleteDivision(e: any) {
    this.metaService.DeleteDivision(e.data.DivisionID).subscribe(data => {
      if (data.length>0) {
        notify(data, 'error', 6000);
        this.GetAllDivisionss();
      }
      else {
        this.GetAllDivisionss();
        notify('Division deleted successfully.', 'success', 5000);
      }
    }, err => {
      this.GetAllDivisionss();
      notify('Failed to delete Division.', 'Error', 5000);
    });
  }
  AfterDivisionDelete() {
    console.log("DELETE SUCCESS");
  }
  //  //GET FILTERED Divisions
  // GetFilterDivison(formData: any): void {
  //   this.DivisionLoading = true;
  //   console.log("status is" + formData.Status);
  //     this.metaService.GetFilteredDivisions(formData.divName,formData.Description,formData.SubAccount,formData.Status).subscribe(data => {
  //       this.DivisionList = data;
  //       this.dvs = data;
  //       console.log("Load filtered Divisions data");
  //       console.log(data);
  //     },
  //       err => {
  //         console.log('Filtered Divisions Data Fetch Failed..');
  //       });

  //   console.log(formData);
  //   console.log(this.DivisionList);
  //   this.DivisionLoading = false;
  // }
  openDivisionMappingModal(e) {
    this.ProductLinesPopupVisible = true;
    this.metaService.GetProductLines().subscribe(data => {
      this.ProductLinesList = data.filter(m => m.DivisionID === e.data.DivisionID);
    },
      err => {
        notify('Product Lines data fetch failed.', 'Error', 5000);
      });
  }
  CloseProductLinesPopup() {
    this.ProductLinesPopupVisible = false;
  }
  logEvent(e: any) {
    console.log("e");
  }
}

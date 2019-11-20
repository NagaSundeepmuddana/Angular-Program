import { Component, OnInit, ViewChild } from '@angular/core';
import { MetadataService } from "../../services/metadata/metadata.service";
import { Freight } from "../../../models/Freight";
import { States, County } from '../../../models/Project';
import notify from 'devextreme/ui/notify';
import { UserService } from '../../services/user/user.service';
import { User } from '../../../models/User';
import { Role, Permissions, UserPermissions } from '../../../models/Role';
import { DxDataGridComponent } from "devextreme-angular";
import { PrimcomService } from '../../services/utilities/primcom.service';
import { AuthenticationService } from "../../services/auth/authentication.service";

@Component({
  selector: 'app-frt',
  templateUrl: './frt.component.html',
  styleUrls: ['./frt.component.css']
})
export class frtComponent implements OnInit {
  UserPermissionsList: UserPermissions;
  popupVisible = false;
  private FreightList: Freight[] = [];
  State: number;
  Country: number;
  private SearchCounty: number;
  private FreightState: States[] = [];
  private FreightCounty: County[] = [];
  isDataFetched: boolean = false;
  userProfile: any;
  onToolbarPreparing(e) {
    var toolbarItems = e.toolbarOptions.items;
    // Modifies an existing item
    toolbarItems.forEach((item) => {
      if (item.name == "addRowButton") {
        item.options.text = "Add Freight";
        item.options.hint = "Add Freight";
        item.options.icon = "";
        item.showText = "always";
        console.log(item);
      }
    });
  }
  constructor(private metaService: MetadataService, private userService: UserService, public auth: AuthenticationService) {
    this.UserPermissionsList = JSON.parse(localStorage.getItem('rolespermissionslist'));
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    this.userProfile = this.auth.useProfile;
    this.FreightCounty = JSON.parse(localStorage.getItem('CountyData'));
    //Get Freight
    this.getFilteredCunties = this.getFilteredCunties.bind(this);
    // //Get states and counties
    if (this.metaService.StatesList && this.metaService.StatesList.length > 0) {
      this.FreightState = this.metaService.StatesList;
    } else {
      this.metaService.GetStates().subscribe(data => {
        this.metaService.StatesList = data;
        console.log("load state data");
        console.log(data);
        this.FreightState = data;
      },
        err => {
          notify('Freight state Data Fetch Failed.', 'Error', 2000);
        });
    }

    if (this.metaService.CountyList && this.metaService.CountyList.length > 0) {
      this.FreightCounty = this.metaService.CountyList;
      this.GetMyFreight();
    } else {
      this.metaService.GetCounty().subscribe(data => {
        this.metaService.CountyList = data;
        this.FreightCounty = data;
        localStorage.setItem("CountyData", JSON.stringify(data));
        this.GetMyFreight();
      },
        err => {
          notify('Freight county Data Fetch Failed.', 'Error', 2000);
        });
    }

  }
  setStateValue(rowData: any, value: any): void {
    rowData.CountyID = null;
    (<any>this).defaultSetCellValue(rowData, value);
  }
  getFilteredCunties(options) {
    return {
      store: this.FreightCounty,
      filter: options.data ? ["StateID", "=", options.data.StateID] : null
    };
  }
  //Get Freight Data
  GetMyFreight() {
    this.metaService.GetFreight().subscribe(data => {
      console.log("load Frieght data");
      this.FreightList = data;
      this.isDataFetched = true;
    },
      err => {
        notify('Frieght Data Fetch Failed.', 'Error', 2000);
      });
  }


  ngOnInit() {
  }

  SetSelectedDivision(m) {
    console.log(m);
  }

  AddNewFreight(e) {
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    console.log("Freight Adding...");
    console.log(e.data.CountyID + " " + e.data.StateID + " " + e.data.FreightRate);
    this.metaService.PostFreight(e.data.CountyID, e.data.FreightRate, true,
      this.userProfile.sub, new Date(Date.now())).subscribe(data => {
        if (data) {
          console.log(data);
          notify('Freight saved successfully.', 'success', 2000);
          this.GetMyFreight();
        }
        else {
          this.GetMyFreight();
          notify('This Freight Name already exists. Please enter different Name.', 'error', 2000);
        }
      }, err => {
        this.GetMyFreight();
        notify('Failed to add Freight.', 'Error', 2000);
      });
  }
  Countyselectedvalue(e) {
    this.SearchCounty = e.value;
  }
  AddNewFreightDone(e) {
    console.log("Freight Adding done");
  }
  /** Edit Freight */
  EditFreight(e) {
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    console.log("My edit data" + e.key.FreightRate);
    console.log(e);
    this.metaService.PutFreight(e.key.FreightSetupID, e.key.CountyID, e.key.FreightRate, e.key.Active,
      e.key.CreatedBy, e.key.CreatedDate, this.userProfile.sub, new Date(Date.now())).subscribe(data => {
        if (data) {
          console.log(data);
          notify('Freight updated successfully.', 'success', 2000);
          this.GetMyFreight();
        }
        else {
          this.GetMyFreight();
          notify('This Freight Name already exists. Please enter different Name.', 'error', 2000);
        }
      }, err => {
        this.GetMyFreight();
        notify('Failed to update Freight.', 'Error', 2000);
      });
  }
  DeleteFreight(e: any) {
    console.log("DELETE STARTED");
    console.log(e.data.FreightSetupID);
    this.metaService.DeleteFreight(e.data.FreightSetupID).subscribe(data => {
      this.GetMyFreight();
      notify('Freight deleted successfully.', 'success', 2000);
    }, err => {
      this.GetMyFreight();
      notify('Failed to delete Freight.', 'Error', 2000);
    });
  }
  AfterFreightDelete() {
    console.log("DELETE SUCCESS");
  }
  /**Clear Search Parameters */
  FreightClearParameters() {
    this.State = null;
    this.Country = null;
  }
  logEvent(e: any) {
    console.log("e");
  }

}

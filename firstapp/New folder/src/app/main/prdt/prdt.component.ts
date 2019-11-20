import { Component, OnInit } from '@angular/core';
import { ProductLines, ProductlineDivisions } from '../../../models/ProductLines';
import { MetadataService } from "../../services/metadata/metadata.service";
import { Division } from "../../../models/division";
import notify from 'devextreme/ui/notify';
import { UserService } from '../../services/user/user.service';
import { User } from '../../../models/User';
import { Role, Permissions, UserPermissions } from '../../../models/Role';
import { AuthenticationService } from "../../services/auth/authentication.service";

@Component({
  selector: 'app-prdt',
  templateUrl: './prdt.component.html',
  styleUrls: ['./prdt.component.css']
})
export class prdtComponent implements OnInit {
  UserPermissionsList: UserPermissions;
  private GetDivisionList: Division[] = [];
  popupVisible = false;
  private ProductLinesList: ProductLines[] = [];
  prdt: ProductLines[] = [];
  private ProductLineDivision: ProductlineDivisions[] = [];
  ProductLineName: string;
  AlternateName: string;
  selDivisionList: string;
  Status: string;
  userProfile:any;
  onToolbarPreparing(e) {
    var toolbarItems = e.toolbarOptions.items;
    // Modifies an existing item
    toolbarItems.forEach((item) => {
      if (item.name == "addRowButton") {
        item.options.text = "Add Product Line";
        item.options.hint = "Add Product Line";
        item.options.icon="";
        item.showText = "always";
        console.log(item);
      }
    });
  }
  constructor(private metaService: MetadataService,private userService:UserService, public auth: AuthenticationService) {
    this.UserPermissionsList = JSON.parse(localStorage.getItem('rolespermissionslist'));
    this.userProfile = this.auth.useProfile;
    /** Get Divisions data */
    this.metaService.GetAllDivisions().subscribe(data => {
      console.log("load Division data");
      console.log(data[0]);
      this.GetDivisionList = data;
      this.GetDivisionList.sort(function (a, b) { return (a.Name > b.Name) ? 1 : ((b.Name > a.Name) ? -1 : 0); });
    },
      err => {
        console.log('Division Data Fetch Failed..');
      });
    /**Customer Displaydata */
    this.GetMyProductLines();
  }

  GetMyProductLines() {
    this.metaService.GetProductLines().subscribe(data => {
      console.log("load Product Lines data");
      console.log(data[0]);
      this.ProductLinesList = data;
    },
      err => {
        notify('Product Lines data fetch failed.', 'Error', 5000);
      });

  }
  ngOnInit() {
  }

  AddNewProductLine(e) {
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    //this.ProjectItemList.push(e.data[0]);
    console.log("Product Lines Adding...");
    console.log(e.data.ProductLineID + " " + e.data.Name + " " + e.data.AltName + " " + e.data.ExternalReferenceNo);
    this.metaService.PostProductLine(e.data.DivisionID, e.data.Name, e.data.AltName, e.data.ExternalSystemRefNo, true,
      this.userProfile.sub, new Date(Date.now())).subscribe(data => {
        if(data)
        {
          console.log(data);
          notify('Product Line saved successfully.','success',3000);
          this.GetMyProductLines();
        }
        else
        {
          this.GetMyProductLines();
          notify('This Product Line Name already exists. Please enter different Name.','error',6000);
        }
      }, err => {
        this.GetMyProductLines();
        notify('Failed to add Product Lines.', 'Error', 3000);
      });
    console.log("Product Line Adding...end");
  }

  /** Edit Product Lines */
  EditProductLines(e) {
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    console.log("My edit data" + e.key.Name);
    console.log(e);
    this.metaService.PutProductLines(e.key.ProductLineID, e.key.DivisionID, e.key.Name, e.key.AltName, e.key.ExternalSystemRefNo, e.key.Active,
      e.key.CreatedBy,e.key.CreatedDate,this.userProfile.sub, new Date(Date.now())).subscribe(data => {
        if(data)
        {
          console.log(data);
          notify('Product Line updated successfully.','success',3000);
          this.GetMyProductLines();
        }
        else
        {
          this.GetMyProductLines();
          notify('This Product Line Name already exists. Please enter different Name.','error',6000);
        }
      }, err => {
        this.GetMyProductLines();
        notify('Failed to update Product Lines.', 'Error', 5000);
      });
  }



  DeleteProductLines(e: any) {
    console.log("DELETE STARTED");
    console.log(e.data.ProductLineID);
    this.metaService.DeleteProductLines(e.data.ProductLineID).subscribe(data => {
      if (data.length>0) {
        console.log(data);
        notify(data, 'error', 2000);
        this.GetMyProductLines();
      }
      else {
        this.GetMyProductLines();
        notify('Product Line deleted successfully.', 'success', 3000);
      }
    }, err => {
      this.GetMyProductLines();
      notify('Failed to delete Product Line.', 'Error', 6000);
    });
  }

  AfterProductLinesDelete() {
    console.log("DELETE SUCCESS");
  }
  AddNewProductLineDivision(e) {
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    // Get Divisions List
    this.metaService.GetProductLineDivisionMapping(e.key.DivisionID).subscribe(data => {
      notify('Division saved successfully.', 'success', 3000);
      console.log("load Divisions data");
      console.log(data);
      this.ProductLineDivision = data;
    },
      err => {
        notify('Divisions list Fetch Failed.', 'Error', 5000);
      });
    console.log("ProductLine Division Adding...");
    console.log(e.data.ProductLineID + " " + e.data.DivisionIDs);
    this.metaService.PostProductLineDivisions(e.data.ProductLineID, e.data.DivisionIDs, e.data.Active, this.userProfile.sub, new Date(Date.now()), ).subscribe(data => {

      this.ProductLineDivision = data;
      notify('ProductLine Division saved successfully.', 'success', 3000);
    }, err => {
      notify('Failed to add ProductLine Division.', 'Error', 6000);
    });
    console.log("ProductLine Division Adding...end");
  }

  AddNewProductLineDivisionDone(e) {
    console.log("ProductLine Division Adding done");
  }


  DeleteProductLineDivision(e: any) {
    console.log("DELETE STARTED");
    console.log(e.data.ProductLineID);
    this.metaService.DeleteProductLineDivision(e.data.ProductLineID).subscribe(data => {
      notify('ProductLine Division deleted successfully.', 'success', 3000);
    }, err => {
      notify('Failed to delete ProductLine Division.', 'Error', 6000);
    });
  }

  AfterProductLineDivisionDelete() {
    console.log("DELETE SUCCESS");
  }
  //GET FILTERED ProductLines(Search)
  GetFilterProductLines(formData: any): void {
    console.log("status is" + formData.Status);
    this.metaService.GetFilteredProductLines(formData.ProductLineName, formData.AlternateName, true).subscribe(data => {
      this.ProductLinesList = data;
      this.prdt = data;
      console.log("Load filtered Customer data");
      console.log(data);
    },
      err => {
        notify('Filtered Customer Data Fetch Failed.', 'Error', 5000);
      });

    console.log(formData);
    console.log(this.ProductLinesList);
  }
  /**Clear Search Parameters */
  prdtClearParameters() {
    this.GetMyProductLines();
    this.ProductLineName = null;
    this.AlternateName = null;
    this.selDivisionList = null;
    this.Status = null;
  }
  logEvent(e: any) {
    console.log("e");
  }
}

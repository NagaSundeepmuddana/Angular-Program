import { Component, OnInit,NgModule, ViewChild } from '@angular/core';
import { DxDataGridComponent } from "devextreme-angular";
import { DxSelectBoxModule, DxTextBoxModule,DxDataGridModule, DxTemplateModule, DxAutocompleteModule } from 'devextreme-angular';
import { MetadataService } from "../../services/metadata/metadata.service";
import { TermsAndCondition,TermsAndConditionsDivisionMapping } from '../../../models/TermsAndConditions';
import notify from 'devextreme/ui/notify';
import { UserService } from '../../services/user/user.service';
import { User } from '../../../models/User';
import { Role, Permissions, UserPermissions } from '../../../models/Role';
import { Division } from '../../../models/division';
import { AuthenticationService } from "../../services/auth/authentication.service";

@Component({
  selector   : 'app-tac',
  templateUrl: './tac.component.html',
  styleUrls  : ['./tac.component.css']
})
export class tacComponent implements OnInit {
  UserPermissionsList: UserPermissions;
  private TermsAndConditionList : TermsAndCondition[] = [];
  Terms:TermsAndCondition[] = [];
  private TermsAndConditionDivisionList : TermsAndConditionsDivisionMapping[] = [];
  GetDivisionList: TermsAndConditionsDivisionMapping[] = [];
  private DivisionList: Division[] = [];
 DivisionMapping : Division[] = [];
 DivisionMapList: Division[] = [];
  popupVisible = false;
  TermName : string;
  selDivisionList : string;
  Description : string;
  Status : string;
  MapTermID: number;
  TermsAndConditionsID:number;
  DivisionTermsPopupVisible :boolean=false;
  IsDisabled: boolean = true;
  TacDivisionListDataSource:any;
  TaCDvs: string = "";
  selectedRows: number[];
  TermDivisionByComma:string;
  DvList:any;
  loadingVisible = false;
  DivisionID: number = 0;
  IsPopupDisabled : boolean = false;
  IsCancelBtnDisabled: boolean = false;
  saveSuccess:boolean = false;
  TermsToDivisionPopupVisible:boolean=false;
  message: string;
  DivisionTacPopupVisible:boolean=false;
  TermsAndConditionsDivisionMapID:number;
  userProfile:any;
  @ViewChild("DivisionTacListGrid") itmGrid: DxDataGridComponent;
  @ViewChild(DxDataGridComponent) dxDataGrid: DxDataGridComponent;
  onToolbarPreparing(e) {
    var toolbarItems = e.toolbarOptions.items;
    // Modifies an existing item
    toolbarItems.forEach((item) => {
      if (item.name == "addRowButton") {
        item.options.text = "Add Term";
        item.options.hint = "Add Term";
        item.options.icon="";
        item.showText = "always";
        console.log(item);
      }
    });
  }
  constructor(private metaService: MetadataService,private userService:UserService, public auth: AuthenticationService) {
    this.userProfile = this.auth.useProfile;
    this.UserPermissionsList = JSON.parse(localStorage.getItem('rolespermissionslist'));
    console.log(this.UserPermissionsList);
   /**Terms Displaydata */
   this.GetmyTermsAndConditions();
   this.GetAllDivisionss();
  }
  GetmyTermsAndConditions(){
    this.metaService.GetTermsAndConditions().subscribe(data=>{
      console.log("Load Terms and Condition data");
      console.log(data[0]);
      this.TermsAndConditionList=data;
    },
      err=>{
        console.log("Terms and Condition data fetch failed.");
      });
  }
  GetAllDivisionss() {
    this.metaService.GetDivisions("0").subscribe(data => {
      console.log("load Division data");
      console.log(data[0]);
      this.DivisionList = data;
    },
      err => {
        console.log('Division Data Fetch Failed..');
      });
  }
  ngOnInit() {
  }
  initNewRow(e) {
    e.data.DefaultTermsAndConditions = false; 
  }

   
  onTermsEditorPreparing(e) {
    if (e.dataField == "TermsAndConditions") {
      e.editorName = "dxTextArea";
      e.editorOptions.height = 70;
    }
  }

/** Add TermsandConditions */
AddNewTermsandCondition(e)
{
  this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
  console.log("Terms and Conditions Adding...");
  console.log(e);
  console.log(e.data.TermsAndConditionsID + " " + e.data.DivisionName + " " + e.data.TermsAndConditions + " " + e.data.DefaultTermsAndConditions);
  this.metaService.PostTermsAndConditions(e.data.Name, e.data.TermsAndConditions,e.data.DefaultTermsAndConditions,true,
    this.userProfile.sub,new Date(Date.now())).subscribe(data => {
      if(data)
      {
        console.log(data);
        notify('Terms saved successfully.','success',2000);
        this.GetmyTermsAndConditions();
      }
      else
      {
        this.GetmyTermsAndConditions();
        notify('This Term  already exists. Please enter different Term.','error',2000);
      }
  }, err => {
    this.GetmyTermsAndConditions();
    notify('Failed to save Terms','Error',2000);
  });
  console.log("Terms and Conditions Adding...end");
}

 /** Edit TermsAndConditions */
 EditTermsAndConditions(e)
 {
  this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
   console.log("My edit data"+e.key.TermsAndConditions);
   console.log(e);
   this.metaService.PutTermsAndConditions(e.key.TermsAndConditionsID,e.key.Name, e.key.TermsAndConditions,e.key.DefaultTermsAndConditions,e.key.Active,
    e.key.CreatedBy,e.key.CreatedDate,this.userProfile.sub,new Date(Date.now())).subscribe(data => {
      if(data)
      {
        console.log(data);
        notify('Terms updated successfully.','success',2000);
        this.GetmyTermsAndConditions();
      }
      else
      {
        this.GetmyTermsAndConditions();
        notify('This Term  already exists. Please enter different Term.','error',2000);
      }
   }, err => {
    this.GetmyTermsAndConditions();
    notify('Failed to update Terms.','Error',2000);
   });
 }
/** Delete TermsandConditions */
DeleteTermsandConditions(e: any)
{
  console.log("DELETE STARTED");
  console.log(e.data.TermsAndConditionsID);
  this.metaService.DeleteTermsandConditions(e.data.TermsAndConditionsID).subscribe(data => {
    if (data.length>0) {
      console.log(data);
      notify(data, 'error', 6000);
      this.GetmyTermsAndConditions();
    }
    else {
      this.GetmyTermsAndConditions();
      notify('Terms deleted successfully.', 'success', 2000);
    }
   }, err => {
    this.GetmyTermsAndConditions();
    notify('Failed to delete Terms.','Error',2000);
   });
}
AfterTermsandConditionsDelete()
{
  console.log("DELETE SUCCESS");
}

  /* Terms to Division Mapping */
  openTermtoDivisionMappingModal(e) {
    console.log('open' +e.key.NotesID);
    this.DivisionID = null;
    this.TermsToDivisionPopupVisible = true;
    this.MapTermID = e.key.TermsAndConditionsID;
    this.GetTermToDivMapping(e.key.TermsAndConditionsID);
    this.GetAvailableTermDivDropdown(e.key.TermsAndConditionsID);
  } 
  CreateDivTermMapping() {
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    if (this.DivisionID != null) {
      var map = {
        TermsAndConditionsID: this.MapTermID,
        DivisionIDList:  this.TermDivisionByComma,
        CreatedBy: this.userProfile.sub
      };
      this.metaService.CreateTermDivMapping(map).subscribe(data => {
        this.GetTermToDivMapping(this.MapTermID);
        this.GetAvailableTermDivDropdown(this.MapTermID);
        this.DivisionID=null;
        notify('Division has been mapped with Terms.', 'success', 5000);
      },
        err => {
          console.log('Division data fetch failed');
        });
      }
    else {
      notify('Please select Division(s).', 'Error', 5000);
    }
 
  }
  GetTermDivisionBycommaList(e) {
    //this.QuoteEmailsByComma = this.QuoteEmailsByComma + ";" + e.value;
    this.TermDivisionByComma = "";
    e.value.forEach(element => {
      if (this.TermDivisionByComma == "")
        this.TermDivisionByComma = element;
      else
        this.TermDivisionByComma = this.TermDivisionByComma + "," + element;
    });
    if (this.TermDivisionByComma == "")
      this.IsDisabled = true;
    else
      this.IsDisabled = false;
  }
  CloseTermsToDivPopup() {
    this.TermsToDivisionPopupVisible = false;
    this.DivisionID=null;
  }
  GetTermToDivMapping(TermsAndConditionsID) {
    console.log('term' + TermsAndConditionsID);
    this.metaService.GetTermstoDivMapping(TermsAndConditionsID).subscribe(data => {
      this.TermsAndConditionDivisionList = data;
    },
      err => {
        console.log('Terms To Division Mapped data fetch failed');
      });
  }
  GetAvailableTermDivDropdown(TermsAndConditionsID) {
    this.metaService.GetTermDivMapping(TermsAndConditionsID).subscribe(data => {
      this.TermDivisionByComma == "";
      this.DivisionMapList = data;
      this.DivisionMapList.sort(function (a, b) { return (a.Name > b.Name) ? 1 : ((b.Name > a.Name) ? -1 : 0); });
      this.TermDivisionByComma == "";
      this.DvList = [];
      this.DivisionMapList = data;
      if (this.DivisionMapList.length > 0) {
        var emails = this.DivisionMapList[0].Name.split(';');
        emails.forEach(element => {
          this.DvList.push(element);
          if (this.TermDivisionByComma == "")
            this.TermDivisionByComma = element;
          else
            this.TermDivisionByComma = this.TermDivisionByComma + ";" + element;
        });
      }


    },
      err => {
        notify('Tems Divisions Data Fetch Failed.', 'Error', 5000);
      });
  }
  DeleteTermtoDivMap(e) {
    this.metaService.DeleteDivTermMapping(e.key.TermsAndConditionsDivisionMapID).subscribe(data => {
      if (data == "OK") {
        notify('Terms to Division mapping has been deleted successfully.', 'success', 2000);
      } else {
        notify(data, 'error', 6000);
      }
      this.GetTermToDivMapping(this.MapTermID);
      this.GetAvailableTermDivDropdown(this.MapTermID);
    },
      err => {
        notify('Exception occured while deleting.', 'error', 6000);
      });
  }
    //GET FILTERED Terms(Search)
    GetFilterTerms(formData: any): void {
      console.log("status is" + formData.Status);
        this.metaService.GetFilteredTerms(formData.TermName,formData.Description,true).subscribe(data => {
          this.TermsAndConditionList = data;
          this.Terms = data;
          console.log("Load filtered Terms data");
          console.log(data);
        },
          err => {
            notify('Filtered Terms Data Fetch Failed.','Error',2000);
          });
  
      console.log(formData);
      console.log(this.TermsAndConditionList);
    }
/** Clear Search Parameters */
  TermClearParameters() {
    this.GetmyTermsAndConditions();
    this.TermName = null;
    // this.selDivisionList = null;
    this.Description = null;
    this.Status = null;
  }
  logEvent(e:any)
  {
  console.log("e");
  }
}

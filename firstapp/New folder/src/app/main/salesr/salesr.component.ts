import { Component, OnInit } from '@angular/core';
import { MetadataService } from "../../services/metadata/metadata.service";
import { salesRepresentative} from "../../../models/salesRepresentative";
import { States, County  } from '../../../models/Project';
import notify from 'devextreme/ui/notify';
@Component({
  selector   : 'app-salesr',
  templateUrl: './salesr.component.html',
  styleUrls  : ['./salesr.component.css']
})
export class salesrComponent implements OnInit {
  popupVisible = false;
  private salesRepresentativeList : salesRepresentative[]= [];
  FirstName: string;
  LastName: string;
  selDivisionList: string;
  State: string;
  private SalesState: States[] = [];
  private SalesCounty: County[] = [];

  constructor(private metaService: MetadataService) {
    this.getFilteredCunties = this.getFilteredCunties.bind(this);
    //Get Freight Data
    this.metaService.GetsalesRepresentative().subscribe(data => {
     console.log("load sales Representative data");
     console.log(data[0]);
     this.salesRepresentativeList = data;
   },
     err => {
      notify('Sales Representative Data Fetch Failed.','Error',2000);
     });
   
 // //Get states and counties
 this.metaService.GetStates().subscribe(data => {
  console.log("load state data");
  console.log(data);
  this.SalesState = data;
},
  err => {
    notify('Sales Rep state Data Fetch Failed.','Error',2000);
  });

  this.metaService.GetCounty().subscribe(data => {
    console.log("load county data");
    console.log(data);
    this.SalesCounty = data;
  },
    err => {
      notify('Sales Rep county Data Fetch Failed.','Error',2000);
    });
}
setStateValue(rowData: any, value: any): void {
  rowData.CountyID = null;
  (<any>this).defaultSetCellValue(rowData, value);
}
getFilteredCunties(options) {
return {
    store: this.SalesCounty,
    filter: options.data ? ["StateID", "=", options.data.StateID] : null
};
}

  ngOnInit() {
  }

  SetSelectedDivision(m) {
    console.log(m);
  }


AddNewSalesRepresentative(e)
{
  //this.ProjectItemList.push(e.data[0]);
  console.log("Sales Representative Adding...");
  console.log(e.data.SalesRepID + " " + e.data.CountyID + " " + e.data.FirstName + " " + e.data.LastName + " " + e.data.Address);
  this.metaService.PostsalesRepresentative(e.data.CountyID,e.data.FirstName, e.data.LastName, e.data.Address,
    e.data.Address1, e.data.ZIPCode,e.data.PrimaryPhone, e.data.OfficePhone, e.data.OtherPhone, e.data.Fax, e.data.City, e.data.county,
    e.data.CommPct,true,
    "Haritha",new Date(Date.now())).subscribe(data => {
    this.salesRepresentativeList = data;
    notify('Sales Representative saved successfully.','success',2000);
  }, err => {
    notify('Failed to add Sales Representative.','Error',2000);
  });
}

AddNewSalesRepresentativeDone(e)
{
  console.log("Sales Representative Adding done");
}
  /** Edit Sales Representative */
  EditSalesRepresentative(e)
  {
    console.log("My edit data"+e.key.FirstName);
    console.log(e);
    this.metaService.PutSalesRepresentative(e.key.SalesRepID,e.key.CountyID,e.key.FirstName, e.key.LastName, e.key.Address,
      e.key.Address1, e.key.ZIPCode,e.key.PrimaryPhone, e.key.OfficePhone, e.key.OtherPhone, e.key.Fax, e.key.City, e.key.county,
      e.key.CommPct,e.key.Active,
      "Haritha",new Date(Date.now()),"Haritha",new Date(Date.now())).subscribe(data => {
        notify('Sales Representative updated successfully.','success',2000);
    }, err => {
      notify('Failed to update Sales Representative.','Error',2000);
    });
  }
DeleteSalesRepresentative(e: any)
{
  console.log("DELETE STARTED");
  console.log(e.data.SalesRepID);
  this.metaService.DeleteSalesRepresentative(e.data.SalesRepID).subscribe(data => {
    notify('Sales Representative deleted successfully.','success',2000);
   }, err => {
    notify('Failed to delete Sales Representative.','Error',2000);
   });
}

AfterSalesRepresentativeDelete()
{
  console.log("DELETE SUCCESS");
}
/**Clear Search Parameters */
  SalesClearParameters() {
    this.FirstName = null;
    this.LastName = null;
    this.State = null;
  }
  logEvent(e:any)
  {
  console.log("e");
  }
}

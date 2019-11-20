import { Component, OnInit, NgModule, ViewChild, Pipe } from '@angular/core';
import { DxDataGridComponent } from "devextreme-angular";
import { MetadataService } from "../../services/metadata/metadata.service";
import { User, PITUser } from '../../../models/User';
import { Role, Permissions, UserPermissions } from '../../../models/Role';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from "../../services/auth/authentication.service";
import { Project, ProjCategory, ProjSubCategory,ProjectAssembly, States, County, QuoteSearch} from '../../../models/Project';
import { Contract } from '../../../models/Contract';
import { Division } from '../../../models/division';
import { UserService } from '../../services/user/user.service';
import { ProjectService } from '../../services/project/project.service';
import { ProjectCategories, ProjectSubCategories } from '../../../models/projectcatagories';
import { ProductLines, ProductlineDivisions } from '../../../models/ProductLines';
import { PrimcomService } from '../../services/utilities/primcom.service';
import notify from 'devextreme/ui/notify';
import { strictEqual } from 'assert';
@Component({
  selector: 'app-qtsearch',
  templateUrl: './qtsearch.component.html',
  styleUrls: ['./qtsearch.component.css']
})
export class QtsearchComponent implements OnInit {
  MailingSelect: string = "";
  metadataService: any;
  private DivisionList: Division[] = [];
  DivisionName: string[] = [];
  quoteLoading: boolean = false;
  QuoteSearchList: QuoteSearch[];
  isDataFetched: boolean = false;
  Companyname: any;
  QuoteNumber: any;
  Customer: any;
  SearchCustomerType: any;
  CountyByStateDataSource: County[];
  dataGrid: any;
  pagelength: any;
  StateIDs: any;
  Status: any;
  CountyIDs: any;
  SearchCounty: any;
  SearchState: any;
  DivisionID: number;
 UserPermissionsList: UserPermissions;
  pattern: any = /^\(\d{3}\)\ \d{3}-\d{4}$/i;
  project: any;
  IsNoRecord: boolean = false;
  ProjectName: any;
  FromDate: any;
  ToDate: any;
  private CustomerCounty: County[] = [];
  private CustomerState: States[] = [];
  now: Date = new Date();
  MailingStatus: any[] = [{
    "id": "A",
    "text": "All",
  },
  {
    "id": "Y",
    "text": "Emailed"
  },
  {
    "id": "N",
    "text": "Not Emailed"
  }];
  MailingSelectType: string;
  constructor( private metaService: MetadataService, private projectService: ProjectService,)  //Get states and counties
  {
    this.UserPermissionsList = JSON.parse(localStorage.getItem('rolespermissionslist'));
    this.ToDate = new Date();
    this.FromDate = new Date();
    //this.FromDate.setDate(this.FromDate.getDate()-30);

    if((JSON.parse(localStorage.getItem('ProjectInfoURL')) != null && JSON.parse(localStorage.getItem('ProjectInfoURL')).toString().includes("prjdts")) || (JSON.parse(localStorage.getItem('QuoteInfoURL')) != null && JSON.parse(localStorage.getItem('QuoteInfoURL')).toString().includes("prjmng")))
    {
      this.QuoteNumber = JSON.parse(localStorage.getItem('QuoteNumber')) != null ? JSON.parse(localStorage.getItem('QuoteNumber')) : "" ;
      this.Customer = JSON.parse(localStorage.getItem('Customer')) != null ? JSON.parse(localStorage.getItem('Customer')) : "" ;
      this.ProjectName = JSON.parse(localStorage.getItem('ProjectName')) != null ? JSON.parse(localStorage.getItem('ProjectName')) : "" ;
      this.DivisionID = JSON.parse(localStorage.getItem('Division')) != null ? JSON.parse(localStorage.getItem('Division')) : 0 ;
      this.SearchState = JSON.parse(localStorage.getItem('State')) != null ? JSON.parse(localStorage.getItem('State')) : 0 ;
      this.CountyIDs = JSON.parse(localStorage.getItem('County')) != null ? JSON.parse(localStorage.getItem('County')) : 0 ;
      this.FromDate = JSON.parse(localStorage.getItem('LettingFromDate')) != null ? JSON.parse(localStorage.getItem('LettingFromDate')) : "" ;
      this.ToDate = JSON.parse(localStorage.getItem('LettingToDate')) != null ? JSON.parse(localStorage.getItem('LettingToDate')) : "" ;
      this.MailingSelect = JSON.parse(localStorage.getItem('SearchQuoteByMailingList')) != null ? JSON.parse(localStorage.getItem('SearchQuoteByMailingList')) : "A" ;

      var _formData = {
        QuoteNumber: this.QuoteNumber,
        Customer: this.Customer,
        ProjectName: this.ProjectName,
        Division: this.DivisionID,
        State: this.SearchState,
        County: this.CountyIDs,
        FromDate: this.FromDate,
        ToDate: this.ToDate,
        SearchQuoteByMailingList: this.MailingSelect
      }
      console.log(_formData);
      this.GetQuotes(_formData);
    }
    else
    {
      localStorage.removeItem('QuoteNumber');
      localStorage.removeItem('Customer');
      localStorage.removeItem('ProjectName');
      localStorage.removeItem('Division');
      localStorage.removeItem('State');
      localStorage.removeItem('County');
      localStorage.removeItem('LettingFromDate');
      localStorage.removeItem('LettingToDate');
      localStorage.removeItem('SearchQuoteByMailingList');
      
      var formData = {
        ProjectName: '',
        QuoteNumber: '',
        ProjectNumber: '',
        Customer: '',
        ProductLine: '',
        ToDate: new Date(),
        FromDate: this.FromDate.setDate(this.FromDate.getDate()-30),
        SearchQuoteByMailingList: 'A'
      }
      this.GetQuotes(formData);
    }
    this.metaService.GetStates().subscribe(data => {
    this.CustomerState = data;
    this.GetAllDivisions();
  },
    err => {
      console.log('Customer state Data Fetch Failed..');
    });
  this.metaService.GetCounty().subscribe(data => {
    this.CustomerCounty = data;
  },
    err => {
      console.log('Customer county Data Fetch Failed..');
    });

}
GetAllDivisions() {
  this.metaService.GetAllDivisions().subscribe(data => {
    this.DivisionList = data;
    this.DivisionList.forEach((element) => {
      this.DivisionName.push(element.Name);
    });
    if (this.DivisionList !== undefined && this.DivisionList.length > 0) {
    this.DivisionList.sort(function (a, b) { return (a.Name > b.Name) ? 1 : ((b.Name > a.Name) ? -1 : 0); });
    }
  },
    err => {
      console.log('Division Data Fetch Failed..');
    });
}

 /**Clear Search Parameters */
 custClearParameters() {
  this.SearchState = null;
  $('#SearchState').val('');
  this.SearchCounty = null;
  $('#county').val('');
  this.QuoteNumber=null;
  $('#CustName').val('');
  this.Companyname=null;
  $('#Company').val('');
  this.FromDate=null;
  $('#FromDate').val('');
  this.ToDate=null;
  $('#ToDate').val('');
  this.ProjectName=null;
  $('#Project').val('');
  this.Companyname=null;
  $('#Customer').val('');
  this.Customer = null;
  this.DivisionID=null;
  $('#divisions').val('');
 
  this.MailingSelect = null;

  this.CountyIDs = null;
  this.QuoteNumber=null;
  this.Companyname=null;
  this.FromDate=null;
  this.ToDate=null;
  this.Status = null;
  this.StateIDs = null;
  var ds = {
    requireTotalCount: true,
    searchExpr: undefined,
    searchOperation: "contains",
    searchValue: null,
    skip: 0,
    sort: null,
    take: this.pagelength,
    userData: {},
  }
  //this.dataGrid.instance.refresh();
  this.ToDate = new Date();
  this.FromDate = new Date();
  var formData = {
    QuoteNumber: '',
    ProjectNumber: '',
    ProductLine: '',
    ToDate: new Date(),
    FromDate: this.FromDate.setDate(this.FromDate.getDate()-30)
  }
  this.GetQuotes(formData);
}
  Countyselectedvalue(e) {
    $('#hidCountyID').val(e.value);
  }

  Stateselectedvalue(e) {
    this.SearchState = e.value;
    $('#hidStateID').val(e.value);
    this.CountyByStateDataSource = this.CustomerCounty.filter(e => e.StateID == this.SearchState);
  }

  GetQuotes(formData: any): void {
    console.log(formData);
    var FromDate = "";
    var ToDate = "";
    if (typeof(formData.FromDate) != "undefined" && formData.FromDate != null) 
    {
      if(formData.FromDate.toString().length > 0 && formData.FromDate.toString().indexOf('/') == -1)
      {
        var datePipe = new DatePipe(formData.FromDate);
        if (formData.FromDate)
          FromDate = datePipe.transform(formData.FromDate, 'MM/dd/yyyy');
      }
      else
        FromDate = formData.FromDate;
    }
    if(typeof(formData.ToDate) != "undefined" && formData.ToDate != null)
    {
      if(formData.ToDate.toString().length > 0 && formData.ToDate.toString().indexOf('/') == -1)
      {
        var datePipe2 = new DatePipe(formData.ToDate);
        if (formData.ToDate)
           ToDate = datePipe2.transform(formData.ToDate, 'MM/dd/yyyy');
      }
      else
        ToDate = formData.ToDate;
    }
    console.log(formData.QuoteNumber);
    console.log(formData.ProjectName);
    // var datePipe = new DatePipe(formData.FromDate);
    // console.log(datePipe.transform(formData.FromDate, 'MM/dd/yyyy'));
    // if(formData.QuoteNumber == undefined)
    //   formData.QuoteNumber = '';
    // if(formData.ProjectName == undefined)
    //   formData.ProjectName = '';
      if(typeof(formData.ProjectName) === "undefined" || formData.ProjectName === null && formData.ProjectName === "null")
        formData.ProjectName = "";
        if(typeof(formData.QuoteNumber) === "undefined" || formData.QuoteNumber === null && formData.QuoteNumber === "null")
        formData.QuoteNumber = "";
        if(typeof(formData.Customer) === undefined || formData.Customer === null && formData.Customer === "null")
        formData.Customer = "";

      if(formData.Customer == undefined || formData.Customer == null || formData.Customer == "null")
        formData.Customer = '';
      if(formData.Division == undefined || formData.Division == null || formData.Division == "null")
        formData.Division = '';
      if(formData.State == undefined || formData.State == null || formData.State == "null")
        formData.State = '';
      if(formData.County == undefined || formData.County == null || formData.County == "null")
        formData.County = '';

    // var FromDate = "";
    // if (formData.FromDate)
    //   FromDate = datePipe.transform(formData.FromDate, 'MM/dd/yyyy');
    // var ToDate = "";
    // if (formData.ToDate)
    //   var ToDate = datePipe.transform(formData.ToDate, 'MM/dd/yyyy');
    
    this.quoteLoading = true;
 
    localStorage.setItem('QuoteNumber', JSON.stringify(formData.QuoteNumber) != null && typeof(formData.QuoteNumber) != "undefined" ? JSON.stringify(formData.QuoteNumber) : "");
    localStorage.setItem('Customer', JSON.stringify(formData.Customer) != null && typeof(formData.Customer) != "undefined" ? JSON.stringify(formData.Customer) : "");
    localStorage.setItem('ProjectName', JSON.stringify(formData.ProjectName) != null && typeof(formData.ProjectName) != "undefined" ? JSON.stringify(formData.ProjectName) : "");
    localStorage.setItem('Division', JSON.stringify(formData.Division) != null && typeof(formData.Division) != "undefined" ? JSON.stringify(formData.Division) : "0");
    localStorage.setItem('State', JSON.stringify(formData.State) != null && typeof(formData.State) != "undefined" ? JSON.stringify(formData.State) : "0");
    localStorage.setItem('County', JSON.stringify(formData.County) != null && typeof(formData.County) != "undefined" ? JSON.stringify(formData.County) : "0");
    localStorage.setItem('LettingFromDate', JSON.stringify(FromDate) != null && typeof(FromDate) != "undefined" ? JSON.stringify(FromDate) : null);
    localStorage.setItem('LettingToDate', JSON.stringify(ToDate) != null && typeof(ToDate) != "undefined" ? JSON.stringify(ToDate) : null);
    localStorage.setItem('SearchQuoteByMailingList', JSON.stringify(formData.SearchQuoteByMailingList) != null && typeof(formData.SearchQuoteByMailingList) != "undefined" ? JSON.stringify(formData.SearchQuoteByMailingList) : null);

      this.projectService.GetFilteredQuotes(formData.QuoteNumber,formData.Customer,formData.ProjectName, formData.Division,formData.State,formData.County,FromDate, ToDate, formData.SearchQuoteByMailingList).subscribe(data => {
        this.QuoteSearchList = data;
        console.log(this.QuoteSearchList);
        this.isDataFetched = true;
      },
        err => {
          console.log('Filtered quotes Data Fetch Failed..');
        });
      this.quoteLoading = false;
  }
  MailingSelection(e)
  {
    this.MailingSelectType = e.value;
    //$('#hidQuoteList').val(e.value);
  }
  ngOnInit() {
  }

}
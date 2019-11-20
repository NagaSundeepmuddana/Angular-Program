import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { QuotesbyContactReport } from '../../../models/QuotesbyContactReport';
import { Quotehistorybyitems } from '../../../models/quotehistorybyItems';
import { MetadataService } from '../../services/metadata/metadata.service';
import notify from 'devextreme/ui/notify';

import { Project, ProductLineQuote, ProjCategory, ProjSubCategory, Item, ItemAssemblySearchResult, AssemblyList, ProjectItem, ProjectAssembly, QuoteCustomerInfo, DivisionsItems, DivisionNotes, DivisionTermsNConditions, AssociateTermsNConditions, EmailProposalContacts } from '../../../models/Project';

import { QuoteReport } from '../../../models/QuoteReport';
import { UserService } from '../../services/user/user.service';
import { User,PITUser } from '../../../models/User';
import { AuthenticationService } from "../../services/auth/authentication.service";
import { ProductLines } from '../../../models/ProductLines';
import CustomStore from 'devextreme/data/custom_store';
import 'rxjs/add/operator/toPromise';
import { ProjectService } from '../../services/project/project.service';
import { Http, HttpModule } from '@angular/http';
import { QuotesItems, QuotesTerms, QuotesNotes, Quote,ItemQuotesearch ,QuoteItemUpdate } from '../../../models/Quotes';
import { EndPointsConfig } from "../../../models/endpointsconfig";
import { DxDataGridComponent, DxDataGridModule, DxSelectBoxModule } from 'devextreme-angular';
import 'devextreme/data/odata/store';
import { Division } from "../../../models/division";
import { DatePipe } from '@angular/common';
import { Contract } from '../../../models/Contract';
import { States, County } from '../../../models/Project';

@Component({
  selector: 'app-qht',
  templateUrl: './qht.component.html',
  styleUrls: ['./qht.component.css']
})
export class QhtComponent implements OnInit {
  QuoteType: any[] = [{
    "id": "A",
    "text": "All Quotes",
  },
  {
    "id": "M",
    "text": "Master Quotes"
  },
  {
    "id": "C",
    "text": "Customer Quotes"
  }];QuoteSelectType: string="";
  @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
  private QuoteReportList: QuoteReport[] = [];
  private Quotehistorybyitems: Quotehistorybyitems[] = [];
  private QuotesbyContactReportList: QuotesbyContactReport[] = [];
  AssemblyList: AssemblyList[];
  userProfile: any;
  CustomerID: number;
  ProjectID: number;
  QuoteID: number;
  IsNoRecord: boolean = false;
  saleAmountHeaderFilter: any;
  OverRideFlag: string;
  itemPopupVisible: boolean = false;
  flag: boolean = false;
  applyFilterTypes: any;
  currentFilter: any;
  showFilterRow: boolean;
  private CustomerState: States[] = [];
  showHeaderFilter: boolean;
  IsDisabled: boolean = true;
  DivisionByComma: string;
  DivisionByComma2: string;
  IsItems: boolean = true;
  DvList: any;
  CustomerList1: ItemQuotesearch[] = [];
  FilteredCustomerList1: ItemQuotesearch[] = [];
  private GetProductLineName: ProductLines[] = [];
  private GetDivisionList: Division[] = [];
  private GetProdLinesByDiv: ProductLines[] = [];
  private DivisionID: number;
  private ProductLineID: number;
  private CustomerCounty: County[] = [];
  users: User[];
  PITUserList: PITUser[];
  private pagelength: number;
  dataSource: any = {};
  private SearchState: string;
  private SearchCounty:string;
  QuoteFrom: Date;
  IsAssembies: boolean = false;
  CountyByStateDataSource: any;
  QuoteTo: Date;
  ContractTypeID: number;
  BusinessManager: string = "";
  EditQuoteStatus:any;  
  LostCustomer: number = 0;
  ItemList: ItemAssemblySearchResult[] = [];
   AwardQuoteStatus: any[] = [{
    "id": 1,
    "Name": "Awarded",
  },
  {
    "id": 2,
    "Name": "Canceled"
  },
  {
    "id": 3,
    "Name": "Lost"
  }];
  public ContractType: Contract[] = [];
  CurrencyFormatter(cellInfo) {
    if (cellInfo.value == null)
      cellInfo.value = 0;
    if(cellInfo.valueText == "")
      return "";
    return "$" + cellInfo.value.toFixed(2).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,")
  }
  CurrencyFormatter1(cellInfo) {
    if (cellInfo.value == null)
      cellInfo.value = 0;
    if(cellInfo.valueText == "")
      return "";
    return "" + cellInfo.value.toFixed(2).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g,)
  }
  DecimalFormatter(cellInfo) {
    if (cellInfo.value == null)
      cellInfo.value = 0;
    if(cellInfo.valueText == "")
      return "";
    return cellInfo.value.toFixed(1).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,")+"%"
  }

  constructor( @Inject(Http) http: Http, private metaService: MetadataService, private userService: UserService, public auth: AuthenticationService,private projectService: ProjectService,) {

    this.userProfile = this.auth.useProfile;   
    this.GetAllProductline();
    this.GetAllDivisions();
    this.GetContractTypes();
    this.GetAllStates();
    this.metaService.GetCounty().subscribe(data => {
      console.log('totlcounty',data);
      this.CustomerCounty = data;
    },
      err => {
        console.log('Customer county Data Fetch Failed..');
      });
    //this.GetAllCounties();
    this.GetBusinessManager();
    this.dataSource.store = new CustomStore({
      load: function (loadOptions: any) {
        var params = '?';
        var Divisionby2 = '';
        if (this.DivisionByComma2)
        Divisionby2 = this.DivisionByComma2;
        var customerName = "";
       /* if($('#SearchByContact').val().toString().indexOf('_') == -1)
         customerName = $('#SearchByContact').val().toString().replace("&","%26");
        params += 'skip=' + loadOptions.skip || 0;
        params += '&take=' + loadOptions.take || 12;
        params += '&ProductLine=' + $('#hidProductlineID').val();
        params += '&DivisionID=' + $('#hidDivisionID').val();
        params += '&ContractTypeID=' + $('#hidContractTypeID').val();
        //params += '&ControlNumber=' + $('#SearchByContNumber').val();
        params += '&ProjectName=' + $('#SearchByProjName').val();
        params += '&QuoteBeginDate=' + $('#hidStartDate').val();
        params += '&QuoteEndDate=' + $('#hidEndDate').val();
        params += '&StateID=' + $('#hidStateID').val();
        params += '&IsMasterQuote=' + $('#hidQuoteList').val();
        params += '&Contact=' + customerName;
        params +='&BusinessManager='+$('#BusinessManager').val();
        params +='&Status='+$('#hidEditQuoteStatus').val(); */
        //params += '&IsMasterQuote=' + $('#MasterQuote').is(':checked');
        if(true)
        params += '&ProductLine=' + $('#hidProductlineID').val();
        params += '&DivisionID=' + $('#hidDivisionID').val();
        params += '&ContractTypeID=' + $('#hidContractTypeID').val();
        params += '&ControlNumber=' + $('#SearchByContNumber').val();
        params += '&ProjectName=' + $('#SearchByProjName').val();
        params += '&QuoteBeginDate=' + $('#hidStartDate').val();
        params += '&QuoteEndDate=' + $('#hidEndDate').val();
        params += '&StateID=' + $('#hidStateID').val();
        params += '&CountyId=' + $('#hidCountyID').val();
        params += '&ItemParam=' + $('#addItemsInputField1').val();

        console.log(JSON.stringify($('#hidDivisionID').val()));

        localStorage.setItem('qr_ProductLine', JSON.stringify($('#hidProductlineID').val()) != null && typeof($('#hidProductlineID').val()) != "undefined" ? JSON.stringify($('#hidProductlineID').val()) : null);
        localStorage.setItem('qr_Division', JSON.stringify($('#hidDivisionID').val()) != null && typeof($('#hidDivisionID').val()) != "undefined" ? JSON.stringify($('#hidDivisionID').val()) : null);
        localStorage.setItem('qr_ContractType', JSON.stringify($('#hidContractTypeID').val()) != null && typeof($('#hidContractTypeID').val()) != "undefined" ? JSON.stringify($('#hidContractTypeID').val()) : null);
        localStorage.setItem('qr_ControlNumber',JSON.stringify($('#SearchByContNumber').val()!=null && typeof('#SearchByContNumber').valueOf())!="undefined"? JSON.stringify($('#SearchByContNumber').val()):null);
        localStorage.setItem('qr_ProjectName', JSON.stringify($('#SearchByProjName').val()) != null && typeof($('#SearchByProjName').val()) != "undefined" ? JSON.stringify($('#SearchByProjName').val()) : null);
        localStorage.setItem('qr_QuoteBeginDate', JSON.stringify($('#hidStartDate').val()) != null && typeof($('#hidStartDate').val()) != "undefined" ? JSON.stringify($('#hidStartDate').val()) : null);
        localStorage.setItem('qr_QuoteEndDate', JSON.stringify($('#hidEndDate').val()) != null && typeof($('#hidEndDate').val()) != "undefined" ? JSON.stringify($('#hidEndDate').val()) : null);
        localStorage.setItem('qr_StateID', JSON.stringify($('#hidStateID').val()) != null && typeof($('#hidStateID').val()) != "undefined" ? JSON.stringify($('#hidStateID').val()) : null);
        localStorage.setItem('qr_CountyID', JSON.stringify($('#hidCountyID').val()) != null && typeof($('#hidCountyID').val()) != "undefined" ? JSON.stringify($('#hidCountyID').val()) : null);
        localStorage.setItem('qr_ItemParam', JSON.stringify($('#addItemsInputField1').val()) != null && typeof($('#addItemsInputField1').val()) != "undefined" ? JSON.stringify($('#addItemsInputField1').val()) : null);
    
        /*  localStorage.setItem('qr_IsMasterQuote', JSON.stringify($('#hidQuoteList').val()) != null && typeof($('#hidQuoteList').val()) != "undefined" ? JSON.stringify($('#hidQuoteList').val()) : null);
        localStorage.setItem('qr_Contact', JSON.stringify($('#SearchByContact').val()) != null && typeof($('#SearchByContact').val()) != "undefined" ? JSON.stringify($('#SearchByContact').val()) : null);
         localStorage.setItem('qr_BusinessManager', JSON.stringify($('#BusinessManager').val()) != null && typeof($('#BusinessManager').val()) != "undefined" ? JSON.stringify($('#BusinessManager').val()) : null);
        localStorage.setItem('qr_Status', JSON.stringify($('#hidEditQuoteStatus').val()) != null && typeof($('#hidEditQuoteStatus').val()) != "undefined" ? JSON.stringify($('#hidEditQuoteStatus').val()) : null);
         */
        if (loadOptions.sort) {
          console.log(loadOptions.divids);
          params += '&orderby=' + loadOptions.sort[0].selector;
          if (loadOptions.sort[0].desc) {
            params += ' desc';
          }
        }
        return http.get(EndPointsConfig.HostName + EndPointsConfig.QuotesHistoryItemsReportEndPoint.replace('/', '') + params)
          .toPromise()
          .then(response => {
            var json = response.json();

            return {
              data: json.items,
              totalCount: json.totalCount
            }
          })
          .catch(error => { throw 'Data Loading Error' });
      }
    });
  }
   /** Get Quote Report data */
   GetAllQuoteReports() {
    this.metaService.GetAllQuoteReport().subscribe(data => {
      console.log("load Quote Report data");
      console.log(data[0]);
      this.QuoteReportList = data;
    },
      err => {
        console.log('Quote Report Data Fetch Failed.');
      });
  }
  GetAllQuotesbyContactReports() {
    this.metaService.GetAllQuotesbyContactReport().subscribe(data => {
      console.log("load Quotes by Contact Report data");
      console.log(data[0]);
      this.QuotesbyContactReportList = data;
    },
      err => {
        console.log('Quotes by Contact Report Data Fetch Failed..');
      });
  }

  SearchQuoteReport() {
    console.log(this.DivisionByComma2)
    var ds = {
      requireTotalCount: true,
      searchExpr: undefined,
      searchOperation: "contains",
      searchValue: null,
      skip: 0,
      sort: null,
      take: this.pagelength,
      DivisionByComma2: this.DivisionByComma2,
      userData: {}
    }
    this.dataGrid.instance.refresh();
  }
  ClearFilters() { 
    
    localStorage.removeItem('qr_ProductLine');
    localStorage.removeItem('qr_Division');
    localStorage.removeItem('qr_ContractType');
    localStorage.removeItem('qr_ControlNumber');
    localStorage.removeItem('qr_ProjectName');
    localStorage.removeItem('qr_QuoteBeginDate');
    localStorage.removeItem('qr_QuoteEndDate');
    localStorage.removeItem('qr_StateID');
    localStorage.removeItem('qr_ItemParam');/* 
    localStorage.removeItem('qr_IsMasterQuote');
    localStorage.removeItem('qr_Contact');
    localStorage.removeItem('qr_BusinessManager');
    localStorage.removeItem('qr_Status'); */

    $('#searchDivision').val('');
    $('#hidContractTypeID').val('0');
    $('#SearchByContNumber').val(''),
    $('#SearchByProjName').val('');
    $('#LettingFrom').val('');
    $('#LettingTo').val('');
    $('#hidStateID').val('');
    $('#addItemsInputField1').val('');
    $('#hidDivisionID').val('');
    $('#ProductLineID').val('');
    $('#hidProductlineID').val('');
    $('#MasterQuote').prop('checked',false);
    $('#SearchByContact').val('');
    $('#BusinessManager').val('');
    $('#hidEditQuoteStatus').val('');
    this.BusinessManager=null;
    this.EditQuoteStatus=null;
    this.DivisionID = 0;
    this.ProductLineID = null;
    this.QuoteFrom = null;
    this.SearchState = null;
    this.SearchCounty = null;
    this.QuoteTo = null;
    this.ContractTypeID = 0;
    this.QuoteSelectType = "A";
    var ds = {
      requireTotalCount: true,
      searchExpr: undefined,
      searchOperation: "contains",
      searchValue: null,
      skip: 0,
      sort: null,
      take: 10,
      userData: {}
    }
    this.dataGrid.instance.refresh();
  }
  ExportGridData() {
    var searchparams = {
      ProductLineID: $('#hidProductlineID').val(),
      DivisionID: $('#hidDivisionID').val(),
      //ControlNumber: $('#SearchByContNumber').val(),      
      ProjectName: $('#SearchByProjName').val(),
      QuoteBeginDate: $('#hidStartDate').val(),
      QuoteEndDate: $('#hidEndDate').val(),
      ContractTypeID: $('#hidContractTypeID').val(),
      StateID: $('#hidStateID').val(),
      Contact: $('#SearchByContact').val(),
      BusinessManager:$('#BusinessManager').val(),
      IsMasterQuote:$('#hidQuoteList').val()
    }
    this.metaService.ExportQuoteReport(searchparams).subscribe(data => {
      if (data) {
        window.open(data, "_blank");
      } else {
        notify('Failed to export quote report.', 'error', 2000);
      }

    },
      err => {
        console.log('Quote Report Data Fetch Failed..');
      });
  }
  PDFGridData() {
  var _ProductLine = JSON.parse(localStorage.getItem('qr_ProductLine')) != null && localStorage.getItem('qr_ProductLine') != "null" ? JSON.parse(localStorage.getItem('qr_ProductLine')) : null ;
  var _Division = JSON.parse(localStorage.getItem('qr_Division')) != null && localStorage.getItem('qr_Division') != "null" ? JSON.parse(localStorage.getItem('qr_Division')) : null ;
  var _ControlNumber = JSON.parse(localStorage.getItem('qr_ControlNumber')) != null && localStorage.getItem('qr_ControlNumber') != "null" ? JSON.parse(localStorage.getItem('qr_ControlNumber')) : null ;    
  var _ProjectName = JSON.parse(localStorage.getItem('qr_ProjectName')) != null && localStorage.getItem('qr_ProjectName') != "null" ? JSON.parse(localStorage.getItem('qr_ProjectName')) : null ;    
  var _QuoteBeginDate = JSON.parse(localStorage.getItem('qr_QuoteBeginDate')) != null && localStorage.getItem('qr_QuoteBeginDate') != "null" ? JSON.parse(localStorage.getItem('qr_QuoteBeginDate')) : null ;
  var _QuoteEndDate = JSON.parse(localStorage.getItem('qr_QuoteEndDate')) != null && localStorage.getItem('qr_QuoteEndDate') != "null" ? JSON.parse(localStorage.getItem('qr_QuoteEndDate')) : null ; 
  var _ContractType = JSON.parse(localStorage.getItem('qr_ContractType')) != null && localStorage.getItem('qr_ContractType') != "null" ? JSON.parse(localStorage.getItem('qr_ContractType')) : null ;
  var _customerName = JSON.parse(localStorage.getItem('qr_Contact')) != null && localStorage.getItem('qr_Contact') != "null" ? JSON.parse(localStorage.getItem('qr_Contact')) : null ;
  var _state = JSON.parse(localStorage.getItem('qr_StateID')) != null && localStorage.getItem('qr_StateID') != "null" ? JSON.parse(localStorage.getItem('qr_StateID')) : null ;  
  var _BusinessManager = JSON.parse(localStorage.getItem('qr_BusinessManager')) != null && localStorage.getItem('qr_BusinessManager') != "null" ? JSON.parse(localStorage.getItem('qr_BusinessManager')) : null;
  var _IsMasterQuote = JSON.parse(localStorage.getItem('qr_IsMasterQuote')) != null && localStorage.getItem('qr_IsMasterQuote') != "null" ? JSON.parse(localStorage.getItem('qr_IsMasterQuote')) : null ;  
  var _Status = JSON.parse(localStorage.getItem('qr_Status')) != null && localStorage.getItem('qr_Status') != "null" ? JSON.parse(localStorage.getItem('qr_Status')) : null ;
  
  var _searchparams = {
    ProductLineID: _ProductLine,
    DivisionID:_Division,
    ControlNumber:_ControlNumber,
    ProjectName: _ProjectName,
    QuoteBeginDate: _QuoteBeginDate,
    QuoteEndDate:_QuoteEndDate,
    ContractTypeID: _ContractType,
    Contact:_customerName,
    StateID: _state,
    BusinessManager:_BusinessManager,
    IsMasterQuote:_IsMasterQuote,
    Status:_Status
  }
    var searchparams = {
      ProductLineID: $('#hidProductlineID').val(),
      DivisionID: $('#hidDivisionID').val(),
      ControlNumber: $('#SearchByContNumber').val(),
      ProjectName: $('#SearchByProjName').val(),
      QuoteBeginDate: $('#hidStartDate').val(),
      QuoteEndDate: $('#hidEndDate').val(),
      ContractTypeID: $('#hidContractTypeID').val(),
      Contact: $('#SearchByContact').val(),
      StateID: $('#hidStateID').val(),
      BusinessManager:$('#BusinessManager').val(),
      IsMasterQuote:$('#hidQuoteList').val(),
      Status:$('#hidEditQuoteStatus').val()
    }
    this.metaService.PDFQuoteReport(_searchparams).subscribe(data => {
      if (data) {
        window.open(data, "_blank");
      } else {
        notify('Failed to Generate quote report.', 'error', 2000);
      }

    },
      err => {
        console.log('Quote Report Data Fetch Failed..');
      });
  }

  GetAllProductline() {
    this.metaService.GetProductLines().subscribe(data => {
      console.log("load ProductLine data");
      console.log(data);
      this.GetProductLineName = data;
      this.GetProductLineName.sort(function (a, b) { return (a.Name > b.Name) ? 1 : ((b.Name > a.Name) ? -1 : 0); });
    },
      err => {
        notify('ProductLine Data Fetch Failed.', 'Error', 2000);
      });
  }
  GetAllDivisions() {
    this.metaService.GetAllDivisions().subscribe(data => {
      console.log("load Division data");
      console.log(data[0]);
      this.GetDivisionList = data;
      this.GetDivisionList.sort(function (a, b) { return (a.Name > b.Name) ? 1 : ((b.Name > a.Name) ? -1 : 0); });
    },
      err => {
        console.log('Division Data Fetch Failed..');
      });
  }
  GetBusinessManager() {
    this.userService.GetBusinessManager().subscribe(data => {
      this.userService.PITUserList = data;
      this.PITUserList = data;
      localStorage.setItem("UserList", JSON.stringify(this.PITUserList));
      if (this.users !== undefined && this.users.length > 0) {
      this.users.sort(function (a, b) { return (a.FirstName > b.FirstName) ? 1 : ((b.FirstName > a.FirstName) ? -1 : 0); });
      }
    }, err => {
      console.log('Get users data failed..');
    });
  }
  GetContractTypes() {
    this.metaService.GetContractType().subscribe(data => {
      this.ContractType = data;
    },
      err => {
        console.log('Contract Type Data Fetch Failed..');
      });
  }
  DivisionChangeEvent(e) {
    console.log(e);
    this.DivisionByComma = "";
    e.value.forEach(element => {
      if (this.DivisionByComma == "")
        this.DivisionByComma = element;
      else {
        this.DivisionByComma = this.DivisionByComma + "," + element;
        this.DivisionByComma2 = this.DivisionByComma;
        console.log(element);
          $('#hidDivisionID').val(e.value);
      }
    });
    $('#hidDivisionID').val(e.value);
   /*  $('#hidDivisionID').val(e.value);
    this.GetProdLinesByDiv = this.GetProductLineName.filter(m => m.DivisionID == e.value); */
  }
  GetAllStates() {
    this.metaService.GetStates().subscribe(data => {
      console.log("load state data");
      console.log(data);
      this.CustomerState = data;
      this.CustomerState.sort(function (a, b) { return (a.Name > b.Name) ? 1 : ((b.Name > a.Name) ? -1 : 0); });
    },
      err => {
        console.log('state Data Fetch Failed..');
      });
  }
  Stateselectedvalue(e) {
    console.log('county',e);
    this.SearchState = e.value;
    $('#hidStateID').val(e.value);
    this.CountyByStateDataSource = this.CustomerCounty.filter(e => e.StateID == this.SearchState);
    console.log('check',this.CountyByStateDataSource);
  }
  Countyselectedvalue(e) {
    $('#hidCountyID').val(e.value);
  }
  // GetAllCounties() {
  //   this.metaService.GetCounty().subscribe(data => {
  //     console.log("load state data");
  //     console.log(data);
  //     this.CustomerCounty = data;
  //     this.CustomerCounty.sort(function (a, b) { return (a.Name > b.Name) ? 1 : ((b.Name > a.Name) ? -1 : 0); });
  //   },
  //     err => {
  //       console.log('state Data Fetch Failed..');
  //     });
  // }
  ProductLineChangeEvent(e) {
    console.log(e);
    this.DivisionByComma = "";
    e.value.forEach(element => {
      if (this.DivisionByComma == "")
        this.DivisionByComma = element;
      else {
        this.DivisionByComma = this.DivisionByComma + "," + element;
        this.DivisionByComma2 = this.DivisionByComma;
        console.log(element);
          $('#hidProductlineID').val(e.value);
      }
    });
    $('#hidProductlineID').val(e.value);
  }
  ContractTypeChangeEvent(e) {
    console.log(e);
    $('#hidContractTypeID').val(e.value);
  }
  QuotesFromChangeEvent(e) {
    var datePipe = new DatePipe(e.value);
    $('#hidStartDate').val(datePipe.transform(e.value, 'MM/dd/yyyy'));
  }
  QuotesToChangeEvent(e) {
    var datePipe = new DatePipe(e.value);
    $('#hidEndDate').val(datePipe.transform(e.value, 'MM/dd/yyyy'));
  }
  BusinessManagerChangeEvent(e) {
    console.log(e);
    $('#BusinessManager').val(e.value);
  }
  EditQuoteStatusChangeEvent(e) {
    console.log(e);
    // this.AwardQuoteStatus = e.value;
    $('#hidEditQuoteStatus').val(e.value);
   
  }
  GetAllCustomers1() {
    this.CustomerList1 = [];
    this.FilteredCustomerList1 = [];
    var SearchParam = '';
    SearchParam = $('#addItemsInputField1').val().toString();
    if (SearchParam.length > 2) {
      this.projectService.GetCustomers1(SearchParam).subscribe(data => {
        this.CustomerList1 = data;
        this.FilteredCustomerList1 = this.CustomerList1;
        console.log(data);
      }, err => {
        console.log('Get Customers data failed..');
      });
    } else {
      this.CustomerList1 = [];
      this.FilteredCustomerList1 = [];
    }
  }
  SelectCust(e) {
    console.log( 'sundeep====',e);
   // this.LostCustomer = e.CustomerID;
   this.Quotehistorybyitems=e.item
    $('#addItemsInputField1').val(e.Name);
    this.flag = false;
    this.CustomerList1 = [];
    this.FilteredCustomerList1 = [];
  }
  CloseMatAjax1(e) {
    if (e.target.classList.contains('serachItems')) {
      this.flag = true;
    }
    else {
      this.flag = false;
      this.CustomerList1 = [];
      this.FilteredCustomerList1 = [];
    }

  }

  OpenItemsModal(e: any) {
    //this.GetItemsByProductLine(this.ProductLineID);
    this.IsItems = true;
    this.IsAssembies = false;
    this.itemPopupVisible = true;
    this.flag = false;
  }

  SearchItems(e) {
    console.log('sund',e);
    if (e.length == 3 || e.length > 3) {
      if (this.IsItems == true) {
        this.projectService.GetItemsBySearchParam("Items", this.ProjectID, this.QuoteID, this.ProductLineID, this.DivisionID, e).subscribe(data => {
          this.ItemList = data;
          if (this.ItemList.length == 0)
            this.IsNoRecord = true;
          else
            this.IsNoRecord = false;
          this.flag = true;
          this.IsItems = true;
          this.IsAssembies = false;
        },
          err => {
            console.log('Items Data Fetch Failed..');
          });
      }
      else {
        this.projectService.GetAssembliesBySearchParam(e, e, e, e, true).subscribe(data => {
          this.AssemblyList = data;
          this.flag = true;
          this.IsItems = false;
          this.IsAssembies = true;
        },
          err => {
            console.log('Division Data Fetch Failed..');
          });
      }
    }
  }

  QuoteSelection(e)
  {
    this.QuoteSelectType = e.value;
    $('#hidQuoteList').val(e.value);
  }
  ngOnInit() {
  }

}

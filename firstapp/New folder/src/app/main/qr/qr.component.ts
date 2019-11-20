import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { QuotesbyContactReport } from '../../../models/QuotesbyContactReport';
import { QuoteReport } from '../../../models/QuoteReport';
import { MetadataService } from '../../services/metadata/metadata.service';
import notify from 'devextreme/ui/notify';
import { UserService } from '../../services/user/user.service';
import { User,PITUser } from '../../../models/User';
import { AuthenticationService } from "../../services/auth/authentication.service";
import { ProductLines } from '../../../models/ProductLines';
import CustomStore from 'devextreme/data/custom_store';
import 'rxjs/add/operator/toPromise';
import { Http, HttpModule } from '@angular/http';
import { EndPointsConfig } from "../../../models/endpointsconfig";
import { DxDataGridComponent, DxDataGridModule, DxSelectBoxModule } from 'devextreme-angular';
import 'devextreme/data/odata/store';
import { Division } from "../../../models/division";
import { DatePipe } from '@angular/common';
import { Contract } from '../../../models/Contract';
import { States, County } from '../../../models/Project';

@Component({
  selector: 'app-qr',
  templateUrl: './qr.component.html',
  styleUrls: ['./qr.component.css']
})
export class qrComponent implements OnInit {
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
  }];
  QuoteSelectType: string="";
  @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
  private QuoteReportList: QuoteReport[] = [];
  private QuotesbyContactReportList: QuotesbyContactReport[] = [];
  userProfile: any;
  saleAmountHeaderFilter: any;
  applyFilterTypes: any;
  currentFilter: any;
  showFilterRow: boolean;
  private CustomerState: States[] = [];
  showHeaderFilter: boolean;
  IsDisabled: boolean = true;
  DivisionByComma: string;
  DivisionByComma2: string;
  DvList: any;
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
  QuoteFrom: Date;
  CountyByStateDataSource: any;
  QuoteTo: Date;
  ContractTypeID: number;
  BusinessManager: string = "";
  EditQuoteStatus:any;
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
  DecimalFormatter(cellInfo) {
    if (cellInfo.value == null)
      cellInfo.value = 0;
    if(cellInfo.valueText == "")
      return "";
    return cellInfo.value.toFixed(1).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,")+"%"
  }
  constructor( @Inject(Http) http: Http, private metaService: MetadataService, private userService: UserService, public auth: AuthenticationService) {

    this.userProfile = this.auth.useProfile;
    //this.GetAllQuoteReports();
    this.GetAllProductline();
    this.GetAllDivisions();
    this.GetContractTypes();
    this.GetAllStates();
    this.GetBusinessManager();
    this.dataSource.store = new CustomStore({
      load: function (loadOptions: any) {
        var params = '?';
        var Divisionby2 = '';
        if (this.DivisionByComma2)
        Divisionby2 = this.DivisionByComma2;
        var customerName = "";
        if($('#SearchByContact').val().toString().indexOf('_') == -1)
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
        params +='&Status='+$('#hidEditQuoteStatus').val();
        //params += '&IsMasterQuote=' + $('#MasterQuote').is(':checked');
        console.log(JSON.stringify($('#hidDivisionID').val()));

        localStorage.setItem('qr_ProductLine', JSON.stringify($('#hidProductlineID').val()) != null && typeof($('#hidProductlineID').val()) != "undefined" ? JSON.stringify($('#hidProductlineID').val()) : null);
        localStorage.setItem('qr_Division', JSON.stringify($('#hidDivisionID').val()) != null && typeof($('#hidDivisionID').val()) != "undefined" ? JSON.stringify($('#hidDivisionID').val()) : null);
        localStorage.setItem('qr_ContractType', JSON.stringify($('#hidContractTypeID').val()) != null && typeof($('#hidContractTypeID').val()) != "undefined" ? JSON.stringify($('#hidContractTypeID').val()) : null);
        //localStorage.setItem('qr_ControlNumber',JSON.stringify($('#SearchByContNumber').val()!=null && typeof('#SearchByContNumber').valueOf())!="undefined"? JSON.stringify($('#SearchByContNumber').val()):null);
        localStorage.setItem('qr_ProjectName', JSON.stringify($('#SearchByProjName').val()) != null && typeof($('#SearchByProjName').val()) != "undefined" ? JSON.stringify($('#SearchByProjName').val()) : null);
        localStorage.setItem('qr_QuoteBeginDate', JSON.stringify($('#hidStartDate').val()) != null && typeof($('#hidStartDate').val()) != "undefined" ? JSON.stringify($('#hidStartDate').val()) : null);
        localStorage.setItem('qr_QuoteEndDate', JSON.stringify($('#hidEndDate').val()) != null && typeof($('#hidEndDate').val()) != "undefined" ? JSON.stringify($('#hidEndDate').val()) : null);
        localStorage.setItem('qr_StateID', JSON.stringify($('#hidStateID').val()) != null && typeof($('#hidStateID').val()) != "undefined" ? JSON.stringify($('#hidStateID').val()) : null);
        localStorage.setItem('qr_IsMasterQuote', JSON.stringify($('#hidQuoteList').val()) != null && typeof($('#hidQuoteList').val()) != "undefined" ? JSON.stringify($('#hidQuoteList').val()) : null);
        localStorage.setItem('qr_Contact', JSON.stringify($('#SearchByContact').val()) != null && typeof($('#SearchByContact').val()) != "undefined" ? JSON.stringify($('#SearchByContact').val()) : null);
         localStorage.setItem('qr_BusinessManager', JSON.stringify($('#BusinessManager').val()) != null && typeof($('#BusinessManager').val()) != "undefined" ? JSON.stringify($('#BusinessManager').val()) : null);
        localStorage.setItem('qr_Status', JSON.stringify($('#hidEditQuoteStatus').val()) != null && typeof($('#hidEditQuoteStatus').val()) != "undefined" ? JSON.stringify($('#hidEditQuoteStatus').val()) : null);
        
        if (loadOptions.sort) {
          console.log(loadOptions.divids);
          params += '&orderby=' + loadOptions.sort[0].selector;
          if (loadOptions.sort[0].desc) {
            params += ' desc';
          }
        }
        return http.get(EndPointsConfig.HostName + EndPointsConfig.QuoteReportEndPoint.replace('/', '') + params)
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
    //localStorage.removeItem('qr_ControlNumber');
    localStorage.removeItem('qr_ProjectName');
    localStorage.removeItem('qr_QuoteBeginDate');
    localStorage.removeItem('qr_QuoteEndDate');
    localStorage.removeItem('qr_StateID');
    localStorage.removeItem('qr_IsMasterQuote');
    localStorage.removeItem('qr_Contact');
    localStorage.removeItem('qr_BusinessManager');
    localStorage.removeItem('qr_Status');

    $('#searchDivision').val('');
    $('#hidContractTypeID').val('0');
    $('#SearchByContNumber').val(''),
    $('#SearchByProjName').val('');
    $('#LettingFrom').val('');
    $('#LettingTo').val('');
    $('#hidStateID').val('');
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
  //var _ControlNumber = JSON.parse(localStorage.getItem('qr_ControlNumber')) != null && localStorage.getItem('qr_ControlNumber') != "null" ? JSON.parse(localStorage.getItem('qr_ControlNumber')) : null ;    
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
    //ControlNumber:_ControlNumber,
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
      //ControlNumber: $('#SearchByContNumber').val(),
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
    console.log(e);
    this.SearchState = e.value;
    $('#hidStateID').val(e.value);
    this.CountyByStateDataSource = this.CustomerCounty.filter(e => e.StateID == this.SearchState);
  }
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
  ngOnInit() {
  }
  QuoteSelection(e)
  {
    this.QuoteSelectType = e.value;
    $('#hidQuoteList').val(e.value);
  }
}

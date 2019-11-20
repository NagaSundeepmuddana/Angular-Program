import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { AwardedQuoteReport } from '../../../models/AwardedQuoteReport';
import { MetadataService } from '../../services/metadata/metadata.service';
import notify from 'devextreme/ui/notify';
import { UserService } from '../../services/user/user.service';
import { User,PITUser } from '../../../models/User';
import { Http, HttpModule } from '@angular/http';
import CustomStore from 'devextreme/data/custom_store';
import { ProductLines } from '../../../models/ProductLines';
import { AuthenticationService } from "../../services/auth/authentication.service";
import { EndPointsConfig } from "../../../models/endpointsconfig";
import { DxDataGridComponent, DxDataGridModule, DxSelectBoxModule } from 'devextreme-angular';
import 'devextreme/data/odata/store';
import { DatePipe } from '@angular/common';
import { Division } from "../../../models/division";
import { Contract } from '../../../models/Contract';

@Component({
  selector: 'app-aqr',
  templateUrl: './aqr.component.html',
  styleUrls: ['./aqr.component.css']
})
export class aqrComponent implements OnInit {
  @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
  private AwardedQuoteReportList: AwardedQuoteReport[] = [];
  userProfile: any;
  saleAmountHeaderFilter: any;
  applyFilterTypes: any;
  currentFilter: any;
  QuoteNumber: any;
  showFilterRow: boolean;
  AwarddataSource: any = {};
  ProductLineByComma:string;
  ProductLineByComma2:string;
  DivisionByComma: string;
  DivisionByComma2: string;
  private GetProductLineName: ProductLines[] = [];
  private GetDivisionList: Division[] = [];
  private GetProdLinesByDiv: ProductLines[] = [];
  showHeaderFilter: boolean;
  private DivisionID: number;
  private ProductLineID: number;
  private pagelength: number;
  dataSource: any = {};
  QuoteFrom: Date;
  QuoteTo: Date;
  AwardedFrom: Date;
  AwardedTo: Date;
  ContractTypeID: number;
  users: User[];
  EditQuoteStatus:any;
  PITUserList: PITUser[];
  BusinessManager: string = "";
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
    if(cellInfo.value==null)
      cellInfo.value=0;
    if(cellInfo.valueText == "")
      return "";
    return "$" + cellInfo.value.toFixed(2).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,")
  }
  DecimalFormatter(cellInfo) {
    if(cellInfo.value==null)
      cellInfo.value=0;
    if(cellInfo.valueText == "")
      return "";
    return cellInfo.value.toFixed(1).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,")+"%"
  }
  constructor( @Inject(Http) http: Http,private metaService: MetadataService,private userService: UserService,public auth: AuthenticationService,) {

    this.userProfile = this.auth.useProfile;
    //this.GetAllQuoteReports();
    this.GetAllProductline();
    this.GetAllDivisions();
    this.GetContractTypes();
    this.GetBusinessManager();

    this.AwarddataSource.store = new CustomStore({
      load: function (loadOptions: any) {
        console.log($('#SearchSysproNumber').val());
        console.log($('#SearchByProjName').val());
        console.log($('#hidawdStartDate').val());
        console.log($('#hidawdEndDate').val());
        console.log($('#BusinessManager').val);
        var prdline = 0;
        if (this.searchPrdLine)
          prdline = this.searchPrdLine;
        var params = '?';
        params += 'skip=' + loadOptions.skip || 0;
        params += '&take=' + loadOptions.take || 12;
        params += '&ProductLineID=' + $('#hidProductlineID').val();
        params += '&DivisionID=' + $('#hidDivisionID').val();
        params += '&ContractTypeID=' + $('#hidContractTypeID').val();
        params += '&ProjectName=' + $('#SearchByProjName').val();
        params += '&SysproNum=' + $('#SearchSysproNumber').val();
        params += '&QuoteBeginDate=' + $('#hidStartDate').val();
        params += '&QuoteEndDate=' + $('#hidEndDate').val();
        params +='&BusinessManager='+$('#BusinessManager').val();
        params +='&Status='+$('#hidEditQuoteStatus').val();
        params +='&QuoteNumber='+$('#hidQuoteNumber').val();
        params += '&AwardedDatefrom=' + $('#hidawdStartDate').val();
        params += '&AwardedDateto=' + $('#hidawdEndDate').val();
        console.log(JSON.stringify($('#hidDivisionID').val()));
        localStorage.setItem('aqr_ProductLine', JSON.stringify($('#hidProductlineID').val()) != null && typeof($('#hidProductlineID').val()) != "undefined" ? JSON.stringify($('#hidProductlineID').val()) : null);
        localStorage.setItem('aqr_Division', JSON.stringify($('#hidDivisionID').val()) != null && typeof($('#hidDivisionID').val()) != "undefined" ? JSON.stringify($('#hidDivisionID').val()) : null);
        localStorage.setItem('aqr_ContractType', JSON.stringify($('#hidContractTypeID').val()) != null && typeof($('#hidContractTypeID').val()) != "undefined" ? JSON.stringify($('#hidContractTypeID').val()) : null);
        localStorage.setItem('aqr_ProjectName', JSON.stringify($('#SearchByProjName').val()) != null && typeof($('#SearchByProjName').val()) != "undefined" ? JSON.stringify($('#SearchByProjName').val()) : null);
        localStorage.setItem('aqr_SysproNum', JSON.stringify($('#SearchSysproNumber').val()) != null && typeof($('#SearchSysproNumber').val()) != "undefined" ? JSON.stringify($('#SearchSysproNumber').val()) : null);
        localStorage.setItem('aqr_QuoteBeginDate', JSON.stringify($('#hidStartDate').val()) != null && typeof($('#hidStartDate').val()) != "undefined" ? JSON.stringify($('#hidStartDate').val()) : null);
        localStorage.setItem('aqr_QuoteEndDate', JSON.stringify($('#hidEndDate').val()) != null && typeof($('#hidEndDate').val()) != "undefined" ? JSON.stringify($('#hidEndDate').val()) : null);
        localStorage.setItem('aqr_BusinessManager', JSON.stringify($('#BusinessManager').val()) != null && typeof($('#BusinessManager').val()) != "undefined" ? JSON.stringify($('#BusinessManager').val()) : null);
        localStorage.setItem('aqr_Status', JSON.stringify($('#hidEditQuoteStatus').val()) != null && typeof($('#hidEditQuoteStatus').val()) != "undefined" ? JSON.stringify($('#hidEditQuoteStatus').val()) : null);
        localStorage.setItem('aqr_QuoteNumber', JSON.stringify($('#hidQuoteNumber').val()) != null && typeof($('#hidQuoteNumber').val()) != "undefined" ? JSON.stringify($('#hidQuoteNumber').val()) : null);
        localStorage.setItem('aqr_awdQuoteBeginDate', JSON.stringify($('#hidawdStartDate').val()) != null && typeof($('#hidawdStartDate').val()) != "undefined" ? JSON.stringify($('#hidawdStartDate').val()) : null);
        localStorage.setItem('aqr_awdQuoteEndDate', JSON.stringify($('#hidawdEndDate').val()) != null && typeof($('#hidawdEndDate').val()) != "undefined" ? JSON.stringify($('#hidawdEndDate').val()) : null);
        


        if (loadOptions.sort) {
          params += '&orderby=' + loadOptions.sort[0].selector;
          if (loadOptions.sort[0].desc) {
            params += ' desc';
          }
        }
        return http.get(EndPointsConfig.HostName + EndPointsConfig.AwardedQuoteReportEndPoint.replace('/', '') + params)
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
  SearchAwardedQuoteReport() {
    var ds = {
      requireTotalCount: true,
      searchExpr: undefined,
      searchOperation: "contains",
      searchValue: null,
      skip: 0,
      sort: null,
      take: this.pagelength,
      userData: {}
    }
    this.dataGrid.instance.refresh();
  }
  ClearFilters() {
    localStorage.removeItem('aqr_ProductLine');
    localStorage.removeItem('aqr_Division');
    localStorage.removeItem('aqr_ContractType');
    localStorage.removeItem('aqr_ProjectName');
    localStorage.removeItem('aqr_SysproNum');
    localStorage.removeItem('aqr_QuoteBeginDate');
    localStorage.removeItem('aqr_QuoteEndDate');
    localStorage.removeItem('aqr_BusinessManager');
    localStorage.removeItem('aqr_Status');
    localStorage.removeItem('aqr_QuoteNumber');
    localStorage.removeItem('aqr_awdQuoteBeginDate');
    localStorage.removeItem('aqr_awdQuoteEndDate');

    $('#hidDivisionID').val('0');
    $('#hidProductlineID').val('0');
    $('#hidContractTypeID').val('0');
    $('#LettingFrom').val('');
    $('#LettingTo').val('');
    $('#hidawdStartDate').val('');
    $('#hidawdEndDate').val('');
    $('#SearchSysproNumber').val('');
    this.DivisionID = 0;
    this.ProductLineID = 0;
    this.QuoteFrom = null;
    this.QuoteTo = null;
    this.AwardedFrom=null;
    this.AwardedTo=null;
    this.EditQuoteStatus=null;
    this.ContractTypeID = 0;
    $('#SearchByProjName').val('');
    $('#BusinessManager').val('');
    $('#hidEditQuoteStatus').val('');
    $('#hidQuoteNumber').val('');
    this.BusinessManager=null;
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
      ProjectName: $('#SearchByProjName').val(),
      BusinessManager:$('#BusinessManager').val(),
      QuoteBeginDate: $('#hidStartDate').val(),
      SysproNum: $('#SearchSysproNumber').val(),
      QuoteEndDate: $('#hidEndDate').val(),
      ContractTypeID: $('#hidContractTypeID').val()
    }
    this.metaService.ExportAwardedQuoteReport(searchparams).subscribe(data => {
      if (data) {
        window.open(data, "_blank");
      } else {
        notify('Failed to export Quote Awarded report.', 'error', 2000);
      }

    },
      err => {
        console.log('Quote Awarded Report Data Fetch Failed..');
      });
  }
  PDFGridData() {
    var _ProductLine = JSON.parse(localStorage.getItem('aqr_ProductLine')) != null ? JSON.parse(localStorage.getItem('aqr_ProductLine')) : null ;
    var _Division = JSON.parse(localStorage.getItem('aqr_Division')) != null ? JSON.parse(localStorage.getItem('aqr_Division')) : null ;
    var _ContractType = JSON.parse(localStorage.getItem('aqr_ContractType')) != null ? JSON.parse(localStorage.getItem('aqr_ContractType')) : null ;
    var _ProjectName = JSON.parse(localStorage.getItem('aqr_ProjectName')) != null ? JSON.parse(localStorage.getItem('aqr_ProjectName')) : null ;
    var _SysproNum = JSON.parse(localStorage.getItem('aqr_SysproNum')) != null ? JSON.parse(localStorage.getItem('aqr_SysproNum')) : null ;
    var _QuoteBeginDate = JSON.parse(localStorage.getItem('aqr_QuoteBeginDate')) != null ? JSON.parse(localStorage.getItem('aqr_QuoteBeginDate')) : null ;
    var _QuoteEndDate = JSON.parse(localStorage.getItem('aqr_QuoteEndDate')) != null ? JSON.parse(localStorage.getItem('aqr_QuoteEndDate')) : null ;   
    var _BusinessManager = JSON.parse(localStorage.getItem('aqr_BusinessManager')) != null ? JSON.parse(localStorage.getItem('aqr_BusinessManager')) : null;
    var _Status = JSON.parse(localStorage.getItem('aqr_Status')) != null ? JSON.parse(localStorage.getItem('aqr_Status')) : null ;
    var _QuoteNumber = JSON.parse(localStorage.getItem('aqr_QuoteNumber')) != null ? JSON.parse(localStorage.getItem('aqr_QuoteNumber')) : null ;    
    var _awdQuoteBeginDate = JSON.parse(localStorage.getItem('aqr_awdQuoteBeginDate')) != null ? JSON.parse(localStorage.getItem('aqr_awdQuoteBeginDate')) : null ;
    var _awdQuoteEndDate = JSON.parse(localStorage.getItem('aqr_awdQuoteEndDate')) != null ? JSON.parse(localStorage.getItem('aqr_awdQuoteEndDate')) : null ;   
    
    var _searchparams = {
      ProductLineID: _ProductLine,
      DivisionID: _Division,
      ContractType: _ContractType,
      ProjectName: _ProjectName,
      SysproNum: _SysproNum,
      QuoteBeginDate: _QuoteBeginDate,
      QuoteEndDate: _QuoteEndDate,      
      BusinessManager: _BusinessManager,
      Status: _Status,
      ContractTypeID:_ContractType,     
      QuoteNumber: _QuoteNumber,
      AwardedDatefrom:_awdQuoteBeginDate,
      AwardedDateto:_awdQuoteEndDate
    }
    var searchparams = {
      ProductLineID: $('#hidProductlineID').val(),
      DivisionID: $('#hidDivisionID').val(),
      ProjectName: $('#SearchByProjName').val(),
      BusinessManager:$('#BusinessManager').val(),
      QuoteBeginDate: $('#hidStartDate').val(),
      SysproNum: $('#SearchBySysproNumber').val(),
      QuoteEndDate: $('#hidEndDate').val(),
      ContractTypeID: $('#hidContractTypeID').val(),
      Status:$('#hidEditQuoteStatus').val(),
      QuoteNumber:$('#hidQuoteNumber').val(),
      awdQuoteBeginDate:$('#hidawdStartDate').val(),
      awdQuoteEndDate:$('#hidawdEndDate').val()      
    }
    this.metaService.PDFAwardedReport(_searchparams).subscribe(data => {
      if (data) {
        window.open(data, "_blank");
      } else {
        notify('Failed to Generate Awarded quote report.', 'error', 2000);
      }

    },
      err => {
        console.log('Awarded Quote Report Data Fetch Failed..');
      });
  }   
  /** Get AwardedQuoteReport data */
  GetAllAwardedQuoteReportLists() {
    this.metaService.GetAllAwardedQuoteReportList().subscribe(data => {
      console.log("load Awarded Quote Report data");
      console.log(data[0]);
      this.AwardedQuoteReportList = data;
    },
      err => {
        console.log('Awarded Quote Report Data Fetch Failed..');
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
  ProductLineChangeEvent(e) {
    console.log(e.value);
    this.ProductLineByComma = "";
    e.value.forEach(element => {
      if (this.ProductLineByComma == "")
        this.ProductLineByComma = element;
      else {
        this.ProductLineByComma = this.ProductLineByComma + "," + element;
        this.ProductLineByComma2 = this.ProductLineByComma;
        console.log(element);
          $('#hidProductlineID').val(e.value);
          
      }
    });
    $('#hidProductlineID').val(e.value);
    console.log($('#hidProductlineID').val());
    /* $('#hidProductlineID').val(e.value); */
  }
  ContractTypeChangeEvent(e) {
    console.log(e);
    $('#hidContractTypeID').val(e.value);
  }
  BusinessManagerChangeEvent(e) {
    console.log(e);
    $('#BusinessManager').val(e.value);
  }

  QuotesFromChangeEvent(e) {
    var datePipe = new DatePipe(e.value);
    $('#hidStartDate').val(datePipe.transform(e.value, 'MM/dd/yyyy'));
  }
  QuotesToChangeEvent(e) {
    var datePipe = new DatePipe(e.value);
    $('#hidEndDate').val(datePipe.transform(e.value, 'MM/dd/yyyy'));
  }

  aqrQuotesFromChangeEvent(e) {
    var datePipe = new DatePipe(e.value);
    $('#hidawdStartDate').val(datePipe.transform(e.value, 'MM/dd/yyyy'));
  }
  aqrQuotesToChangeEvent(e) {
    var datePipe = new DatePipe(e.value);
    $('#hidawdEndDate').val(datePipe.transform(e.value, 'MM/dd/yyyy'));
  }

  EditQuoteStatusChangeEvent(e) {
    console.log(e);
    // this.AwardQuoteStatus = e.value;
    $('#hidEditQuoteStatus').val(e.value);
   
  }
  QuoteNumberChangeEvent(e) {
    console.log(e);
    // this.AwardQuoteStatus = e.value;
    $('#hidQuoteNumber').val(e.value);
    
   
  }
  ngOnInit() {
  }
}

import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { QuotesbyContactReport } from '../../../models/QuotesbyContactReport';
import { MetadataService } from '../../services/metadata/metadata.service';
import notify from 'devextreme/ui/notify';
import { UserService } from '../../services/user/user.service';
import { User,PITUser  } from '../../../models/User';
import { QuoteReport } from '../../../models/QuoteReport';
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

@Component({
  selector: 'app-qbcr',
  templateUrl: './qbcr.component.html',
  styleUrls: ['./qbcr.component.css']
})
export class qbcrComponent implements OnInit {
  @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
  private QuotesbyContactReportList: QuotesbyContactReport[] = [];
  userProfile: any;
  saleAmountHeaderFilter: any;
  applyFilterTypes: any;
  currentFilter: any;
  showFilterRow: boolean;
  showHeaderFilter: boolean;
  private GetProductLineName: ProductLines[] = [];
  private GetDivisionList: Division[] = [];
  private GetProdLinesByDiv: ProductLines[] = [];
  public ContractType: Contract[] = [];
  users: User[];
  PITUserList: PITUser[];
  private DivisionID: number;
  private ProductLineID: number;
  private pagelength: number;
  QuoteFrom: Date;
  QuoteTo: Date;
  ContractTypeID: number;
  BusinessManager: string = "";
  QuoteContactdataSource: any = {};
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
  CurrencyFormatter(cellInfo) {
    if(cellInfo.value==null)
    cellInfo.value=0;
    return "$" + cellInfo.value.toFixed(2).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,")
  }
  DecimalFormatter(cellInfo) {
    if(cellInfo.value==null)
    cellInfo.value=0;
    return cellInfo.value.toFixed(1).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,")+"%"
  }
  constructor( @Inject(Http) http: Http, private metaService: MetadataService, private userService: UserService, public auth: AuthenticationService) {

    this.userProfile = this.auth.useProfile;
    //this.GetAllQuoteReports();
    this.GetAllProductline();
    this.GetAllDivisions();
    this.GetContractTypes();
    this.GetBusinessManager();

    this.QuoteContactdataSource.store = new CustomStore({
      load: function (loadOptions: any) {
        var params = '?';
        var customerName = "";
        if($('#SearchByContact').val().toString().indexOf('_') == -1)
          customerName = $('#SearchByContact').val().toString().replace("&","%26");

        params += 'skip=' + loadOptions.skip || 0;
        params += '&take=' + loadOptions.take || 12;
        params += '&Contact=' + customerName;
        params += '&ProductLineID=' + $('#hidProductlineID').val();
        params += '&DivisionID=' + $('#hidDivisionID').val();
        params += '&ContractTypeID=' + $('#hidContractTypeID').val();
        params += '&ProjectName=' + $('#SearchByProjName').val();
        params += '&QuoteBeginDate=' + $('#hidStartDate').val();
        params += '&QuoteEndDate=' + $('#hidEndDate').val();
        params +='&BusinessManager='+$('#BusinessManager').val();
        params +='&Status='+$('#hidEditQuoteStatus').val();
        
        localStorage.setItem('customerName', JSON.stringify($('#SearchByContact').val()) != null && typeof($('#SearchByContact').val()) != "undefined" ? JSON.stringify($('#SearchByContact').val()) : null);
        localStorage.setItem('ProductLine', JSON.stringify($('#hidProductlineID').val()) != null && typeof($('#hidProductlineID').val()) != "undefined" ? JSON.stringify($('#hidProductlineID').val()) : null);
        localStorage.setItem('Division', JSON.stringify($('#hidDivisionID').val()) != null && typeof($('#hidDivisionID').val()) != "undefined" ? JSON.stringify($('#hidDivisionID').val()) : null);
        localStorage.setItem('ContractType', JSON.stringify($('#hidContractTypeID').val()) != null && typeof($('#hidContractTypeID').val()) != "undefined" ? JSON.stringify($('#hidContractTypeID').val()) : null);
        localStorage.setItem('ProjectName', JSON.stringify($('#SearchByProjName').val()) != null && typeof($('#SearchByProjName').val()) != "undefined" ? JSON.stringify($('#SearchByProjName').val()) : null);
        localStorage.setItem('QuoteBeginDate', JSON.stringify($('#hidStartDate').val()) != null && typeof($('#hidStartDate').val()) != "undefined" ? JSON.stringify($('#hidStartDate').val()) : null);
        localStorage.setItem('QuoteEndDate', JSON.stringify($('#hidEndDate').val()) != null && typeof($('#hidEndDate').val()) != "undefined" ? JSON.stringify($('#hidEndDate').val()) : null);
        localStorage.setItem('BusinessManager', JSON.stringify($('#BusinessManager').val()) != null && typeof($('#BusinessManager').val()) != "undefined" ? JSON.stringify($('#BusinessManager').val()) : null);
        localStorage.setItem('Status', JSON.stringify($('#hidEditQuoteStatus').val()) != null && typeof($('#hidEditQuoteStatus').val()) != "undefined" ? JSON.stringify($('#hidEditQuoteStatus').val()) : null);
        
        if (loadOptions.sort) {
          params += '&orderby=' + loadOptions.sort[0].selector;
          if (loadOptions.sort[0].desc) {
            params += ' desc';
          }
        }
        return http.get(EndPointsConfig.HostName + EndPointsConfig.QuotesbyContactReportEndPoint.replace('/', '') + params)
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
  /** Get Quotes by Contact Report data */
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
  SearchQuotesbycontactReport() {
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
    localStorage.removeItem('customerName');
    localStorage.removeItem('ProductLine');
    localStorage.removeItem('Division');
    localStorage.removeItem('ContractType');
    localStorage.removeItem('ProjectName');
    localStorage.removeItem('QuoteBeginDate');
    localStorage.removeItem('QuoteEndDate');
    localStorage.removeItem('BusinessManager');
    localStorage.removeItem('Status');

    console.log($('#LettingFrom input').val(''));
    $('#hidDivisionID').val('0');
    $('#hidProductlineID').val('0');
    $('#hidContractTypeID').val('0');
    $('#LettingFrom').val('');
    $('#LettingTo').val('');
    $('#LettingFrom input').val('');
    $('#LettingTo input').val('');
    $('#SearchByContact').val('');
    this.DivisionID = null;
    this.EditQuoteStatus=null;
    this.ProductLineID = null;
    this.QuoteFrom = null;
    this.QuoteTo = null;
    this.ContractTypeID = 0;
    $('#SearchByProjName').val('');
    $('#BusinessManager').val('');
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
      Contact: $('#SearchByContact').val(),
      ProductLineID: $('#hidProductlineID').val(),
      DivisionID: $('#hidDivisionID').val(),
      ProjectName: $('#SearchByProjName').val(),
      QuoteBeginDate: $('#hidStartDate').val(),
      QuoteEndDate: $('#hidEndDate').val(),
      BusinessManager:$('#BusinessManager').val(),
      ContractTypeID: $('#hidContractTypeID').val()
    }
    this.metaService.ExportQuotesbyContactReport(searchparams).subscribe(data => {
      if (data) {
        window.open(data, "_blank");
      } else {
        notify('Failed to export Quote by Contact report.', 'error', 2000);
      }

    },
      err => {
        console.log('Quote by Contact report Data Fetch Failed..');
      });
  }
  PDFGridData() {

    var _ProductLine = JSON.parse(localStorage.getItem('ProductLine')) != null && localStorage.getItem('ProductLine') != "null" ? JSON.parse(localStorage.getItem('ProductLine')) : null ;
    var _Division = JSON.parse(localStorage.getItem('Division')) != null && localStorage.getItem('Division') != "null" ? JSON.parse(localStorage.getItem('Division')) : null ;
    var _ProjectName = JSON.parse(localStorage.getItem('ProjectName')) != null && localStorage.getItem('ProjectName') != "null" ? JSON.parse(localStorage.getItem('ProjectName')) : null ;    
    var _QuoteBeginDate = JSON.parse(localStorage.getItem('QuoteBeginDate')) != null && localStorage.getItem('QuoteBeginDate') != "null" ? JSON.parse(localStorage.getItem('QuoteBeginDate')) : null ;
    var _QuoteEndDate = JSON.parse(localStorage.getItem('QuoteEndDate')) != null && localStorage.getItem('QuoteEndDate') != "null" ? JSON.parse(localStorage.getItem('QuoteEndDate')) : null ; 
    var _ContractType = JSON.parse(localStorage.getItem('ContractType')) != null && localStorage.getItem('ContractType') != "null" ? JSON.parse(localStorage.getItem('ContractType')) : null ;
    var _customerName = JSON.parse(localStorage.getItem('customerName')) != null && localStorage.getItem('customerName') != "null" ? JSON.parse(localStorage.getItem('customerName')) : null ;
    var _BusinessManager = JSON.parse(localStorage.getItem('BusinessManager')) != null && localStorage.getItem('BusinessManager') != "null" ? JSON.parse(localStorage.getItem('BusinessManager')) : null;
    var _Status = JSON.parse(localStorage.getItem('Status')) != null && localStorage.getItem('Status') != "null" ? JSON.parse(localStorage.getItem('Status')) : null ;
    
    var _searchparams = {
      ProductLineID: _ProductLine,
      DivisionID:_Division,
      ProjectName: _ProjectName,
      QuoteBeginDate: _QuoteBeginDate,
      QuoteEndDate:_QuoteEndDate,
      ContractTypeID: _ContractType,
      Contact:_customerName,     
      BusinessManager:_BusinessManager,      
      Status:_Status    
    }

    var searchparams = {
      Contact: $('#SearchByContact').val(),
      ProductLineID: $('#hidProductlineID').val(),
      DivisionID: $('#hidDivisionID').val(),
      ProjectName: $('#SearchByProjName').val(),
      QuoteBeginDate: $('#hidStartDate').val(),
      QuoteEndDate: $('#hidEndDate').val(),
      BusinessManager:$('#BusinessManager').val(),
      ContractTypeID: $('#hidContractTypeID').val(),
      Status:$('#hidEditQuoteStatus').val()
    }
    this.metaService.PDFQuotesbyContactReport(_searchparams).subscribe(data => {
      if (data) {
        window.open(data, "_blank");
      } else {
        notify('Failed to Generate Quotes by Contact report.', 'error', 2000);
      }

    },
      err => {
        console.log('Quotes by Contact Report Data Fetch Failed..');
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
    $('#hidDivisionID').val(e.value);
    this.GetProdLinesByDiv = this.GetProductLineName.filter(m => m.DivisionID == e.value);
  }
  ProductLineChangeEvent(e) {
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
}

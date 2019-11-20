import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { SysproBudgetReport } from '../../../models/SysproBudgetReport';
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

@Component({
  selector: 'app-sbr',
  templateUrl: './sbr.component.html',
  styleUrls: ['./sbr.component.css']
})
export class sbrComponent implements OnInit {
  @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
  private SysproBudgetReportList: SysproBudgetReport[] = [];
  userProfile: any;
  saleAmountHeaderFilter: any;
  applyFilterTypes: any;
  currentFilter: any;
  showFilterRow: boolean;
  showHeaderFilter: boolean;
  private GetProductLineName: ProductLines[] = [];
  private GetDivisionList: Division[] = [];
  private GetProdLinesByDiv: ProductLines[] = [];
  private DivisionID: number;
  private ProductLineID: number;
  private pagelength: number;
  SysprodataSource: any = {};
  QuoteFrom: Date;
  QuoteTo: Date;
  ContractTypeID: number;
  public ContractType: Contract[] = [];
  users: User[]; 
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
  CurrencyFormatter(cellInfo) {
    if(cellInfo.value==null)
    cellInfo.value=0;
    return "$" + cellInfo.value.toFixed(2).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,")
  }
  DecimalFormatter(cellInfo) {
    if(cellInfo.value==null)
    cellInfo.value=0;
    return cellInfo.value.toFixed(2).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,")+"%"
  }
  constructor( @Inject(Http) http: Http, private metaService: MetadataService, private userService: UserService, public auth: AuthenticationService) {

    this.userProfile = this.auth.useProfile;
    this.GetAllProductline();
    this.GetAllDivisions();
    this.GetContractTypes();
    this.GetBusinessManager();

    this.SysprodataSource.store = new CustomStore({
      load: function (loadOptions: any) {
        var params = '?';
      console.log(loadOptions);
      console.log($('#BusinessManager').val);
      console.log($('#SearchByProjName').val);
        params += 'skip=' + loadOptions.skip || 0;
        params += '&take=' + loadOptions.take || 12;
        params += '&ProductLineID=' + $('#hidProductlineID').val();
        params += '&DivisionID=' + $('#hidDivisionID').val();       
        params += '&ContractTypeID=' + $('#hidContractTypeID').val();
        params += '&QuoteBeginDate=' + $('#hidStartDate').val();
        params += '&QuoteEndDate=' + $('#hidEndDate').val();
        params +='&BusinessManager='+$('#BusinessManager').val();
        params +='&QuoteNumber='+$('#hidQuoteNumber').val();
        params += '&ProjectNumber=' + $('#SearchByProjNum').val();
        params +='&Status='+$('#hidEditQuoteStatus').val();
        params += '&ControlNumber=' + $('#SearchByContNumber').val();
       
        console.log(JSON.stringify($('#hidDivisionID').val()));
        localStorage.setItem('sbr_ProductLine', JSON.stringify($('#hidProductlineID').val()) != null && typeof($('#hidProductlineID').val()) != "undefined" ? JSON.stringify($('#hidProductlineID').val()) : null);
        localStorage.setItem('sbr_Division', JSON.stringify($('#hidDivisionID').val()) != null && typeof($('#hidDivisionID').val()) != "undefined" ? JSON.stringify($('#hidDivisionID').val()) : null);
        localStorage.setItem('sbr_ContractType', JSON.stringify($('#hidContractTypeID').val()) != null && typeof($('#hidContractTypeID').val()) != "undefined" ? JSON.stringify($('#hidContractTypeID').val()) : null);
        localStorage.setItem('sbr_QuoteBeginDate', JSON.stringify($('#hidStartDate').val()) != null && typeof($('#hidStartDate').val()) != "undefined" ? JSON.stringify($('#hidStartDate').val()) : null);
        localStorage.setItem('sbr_QuoteEndDate', JSON.stringify($('#hidEndDate').val()) != null && typeof($('#hidEndDate').val()) != "undefined" ? JSON.stringify($('#hidEndDate').val()) : null);
        localStorage.setItem('sbr_BusinessManager', JSON.stringify($('#BusinessManager').val()) != null && typeof($('#BusinessManager').val()) != "undefined" ? JSON.stringify($('#BusinessManager').val()) : null);
        localStorage.setItem('sbr_QuoteNumber', JSON.stringify($('#hidQuoteNumber').val()) != null && typeof($('#hidQuoteNumber').val()) != "undefined" ? JSON.stringify($('#hidQuoteNumber').val()) : null);
        localStorage.setItem('sbr_ProjectNumber', JSON.stringify($('#SearchByProjNum').val()) != null && typeof($('#SearchByProjNum').val()) != "undefined" ? JSON.stringify($('#SearchByProjNum').val()) : null);
        localStorage.setItem('sbr_Status', JSON.stringify($('#hidEditQuoteStatus').val()) != null && typeof($('#hidEditQuoteStatus').val()) != "undefined" ? JSON.stringify($('#hidEditQuoteStatus').val()) : null);
        localStorage.setItem('sbr_ControlNumber',JSON.stringify($('#SearchByContNumber').val()!=null && typeof('#SearchByContNumber').valueOf())!="undefined"? JSON.stringify($('#SearchByContNumber').val()):null);
       

        if (loadOptions.sort) {
          params += '&orderby=' + loadOptions.sort[0].selector;
          if (loadOptions.sort[0].desc) {
            params += ' desc';
          }
        }
        return http.get(EndPointsConfig.HostName + EndPointsConfig.SysproBudgetReportEndPoint.replace('/', '') + params)
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
  /** Get Syspro Budget Report data */
  GetSysproBudgetReport() {
    this.metaService.GetSysproBudgetReport().subscribe(data => {
      this.SysproBudgetReportList = data;
    },
      err => {
        console.log('Syspro Budget Report Data Fetch Failed..');
      });
  }
  SearchSysproBudgetQuoteReport() {
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
    localStorage.removeItem('sbr_ProductLine');
    localStorage.removeItem('sbr_Division');
    localStorage.removeItem('sbr_ContractType');
    localStorage.removeItem('sbr_ProjectNumber');
    localStorage.removeItem('sbr_QuoteBeginDate');
    localStorage.removeItem('sbr_QuoteEndDate');
    localStorage.removeItem('sbr_BusinessManager');
    localStorage.removeItem('sbr_QuoteNumber');
    localStorage.removeItem('sbr_Status');
    localStorage.removeItem('sbr_ControlNumber');
    console.log(JSON.stringify($('sbr_QuoteNumber').val()));

    $('#hidDivisionID').val('');
    $('#hidProductlineID').val('');
    $('#hidContractTypeID').val('0');
    $('#SearchByProjNum').val('');
    $('#hidStartDate').val('');
    $('#hidEndDate').val('');
    $('#BusinessManager').val('');
    $('#hidEditQuoteStatus').val('');
    $('#SearchByContNumber').val('');
    $('#hidQuoteNumber').val('');
    this.DivisionID = 0;
    this.ProductLineID = 0;
    this.QuoteFrom = null;
    this.QuoteTo = null;
    this.BusinessManager=null;
    this.ContractTypeID = 0;
    this.AwardQuoteStatus=null;
  
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
  ExportGridData(e) {
    console.log(e.row.data.ProductLineID);
   var _ProductLine = JSON.parse(localStorage.getItem('sbr_ProductLine')) != null && localStorage.getItem('sbr_ProductLine') != "null" ? JSON.parse(localStorage.getItem('sbr_ProductLine')) : null ;
   var _Division = JSON.parse(localStorage.getItem('sbr_Division')) != null && localStorage.getItem('sbr_Division') != "null" ? JSON.parse(localStorage.getItem('sbr_Division')) : null ;
   var _ContractType = JSON.parse(localStorage.getItem('sbr_ContractType')) != null && localStorage.getItem('sbr_ContractType') != "null" ? JSON.parse(localStorage.getItem('sbr_ContractType')) : null ;
   var _ProjectNum = JSON.parse(localStorage.getItem('sbr_ProjectNumber')) != null && localStorage.getItem('sbr_ProjectNumber') != "null" ? JSON.parse(localStorage.getItem('sbr_ProjectNumber')) : null ;
   var _QuoteBeginDate = JSON.parse(localStorage.getItem('sbr_QuoteBeginDate')) != null && localStorage.getItem('sbr_QuoteBeginDate') != "null" ? JSON.parse(localStorage.getItem('sbr_QuoteBeginDate')) : null ;
   var _QuoteEndDate = JSON.parse(localStorage.getItem('sbr_QuoteEndDate')) != null && localStorage.getItem('sbr_QuoteEndDate') != "null" ? JSON.parse(localStorage.getItem('sbr_QuoteEndDate')) : null ; 
   var _BusinessManager = JSON.parse(localStorage.getItem('sbr_BusinessManager')) != null && localStorage.getItem('sbr_BusinessManager') != "null" ? JSON.parse(localStorage.getItem('sbr_BusinessManager')) : null;
    var _QuoteNumber = JSON.parse(localStorage.getItem('sbr_QuoteNumber')) != null && localStorage.getItem('sbr_QuoteNumber') != "null" ? JSON.parse(localStorage.getItem('sbr_QuoteNumber')) : null;
   var _Status = JSON.parse(localStorage.getItem('sbr_Status')) != null ? JSON.parse(localStorage.getItem('sbr_Status')) : null ;
   var _ControlNumber = JSON.parse(localStorage.getItem('sbr_ControlNumber')) != null && localStorage.getItem('sbr_ControlNumber') != "null" ? JSON.parse(localStorage.getItem('sbr_ControlNumber')) : null ;    
  
    var _searchparams = {
      ProductLineID: _ProductLine,
      DivisionID: _Division,
      ContractTypeID: _ContractType,
      ProjectNumber: _ProjectNum,     
      QuoteBeginDate: _QuoteBeginDate,
      QuoteEndDate: _QuoteEndDate,      
      BusinessManager: _BusinessManager,         
      QuoteNumber: e.row.data.QuoteNumber, 
      Status: _Status,
      ControlNumber:_ControlNumber 
        
    }
    /* var searchparams = {
      ProductLineID: $('#hidProductlineID').val(),
      DivisionID: $('#hidDivisionID').val(),
      QuoteBeginDate: $('#hidStartDate').val(),
      BusinessManager:$('#BusinessManager').val(),
      QuoteEndDate: $('#hidEndDate').val(),
      ContractTypeID: $('#hidContractTypeID').val()
    } */


    this.metaService.ExportSysproBudgetReport(_searchparams).subscribe(data => {
      if (data) {
        window.open(data, "_blank");
      } else {
        notify('Failed to export Syspro Budget report.', 'error', 2000);
      }

    },
      err => {
        console.log('Syspro Budget Report Data Fetch Failed..');
      });
  }
  PDFGridData() {
    /* var searchparams = {
      ProductLineID: $('#hidProductlineID').val(),
      DivisionID: $('#hidDivisionID').val(),
      QuoteBeginDate: $('#hidStartDate').val(),
      BusinessManager:$('#BusinessManager').val(),
      QuoteEndDate: $('#hidEndDate').val(),
      ContractTypeID: $('#hidContractTypeID').val()
    } */

    var _ProductLine = JSON.parse(localStorage.getItem('sbr_ProductLine')) != null && localStorage.getItem('sbr_ProductLine') != "null" ? JSON.parse(localStorage.getItem('sbr_ProductLine')) : null ;
    var _Division = JSON.parse(localStorage.getItem('sbr_Division')) != null && localStorage.getItem('sbr_Division') != "null" ? JSON.parse(localStorage.getItem('sbr_Division')) : null ;
    var _ContractType = JSON.parse(localStorage.getItem('sbr_ContractType')) != null && localStorage.getItem('sbr_ContractType') != "null" ? JSON.parse(localStorage.getItem('sbr_ContractType')) : null ;
    var _ProjectNum = JSON.parse(localStorage.getItem('sbr_ProjectNumber')) != null && localStorage.getItem('sbr_ProjectNumber') != "null" ? JSON.parse(localStorage.getItem('sbr_ProjectNumber')) : null ;
    var _QuoteBeginDate = JSON.parse(localStorage.getItem('sbr_QuoteBeginDate')) != null && localStorage.getItem('sbr_QuoteBeginDate') != "null" ? JSON.parse(localStorage.getItem('sbr_QuoteBeginDate')) : null ;
    var _QuoteEndDate = JSON.parse(localStorage.getItem('sbr_QuoteEndDate')) != null && localStorage.getItem('sbr_QuoteEndDate') != "null" ? JSON.parse(localStorage.getItem('sbr_QuoteEndDate')) : null ; 
    var _BusinessManager = JSON.parse(localStorage.getItem('sbr_BusinessManager')) != null && localStorage.getItem('sbr_BusinessManager') != "null" ? JSON.parse(localStorage.getItem('sbr_BusinessManager')) : null;
    var _QuoteNumber = JSON.parse(localStorage.getItem('sbr_QuoteNumber')) != null && localStorage.getItem('sbr_QuoteNumber') != "null" ? JSON.parse(localStorage.getItem('sbr_QuoteNumber')) : null;
    var _Status = JSON.parse(localStorage.getItem('sbr_Status')) != null ? JSON.parse(localStorage.getItem('sbr_Status')) : null ;
    var _ControlNumber = JSON.parse(localStorage.getItem('sbr_ControlNumber')) != null && localStorage.getItem('sbr_ControlNumber') != "null" ? JSON.parse(localStorage.getItem('sbr_ControlNumber')) : null ;    
  
    var _searchparams = {
      ProductLineID: _ProductLine,
      DivisionID: _Division,
      ContractTypeID: _ContractType,
      ProjectNumber: _ProjectNum,     
      QuoteBeginDate: _QuoteBeginDate,
      QuoteEndDate: _QuoteEndDate,      
      BusinessManager: _BusinessManager,        
      QuoteNumber: _QuoteNumber, 
      Status: _Status,
      ControlNumber:_ControlNumber
        
    }
    var searchparams = {
      ProductLineID: $('#hidProductlineID').val(),
      DivisionID: $('#hidDivisionID').val(),
      ContractTypeID: $('#hidContractTypeID').val(),  
      ProjectNumber: $('#SearchByProjNum').val(),      
      QuoteBeginDate: $('#hidStartDate').val(),     
      QuoteEndDate: $('#hidEndDate').val(),
      BusinessManager:$('#BusinessManager').val(),         
      QuoteNumber:$('#hidQuoteNumber').val(),
      Status:$('#hidEditQuoteStatus').val(),
      ControlNumber: $('#SearchByContNumber').val()

    }
    this.metaService.PDFSysproBudgetReport(_searchparams).subscribe(data => {
      if (data) {
        window.open(data, "_blank");
      } else {
        notify('Failed to Generate Syspro Budget Report.', 'error', 2000);
      }

    },
      err => {
        console.log('Syspro Budget Report Data Fetch Failed..');
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
  BusinessManagerChangeEvent(e) {
    console.log(e);
    $('#BusinessManager').val(e.value);
  }
  EditQuoteStatusChangeEvent(e) {
    console.log(e);
    // this.AwardQuoteStatus = e.value;
    $('#hidEditQuoteStatus').val(e.value);
   
  }
  QuotesFromChangeEvent(e) {
    var datePipe = new DatePipe(e.value);
    $('#hidStartDate').val(datePipe.transform(e.value, 'MM/dd/yyyy'));
  }
  QuotesToChangeEvent(e) {
    var datePipe = new DatePipe(e.value);
    $('#hidEndDate').val(datePipe.transform(e.value, 'MM/dd/yyyy'));
  }
  ngOnInit() {
  }
}

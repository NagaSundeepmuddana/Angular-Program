import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MetadataService } from '../../services/metadata/metadata.service';
import notify from 'devextreme/ui/notify';
import { UserService } from '../../services/user/user.service';
import { User } from '../../../models/User';
import { AuthenticationService } from "../../services/auth/authentication.service";
import { ProductLines } from '../../../models/ProductLines';
import CustomStore from 'devextreme/data/custom_store';
import 'rxjs/add/operator/toPromise';
import { Http, HttpModule } from '@angular/http';
import { EndPointsConfig } from "../../../models/endpointsconfig";
import { DxDataGridComponent, DxDataGridModule, DxSelectBoxModule } from 'devextreme-angular';
import 'devextreme/data/odata/store';
import { Division } from "../../../models/division";
import { QuotesbyVendorReport } from '../../../models/QuotesbyVendorReport';
import { DatePipe } from '@angular/common';
import { Contract } from '../../../models/Contract';
import { States, County } from '../../../models/Project';

@Component({
  selector: 'app-qbvr',
  templateUrl: './qbvr.component.html',
  styleUrls: ['./qbvr.component.css']
})
export class qbvrComponent implements OnInit {
  @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
  private QuotesbyVendorReportList: QuotesbyVendorReport[] = [];
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
  QuoteFrom: Date;
  QuoteTo: Date;
  private SearchState: string;
  CountyByStateDataSource: any;
  private CustomerCounty: County[] = [];
  private CustomerState: States[] = [];
  ContractTypeID: number;
  public ContractType: Contract[] = [];
  QuoteVendordataSource: any = {};
  CurrencyFormatter(cellInfo) {
    if(cellInfo.value==null)
    cellInfo.value=0;
    return "$" + cellInfo.value.toFixed(2).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,")
  }
  DecimalFormatter(cellInfo) {
    if(cellInfo.value==null)
    cellInfo.value=0;
    return cellInfo.value.toFixed(2).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,")
  }
  constructor( @Inject(Http) http: Http, private metaService: MetadataService, private userService: UserService, public auth: AuthenticationService) {

    this.userProfile = this.auth.useProfile;
    //this.GetAllQuoteReports();
    this.GetAllProductline();
    this.GetAllDivisions();
    this.GetContractTypes();
    this.GetAllStates();

    this.QuoteVendordataSource.store = new CustomStore({
      load: function (loadOptions: any) {
        var params = '?';

        params += 'skip=' + loadOptions.skip || 0;
        params += '&take=' + loadOptions.take || 12;
        params += '&ProductLineID=' + $('#hidProductlineID').val();
        params += '&DivisionID=' + $('#hidDivisionID').val();
        params += '&ContractTypeID=' + $('#hidContractTypeID').val();
        params += '&ProjectName=' + $('#SearchByProjName').val();
        params += '&StateID=' + $('#hidStateID').val();
        params += '&QuoteNumber=' + $('#hidQuoteNumber').val();
        params += '&QuoteBeginDate=' + $('#hidStartDate').val();
        params += '&QuoteEndDate=' + $('#hidEndDate').val();

        localStorage.setItem('aqr_ProductLine', JSON.stringify($('#hidProductlineID').val()) != null && typeof($('#hidProductlineID').val()) != "undefined" ? JSON.stringify($('#hidProductlineID').val()) : null);
        localStorage.setItem('aqr_Division', JSON.stringify($('#hidDivisionID').val()) != null && typeof($('#hidDivisionID').val()) != "undefined" ? JSON.stringify($('#hidDivisionID').val()) : null);
        localStorage.setItem('aqr_ContractType', JSON.stringify($('#hidContractTypeID').val()) != null && typeof($('#hidContractTypeID').val()) != "undefined" ? JSON.stringify($('#hidContractTypeID').val()) : null);
        //localStorage.setItem('qr_ControlNumber',JSON.stringify($('#SearchByContNumber').val()!=null && typeof('#SearchByContNumber').valueOf())!="undefined"? JSON.stringify($('#SearchByContNumber').val()):null);
        localStorage.setItem('aqr_ProjectName', JSON.stringify($('#SearchByProjName').val()) != null && typeof($('#SearchByProjName').val()) != "undefined" ? JSON.stringify($('#SearchByProjName').val()) : null);
        localStorage.setItem('aqr_QuoteBeginDate', JSON.stringify($('#hidStartDate').val()) != null && typeof($('#hidStartDate').val()) != "undefined" ? JSON.stringify($('#hidStartDate').val()) : null);
        localStorage.setItem('aqr_QuoteEndDate', JSON.stringify($('#hidEndDate').val()) != null && typeof($('#hidEndDate').val()) != "undefined" ? JSON.stringify($('#hidEndDate').val()) : null);
        localStorage.setItem('qr_StateID', JSON.stringify($('#hidStateID').val()) != null && typeof($('#hidStateID').val()) != "undefined" ? JSON.stringify($('#hidStateID').val()) : null);
        

        if (loadOptions.sort) {
          params += '&orderby=' + loadOptions.sort[0].selector;
          if (loadOptions.sort[0].desc) {
            params += ' desc';
          }
        }
        return http.get(EndPointsConfig.HostName + EndPointsConfig.QuotesbyVendorReportEndPoint.replace('/', '') + params)
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
  /** Get Quotes by Vendor Report data */
  GetAllQuotesbyVendorReports() {
    this.metaService.GetAllQuotesbyVendorReport().subscribe(data => {
      console.log("load Quotes by Vendor Report data");
      console.log(data[0]);
      this.QuotesbyVendorReportList = data;
    },
      err => {
        console.log('Quotes by Vendor Report Data Fetch Failed..');
      });
  }
  SearchQuotesbyVendorReport() {
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
    localStorage.removeItem('aqr_hidQuoteNumber');

    //localStorage.removeItem('qr_ControlNumber');
    localStorage.removeItem('aqr_ProjectName');
    localStorage.removeItem('aqr_QuoteBeginDate');
    localStorage.removeItem('aqr_QuoteEndDate');
    localStorage.removeItem('qr_StateID');
    
    $('#hidDivisionID').val('');
    $('#hidProductlineID').val('');
    $('#hidContractTypeID').val('0');
    $('#SearchByProjName').val('');
    $('#hidQuoteNumber').val('')
    $('#LettingFrom').val('');
    $('#hidStartDate').val('');
    $('#hidEndDate').val('');
    $('#hidStateID').val('');       
    this.DivisionID = null;
    this.ProductLineID = null;
    this.QuoteFrom = null;
    this.SearchState = null;
    this.QuoteTo = null;
     
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
 /*  ClearFilters() {
    $('#hidDivisionID').val('0');
    $('#hidProductlineID').val('0');
    $('#hidContractTypeID').val('0');
    $('#LettingFrom').val('');
    $('#LettingTo').val('');
    this.DivisionID = 0;
    this.ProductLineID = 0;
    this.QuoteFrom = null;
    this.QuoteTo = null;
    this.ContractTypeID = 0;
    $('#SearchByProjName').val('');
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
  } */
  
  ExportGridData() {
    var searchparams = {
      ProductLineID: $('#hidProductlineID').val(),
      DivisionID: $('#hidDivisionID').val(),
      ProjectName: $('#SearchByProjName').val(),
      QuoteBeginDate: $('#hidStartDate').val(),
      QuoteEndDate: $('#hidEndDate').val(),
      ContractTypeID: $('#hidContractTypeID').val()
    }
    this.metaService.ExportQuotesbyVendorReport(searchparams).subscribe(data => {
      if (data) {
        window.open(data, "_blank");
      } else {
        notify('Failed to export Quotes by Vendor Report Data', 'error', 2000);
      }

    },
      err => {
        console.log('Quotes by Vendor Report Data Fetch Failed..');
      });
  }

  PDFGridData() {
    var _ProductLine = JSON.parse(localStorage.getItem('aqr_ProductLine')) != null ? JSON.parse(localStorage.getItem('aqr_ProductLine')) : null ;
    var _Division = JSON.parse(localStorage.getItem('aqr_Division')) != null ? JSON.parse(localStorage.getItem('aqr_Division')) : null ;    
    var _ProjectName = JSON.parse(localStorage.getItem('aqr_ProjectName')) != null ? JSON.parse(localStorage.getItem('aqr_ProjectName')) : null ;   
    var _hidQuoteNumber = JSON.parse(localStorage.getItem('aqr_hidQuoteNumber')) != null ? JSON.parse(localStorage.getItem('aqr_hidQuoteNumber')) : null ; 
    var _QuoteBeginDate = JSON.parse(localStorage.getItem('aqr_QuoteBeginDate')) != null ? JSON.parse(localStorage.getItem('aqr_QuoteBeginDate')) : null ;
    var _QuoteEndDate = JSON.parse(localStorage.getItem('aqr_QuoteEndDate')) != null ? JSON.parse(localStorage.getItem('aqr_QuoteEndDate')) : null ;      
    var _ContractType = JSON.parse(localStorage.getItem('aqr_ContractType')) != null ? JSON.parse(localStorage.getItem('aqr_ContractType')) : null ;
    var _state = JSON.parse(localStorage.getItem('qr_StateID')) != null && localStorage.getItem('qr_StateID') != "null" ? JSON.parse(localStorage.getItem('qr_StateID')) : null ;  
 
    
    var _searchparams = {
      ProductLineID: _ProductLine,
      DivisionID: _Division,
      ContractType: _ContractType,
      hidQuoteNumber:_hidQuoteNumber,
      ProjectName: _ProjectName,
      StateID: _state,      
      QuoteBeginDate: _QuoteBeginDate,
      QuoteEndDate: _QuoteEndDate 
    }
    var searchparams = {
      ProductLineID: $('#hidProductlineID').val(),
      DivisionID: $('#hidDivisionID').val(),
      ContractType: $('#hidContractTypeID').val(),
      ProjectName: $('#SearchByProjName').val(),
      QuoteNumber:$('#hidQuoteNumber').val(),
      StateID: $('#hidStateID').val(),      
      QuoteBeginDate: $('#hidStartDate').val(),      
      QuoteEndDate: $('#hidEndDate').val(),
      
         
    }
    this.metaService.PDFQuotesbyVendorReport(searchparams).subscribe(data => {
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


/*   PDFGridData() {
    var searchparams = {
      ProductLineID: $('#hidProductlineID').val(),
      DivisionID: $('#hidDivisionID').val(),
      ProjectName: $('#SearchByProjName').val(),
      QuoteBeginDate: $('#hidStartDate').val(),
      QuoteEndDate: $('#hidEndDate').val(),
      ContractTypeID: $('#hidContractTypeID').val()
    }
    this.metaService.PDFQuotesbyVendorReport(searchparams).subscribe(data => {
      if (data) {
        window.open(data, "_blank");
      } else {
        notify('Failed to Generate Quotes by Vendor Report.', 'error', 2000);
      }

    },
      err => {
        console.log('Quotes by Vendor Report Data Fetch Failed..');
      });
  }  */
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
  ngOnInit() {
  }
}

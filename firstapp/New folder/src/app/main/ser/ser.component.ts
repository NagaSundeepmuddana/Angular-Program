import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MetadataService } from '../../services/metadata/metadata.service';
import notify from 'devextreme/ui/notify';
import { UserService } from '../../services/user/user.service';
import { ProductLines } from '../../../models/ProductLines';
import { ContactType } from "../../../models/customers";
import { User } from '../../../models/User';
import { States, County } from '../../../models/Project';
import { AuthenticationService } from "../../services/auth/authentication.service";
import CustomStore from 'devextreme/data/custom_store';
import 'rxjs/add/operator/toPromise';
import { Http, HttpModule } from '@angular/http';
import { EndPointsConfig } from "../../../models/endpointsconfig";
import { DxDataGridComponent, DxDataGridModule, DxSelectBoxModule } from 'devextreme-angular';
import 'devextreme/data/odata/store';
import { SpecifiedEntitiesReport } from '../../../models/SpecifiedEntitiesReport';
import { Division } from "../../../models/division";

@Component({
  selector: 'app-ser',
  templateUrl: './ser.component.html',
  styleUrls: ['./ser.component.css']
})
export class serComponent implements OnInit {
  @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
  private SpecifiedEntitiesReportList: SpecifiedEntitiesReport[] = [];
  private CustomerCounty: County[] = [];
  private CustomerState: States[] = [];
  userProfile: any;
  saleAmountHeaderFilter: any;
  applyFilterTypes: any;
  currentFilter: any;
  showFilterRow: boolean;
  showHeaderFilter: boolean;
  private SearchState: string;
  CountyByStateDataSource: any;
  private SearchCountyID: number;
  private StateID: number;
  private ContactType: number;
  private GetProductLineName: ProductLines[] = [];
  private GetDivisionList: Division[] = [];
  private GetProdLinesByDiv: ProductLines[] = [];
  private DivisionID: number;
  private searchPrdLine: number;
  private pagelength: number;
  SpecifiedEntitiesdataSource: any = {};
  constructor( @Inject(Http) http: Http, private metaService: MetadataService, private userService: UserService, public auth: AuthenticationService) {
    this.GetAllProductline();
    this.GetAllStates();
    this.GetAllCounty(); 
    this.GetAllDivisions();
    this.userProfile = this.auth.useProfile;
    this.SpecifiedEntitiesdataSource.store = new CustomStore({
      load: function (loadOptions: any) {
        var params = '?';
        params += 'skip=' + loadOptions.skip || 0;
        params += '&take=' + loadOptions.take || 12;
        params += '&ProductLineID=' + $('#hidProductlineID').val();
        params += '&DivisionID=' + $('#hidDivisionID').val();
        params += '&StateID=' + $('#hidStateID').val();
        params += '&CountyID=' + $('#hidCountyID').val();

        console.log('parm'+params);
        if (loadOptions.sort) {
          params += '&orderby=' + loadOptions.sort[0].selector;
          if (loadOptions.sort[0].desc) {
            params += ' desc';
          }
        }
        return http.get(EndPointsConfig.HostName + EndPointsConfig.SpecifiedEntitiesReportEndPoint.replace('/', '') + params)
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
  /** Get Specified Entities Report data */
  GetAllSpecifiedEntitiesReports() {
    this.metaService.GetAllSpecifiedEntitiesReportList().subscribe(data => {
      console.log("load Specified Entities Report data");
      console.log(data[0]);
      this.SpecifiedEntitiesReportList = data;
    },
      err => {
        console.log('Specified Entities Report Data Fetch Failed..');
      });
  }
  SearchSpecifiedEntitiesReport() {
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
    $('#hidProductlineID').val('0');
    $('#hidStateID').val(' ');
    $('#hidDivisionID').val('0');
    $('#hidCountyID').val('0');
    this.DivisionID = 0;
    this.searchPrdLine = 0;
    this.SearchState = null;
    this.SearchCountyID = 0;
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
      StateID: $('#hidStateID').val(),
      CountyID: $('#hidCountyID').val()
    }
    this.metaService.ExportSpeciedEntitiesReport(searchparams).subscribe(data => {
      if (data) {
        window.open(data, "_blank");
      } else {
        notify('Failed to export Specified Entities Report Data.', 'error', 2000);
      }

    },
      err => {
        console.log('Specified Entities Report Data Fetch Failed..');
      });
  }
  PDFGridData() {
    var searchparams = {
      ProductLineID: $('#hidProductlineID').val(),
      DivisionID: $('#hidDivisionID').val(),
      StateID: $('#hidStateID').val(),
      CountyID: $('#hidCountyID').val()
    }
    this.metaService.PDFSpecifiedEntitiesReport(searchparams).subscribe(data => {
      if (data) {
        window.open(data, "_blank");
      } else {
        notify('Failed to Generate Specified Entities Report.', 'error', 2000);
      }

    },
      err => {
        console.log('Specified Entities Report Data Fetch Failed..');
      });
  } 
  // //Get states and counties
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
  GetAllCounty() {
    this.metaService.GetCounty().subscribe(data => {
      console.log("load county data");
      console.log(data);
      this.CustomerCounty = data;
      this.CustomerCounty.sort(function (a, b) { return (a.Name > b.Name) ? 1 : ((b.Name > a.Name) ? -1 : 0); });
    },
      err => {
        console.log('county Data Fetch Failed..');
      });
  }
  Countyselectedvalue(e) {
    console.log(e);
    this.SearchCountyID=e.value;
    $('#hidCountyID').val(e.value);
  }
  Stateselectedvalue(e) {
    console.log(e);
    this.SearchState = e.value;
    $('#hidStateID').val(e.value);
    this.CountyByStateDataSource = this.CustomerCounty.filter(e => e.StateID == this.SearchState);
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
  ngOnInit() {
  }
}
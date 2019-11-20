import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MetadataService } from '../../services/metadata/metadata.service';
import notify from 'devextreme/ui/notify';
import { UserService } from '../../services/user/user.service';
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
import { ContactsReport } from '../../../models/ContactsReport';

@Component({
  selector: 'app-cr',
  templateUrl: './cr.component.html',
  styleUrls: ['./cr.component.css']
})
export class crComponent implements OnInit {
  @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
  private ContactsReportList: ContactsReport[] = [];
  private ContactTypeList: ContactType[] = [];
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
  private CountyID: number;
  private StateID: string;
  private SearchContactType: string;
  private pagelength: number;
  private Address:string;
  ContactdataSource: any = {};
  constructor( @Inject(Http) http: Http, private metaService: MetadataService, private userService: UserService, public auth: AuthenticationService) {
    this.GetAllContactTypes();
    this.GetAllStates();
    this.GetAllCounty();
    this.userProfile = this.auth.useProfile;
    this.ContactdataSource.store = new CustomStore({
      load: function (loadOptions: any) {
        var params = '?';
        params += 'skip=' + loadOptions.skip || 0;
        params += '&take=' + loadOptions.take || 12;
        params += '&Contact=' + $('#SearchByContact').val();
        params += '&CountyID=' + $('#hidCountyID').val();
        params += '&StateID=' + $('#hidStateID').val();
        params += '&ContactType=' + $('#hidContactType').val();
        params += '&Address=' + $('#SearchByAddress').val();

        console.log(loadOptions);
        console.log('parm'+params);
        if (loadOptions.sort) {
          params += '&orderby=' + loadOptions.sort[0].selector;
          if (loadOptions.sort[0].desc) {
            params += ' desc';
          }
        }
        return http.get(EndPointsConfig.HostName + EndPointsConfig.ContactsReportEndPoint.replace('/', '') + params)
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
  /** Get Contacts Report data */
  GetAllContactsReports() {
    this.metaService.GetAllContactsReportList().subscribe(data => {
      console.log("load Contacts Report Data");
      console.log(data[0]);
      this.ContactsReportList = data;
    },
      err => {
        console.log('Contacts Report Data Fetch Failed..');
      });
  }
  SearchContactsReport() {
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
    $('#hidCountyID').val('0');
    $('#SearchContactType').val('');
    $('#hidStateID').val('');
    $('#SearchByAddress').val('');
    $('#SearchByContact').val('');
    this.SearchContactType = null;
    this.SearchState = null;
    this.Address = null;
    this.CountyID = 0;
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
      ContactType: $('#hidContactType').val(),
      Address: $('#SearchByAddress').val(),
      StateID: $('#hidStateID').val(),
      CountyID: $('#hidCountyID').val()
    }
    this.metaService.ExportContactReport(searchparams).subscribe(data => {
      if (data) {
        window.open(data, "_blank");
      } else {
        notify('Failed to export Contact report.', 'error', 2000);
      }

    },
      err => {
        console.log('Contact Report Data Fetch Failed..');
      });
  }
  PDFGridData() {
    var searchparams = {
      Contact: $('#SearchByContact').val(),
      ContactType: $('#hidContactType').val(),
      Address: $('#SearchByAddress').val(),
      StateID: $('#hidStateID').val(),
      CountyID: $('#hidCountyID').val()
    }
    this.metaService.PDFContactReport(searchparams).subscribe(data => {
      if (data) {
        window.open(data, "_blank");
      } else {
        notify('Failed to Generate Contact Report.', 'error', 2000);
      }

    },
      err => {
        console.log('Contact Report Data Fetch Failed..');
      });
  } 
  //Get ContactType
  GetAllContactTypes() {
    this.metaService.GetContactTypes().subscribe(data => {
      console.log("load ContactType data");
      console.log(data);
      this.ContactTypeList = data;
    },
      err => {
        console.log('Customer ContactType Data Fetch Failed..');
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
    $('#hidCountyID').val(e.value);
  }
  Stateselectedvalue(e) {
    console.log(e);
    this.SearchState = e.value;
    $('#hidStateID').val(e.value);
    this.CountyByStateDataSource = this.CustomerCounty.filter(e => e.StateID == this.SearchState);
  }

  ContactTypeChangeEvent(e) {
    $('#hidContactType').val(e.value);
  }
  ngOnInit() {
  }
}
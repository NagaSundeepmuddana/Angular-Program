import { Component, OnInit, NgModule, ViewChild, Pipe } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from "../../services/auth/authentication.service";
import { Contract } from '../../../models/Contract';
import notify from 'devextreme/ui/notify';
import { ActivatedRoute, Router, NavigationEnd, Event } from '@angular/router';
import { Division } from '../../../models/division';
import { DxDataGridComponent } from "devextreme-angular";
import { MetadataService } from '../../services/metadata/metadata.service';
import { UserService } from '../../services/user/user.service';
import { User, PITUser } from '../../../models/User';
import { Role, Permissions, UserPermissions } from '../../../models/Role';
import { Customer, CustomerDivisionMapping, CustOfficePrdLineMapping, customercontact, GetCustomerDivisions, CustomerDivisionMappingSP, CustomerType, Country, CustomerOffices, CustomerOfficeContacts, ContactType, CustomerEmailHistory, CustomerEmail } from "../../../models/customers";
import { ProjectService } from '../../services/project/project.service';
import { EndPointsConfig } from "../../../models/endpointsconfig";
import { DxDataGridModule } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import 'rxjs/add/operator/toPromise';
import { Http, HttpModule } from '@angular/http';

@Component({
  selector: 'app-trep',
  templateUrl: './trep.component.html',
  styleUrls: ['./trep.component.css']
})
export class TRepComponent implements OnInit {
  public TripReportlist: Contract[] = [];
  private CustomersList: Customer[] = [];
  dataSource: any = {};
  custid: string;
  onToolbarPreparing(e) {
    var toolbarItems = e.toolbarOptions.items;

    // Modifies an existing item
    toolbarItems.forEach((item) => {
      if (item.name == "addRowButton") {
        item.options.location = "before";
        item.options.text = "Add Trip Report";
        item.options.hint = "Add Trip Report";
        item.options.icon = "";
        item.showText = "always";
      }
    });
  }
  getMyCustomers() {
    this.metaService.GetAllCustomers().subscribe(data => {
      console.log("load Customer data");
      console.log(data);
      this.CustomersList = data;
    },
      err => {
        console.log("Customers data fetch failed.");
      });
  }
  constructor(public http: Http, private router: Router, private route: ActivatedRoute, private metaService: MetadataService, private userService: UserService, public auth: AuthenticationService, private projectService: ProjectService) {
    this.getMyCustomers();
    this.dataSource.store = new CustomStore({
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
        params += '&ProjectName=' + $('#SearchByProjName').val();
        console.log(JSON.stringify($('#hidDivisionID').val()));
           localStorage.setItem('aqr_ProjectName', JSON.stringify($('#SearchByProjName').val()) != null && typeof($('#SearchByProjName').val()) != "undefined" ? JSON.stringify($('#SearchByProjName').val()) : null);
          

        if (loadOptions.sort) {
          params += '&orderby=' + loadOptions.sort[0].selector;
          if (loadOptions.sort[0].desc) {
            params += ' desc';
          }
        }
        return http.get(EndPointsConfig.HostName + EndPointsConfig.GetTripReportEndPoint.replace('/', '') + params)
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
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        localStorage.setItem('TripURl', JSON.stringify(event.url));
      }
      this.custid = this.route.snapshot.paramMap.get('id')
      console.log('Notify', this.custid)
      //this.getMyCustomers();
    });
  }

  ngOnInit() {
  }

}

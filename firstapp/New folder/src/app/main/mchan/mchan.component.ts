import { Component, OnInit, NgModule, ViewChild, Pipe ,Inject} from '@angular/core';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from "../../services/auth/authentication.service";
import { Contract } from '../../../models/Contract';
import notify from 'devextreme/ui/notify';
import { Division } from '../../../models/division';
import { DxDataGridComponent } from "devextreme-angular";
import { MetadataService } from '../../services/metadata/metadata.service';
import { UserService } from '../../services/user/user.service';
import { User, PITUser } from '../../../models/User';
import { Role, Permissions, UserPermissions } from '../../../models/Role';
import { EndPointsConfig } from "../../../models/endpointsconfig";
import { ProjectService } from '../../services/project/project.service';

import { DxDataGridModule } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import 'rxjs/add/operator/toPromise';
import { Http, HttpModule } from '@angular/http';
import { DxTabsModule, DxSelectBoxModule } from 'devextreme-angular';

@Component({
  selector: 'app-mchan',
  templateUrl: './mchan.component.html',
  styleUrls: ['./mchan.component.css']
})
export class MchanComponent implements OnInit {
  ProjectsList: any = {};
  userProfile: any;
  TodaysDate: Date = new Date();
  ProjectID: number;
  IsProjectTab: boolean = false;
  IsQuoteTab: boolean = false;
  IsCustomerTab: boolean = false;
  IsGeneralTab: boolean = false;
  TabSelectedIndex: number;
  dataSource: any = {};
  quoteTabsDataSource: any[] = [{
    "id": 1,
    "text": "Project",
  },
  {
    "id": 2,
    "text": "Quote"
  },
  {
    "id": 3,
    "text": "Customer"
  },
  {
    "id": 4,
    "text": "General"
  }];
  
  PriorityStatus: any[] = [{
    "PriorityStatusID": 1,
    "Name": "Critical",
  },
  {
    "PriorityStatusID": 2,
    "Name": "High"
  },
  {
    "PriorityStatusID": 3,
    "Name": "Medium"
  },
  {
    "PriorityStatusID": 4,
    "Name": "Low"
  }];
  constructor( @Inject(Http) http: Http, private metaService: MetadataService, private userService: UserService, public auth: AuthenticationService, private projectService: ProjectService) {

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
           localStorage.setItem('aqr_ProjectName', JSON.stringify($('#SearchByProjName').val()) != null && typeof($('#SearchByProjName').val()) != "undefined" ? JSON.stringify($('#SearchByProjName').val()) : null);
           localStorage.setItem('aqr_ProjectName', JSON.stringify($('#SearchByProjName').val()) != null && typeof($('#SearchByProjName').val()) != "undefined" ? JSON.stringify($('#SearchByProjName').val()) : null);
           localStorage.setItem('aqr_ProjectName', JSON.stringify($('#SearchByProjName').val()) != null && typeof($('#SearchByProjName').val()) != "undefined" ? JSON.stringify($('#SearchByProjName').val()) : null);
           localStorage.setItem('aqr_ProjectName', JSON.stringify($('#SearchByProjName').val()) != null && typeof($('#SearchByProjName').val()) != "undefined" ? JSON.stringify($('#SearchByProjName').val()) : null);


        if (loadOptions.sort) {
          params += '&orderby=' + loadOptions.sort[0].selector;
          if (loadOptions.sort[0].desc) {
            params += ' desc';
          }
        }
        return http.get(EndPointsConfig.HostName + EndPointsConfig.MessageChannelReportEndPoint.replace('/', '') + params)
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
  
  TabSelectionChanged2(e) {
    if (e.addedItems[0].id == 1) {
      this.IsCustomerTab = false;
      this.IsQuoteTab = false;
      this.IsGeneralTab = false;
      this.IsProjectTab = true;
    }
    else if (e.addedItems[0].id == 2) {
      this.TabSelectedIndex = 1;
      this.IsProjectTab = false;
      this.IsQuoteTab = true;
      this.IsCustomerTab = false;
      this.IsGeneralTab = false;
    }
    else if (e.addedItems[0].id == 3) {
      this.TabSelectedIndex = 1;
      this.IsProjectTab = false;
      this.IsQuoteTab = false;
      this.IsCustomerTab = true;
      this.IsGeneralTab = false;
    }
    else {
      this.TabSelectedIndex = 4;
      this.IsProjectTab = false;
      this.IsQuoteTab = false;
      this.IsGeneralTab = true;
      this.IsCustomerTab = false;
    }
  }
  Submitproject(){
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
   
    console.log('Message',this.TabSelectedIndex);
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    var ProjectMessage = {     
      
      ProjectID: $('#ProjectNameP').val(),      
      Active: true,
      CreatedBy: this.userProfile.sub,
      CreatedDate: $('#today').val(),

    }
    console.log($('#PeopleTavelled input').val());
    this.projectService.AddprojectMessage(ProjectMessage).subscribe(data => {
      notify('Data has been saved successfully.', 'success', 2000);

    },
      err => {
        notify('Exception occured.', 'error', 4000);
      });

  }
  ngOnInit() {
  }

}

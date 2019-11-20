import { Component, OnInit, transition } from '@angular/core';
import { ProcessRunControl, ProcessRunControlDataByPrcsID } from '../../../models/ProcessRunControl';
import { MetadataService } from '../../services/metadata/metadata.service';
import notify from 'devextreme/ui/notify';
import { UserService } from '../../services/user/user.service';
import { User } from '../../../models/User';
import { AuthenticationService } from "../../services/auth/authentication.service";
import { containsTree } from '@angular/router/src/url_tree';
import { ProjectStaging, ProjectStagingItems } from '../../../models/Staging';
import { ProjectService } from '../../services/project/project.service';

@Component({
  selector: 'app-prc',
  templateUrl: './prc.component.html',
  styleUrls: ['./prc.component.css']
})
export class prcComponent implements OnInit {
  private ProcessRunControlList: ProcessRunControl[] = [];
  userProfile: any;
  ProcessRunControlID: string;
  emailPopupVisible: boolean = false;
  tcdotPopupVisible: boolean = false;
  ProcessRunPopupVisible: boolean = false;
  PrcsDataByID: ProcessRunControlDataByPrcsID[] = [];
  PrcsDataByIDDataSource: any;
  DataLoadID: number;
  public ProjectStagingItemsList: ProjectStagingItems[] = [];
  ProjectStagingItemsListDataSource: any;
  prjitemPopupVisible: boolean = false;

  constructor(private projectService: ProjectService, private metaService: MetadataService, private userService: UserService, public auth: AuthenticationService) {
    this.userProfile = this.auth.useProfile;
    this.GetAllProcessRunControl();
  }
  /** Get Divisions data */
  GetAllProcessRunControl() {
    this.metaService.GetProcessRunControl().subscribe(data => {
      console.log("load Process Run Control data");
      console.log(data);
      this.ProcessRunControlList = data;
    },
      err => {
        console.log('Process Run Control Data Fetch Failed..');
      });
  }
  OpenPrcsDataModal(e: any) {
    console.log(e);
    if (e.key)
      this.ProcessRunControlID = e.key.ProcessRunControlID;
    else
      this.ProcessRunControlID = e;
    this.GetStagingProjects(this.ProcessRunControlID);
  }

  GetStagingProjects(ProcessRunControlID) {
    console.log(ProcessRunControlID);
    this.metaService.GetProcessDataByRunCtrlID(ProcessRunControlID).subscribe(data => {
      this.PrcsDataByID = data;
      if (this.PrcsDataByID.length > 0) {
        if (this.PrcsDataByID[0].ProcessID == "PRCS000002") {
          this.PrcsDataByIDDataSource = {
            store: {
              type: "array",
              data: this.PrcsDataByID,
              key: "RequestID"
            }
          }
          this.emailPopupVisible = true;
        } else if (this.PrcsDataByID[0].ProcessID == "PRCS000001") {
          this.PrcsDataByIDDataSource = {
            store: {
              type: "array",
              data: this.PrcsDataByID,
              key: "DataLoadID"
            }
          }
          this.tcdotPopupVisible = true;
        } else {
          notify('No data found.', 'error', 2000);
        }
      } else {
        notify('No data found.', 'error', 2000);
      }
      console.log(this.PrcsDataByIDDataSource);
    },
      err => {
        console.log('Project items Data Fetch Failed..');
      });
  }


  OpenStagedItemsMdl(e: any) {
    console.log(e);
    if (e.key)
      this.DataLoadID = e.key;
    else
      this.DataLoadID = e;
    this.GetStagingProjectItems(this.DataLoadID);
    this.prjitemPopupVisible = true;
  }
  CloseProcessRunPopup() {
    this.ProcessRunPopupVisible = false;
  }
  CloseProcessRunItemsPopup() {
    this.prjitemPopupVisible = false;
  }
  CloseInfoPopup(){
    this.tcdotPopupVisible=false;
  }
  CloseEmailInfoPopup(){
    this.emailPopupVisible=false;
  }
  GetStagingProjectItems(DataLoadID) {
    console.log(DataLoadID);
    this.projectService.GetStagingProjectItems(DataLoadID).subscribe(data => {
      console.log(data);
      this.ProjectStagingItemsList = data;
      this.ProjectStagingItemsListDataSource = {
        store: {
          type: "array",
          data: this.ProjectStagingItemsList,
          key: "DataLoadItemID"
        }
      }
    },
      err => {
        console.log('Project items Data Fetch Failed..');
      });
  }
  ngOnInit() {
  }
}
import { Component, OnInit, NgModule, ViewChild, Pipe } from '@angular/core';
import { AuthenticationService } from "../../services/auth/authentication.service";
import { Project, ProjCategory, ProjSubCategory, Item, AssemblyList, ProjectItem, ProjectAssembly, States, County } from '../../../models/Project';
import { ProjectService } from '../../services/project/project.service';
import { MetadataService } from '../../services/metadata/metadata.service';
import { UserService } from '../../services/user/user.service';
import { ProjectStaging, ProjectStagingItems } from '../../../models/Staging';
import { Role, Permissions, UserPermissions } from '../../../models/Role';
import notify from 'devextreme/ui/notify';
import { EndPointsConfig } from "../../../models/endpointsconfig";

@Component({
  selector: 'app-prjstg',
  templateUrl: './prjstg.component.html',
  styleUrls: ['./prjstg.component.css']
})
export class PrjstgComponent implements OnInit {
  UserPermissionsList: UserPermissions;
  checkBoxesMode: any;
  userProfile: any;
  DataLoadID: number;
  public ProjectState: States[] = [];
  private ProjectCounty: County[] = [];
  public StagingProjectList: ProjectStaging[];
  public ProjectStagingItemsList: ProjectStagingItems[] = [];
  ProjectStagingItemsListDataSource: any;
  itemPopupVisible: boolean = false;
  isDataFetched: boolean = false;
  SelectedDataIds: string = "";
  IsDisabled: boolean = true;
  selectedRows: number[];
  HeaderData: ProjectStaging = new ProjectStaging();
  FileUploadPopupVisible: boolean = false;
  value: any[] = [];
  endpoint: string = EndPointsConfig.HostName + EndPointsConfig.TxDotImport;
  ProcessRunControlID: string;

  constructor(private projectService: ProjectService, private metadataService: MetadataService, private userService: UserService, public auth: AuthenticationService) {
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    this.UserPermissionsList = JSON.parse(localStorage.getItem('rolespermissionslist'));
    this.checkBoxesMode = "always";
    //GET PROJECTS
    this.GetAllStagingProjects();
    this.endpoint = this.updateQueryStringParameter(this.endpoint, "CreatedBy", this.userProfile.sub);

    //Get states and counties
    if (this.metadataService.StatesList && this.metadataService.StatesList.length > 0) {
      this.ProjectState = this.metadataService.StatesList;
    } else {
      this.metadataService.GetStates().subscribe(data => {
        this.metadataService.StatesList = data;
        this.ProjectState = data;
      }, err => {
        console.log('Get county data failed..');
      });
    }

    if (this.metadataService.CountyList && this.metadataService.CountyList.length > 0) {
      this.ProjectCounty = this.metadataService.CountyList;
    } else {
      this.metadataService.GetCounty().subscribe(data => {
        this.metadataService.CountyList = data;
        this.ProjectCounty = data;
      }, err => {
        console.log('Get county data failed..');
      });
    }
  }
  GetAllStagingProjects() {
    this.projectService.GetAllStagingProjects().subscribe(data => {
      this.projectService.StagingProjectList = data;
      this.StagingProjectList = data;
      this.isDataFetched = true;
      console.log(this.StagingProjectList);
      this.HeaderData = this.StagingProjectList[0];
      this.ProcessRunControlID = this.HeaderData.ProcessRunControlID;
      this.endpoint = this.updateQueryStringParameter(this.endpoint, "ProcessRunControlID", this.ProcessRunControlID);
      console.log(this.HeaderData);
    }, err => {
      console.log('Staging projects data failed..');
    });
  }
  onRowPrepared(e) {
    if (e.rowType == 'data' && e.data.ProjectID > 0)
      e.rowElement.css('background-color', '#fcff3380');
      //e.rowElement.bgColor = "#FCFF33";
    else if (e.rowType == 'data' && e.data.Error == true)
      e.rowElement.css('background-color', '#fb1c058a');
      //e.rowElement.bgColor = "#FB1C05";
  }
  uploadmsg() {
    console.log("==================================================================");
  }
  onRowPreparedItems(e) {
    if (e.rowType == 'data' && !e.data.ItemID)
      e.rowElement.css('background-color', '#f2dede');
    else
      e.rowElement.css('background-color', 'white');
      //e.rowElement.bgColor = "#f2dede";
      //e.cellElement.css('background-color', '#f2dede');
  }
  OpenItemsModal(e: any) {
    if (e.key)
      this.DataLoadID = e.key.DataLoadID;
    else
      this.DataLoadID = e;
    this.GetStagingProjectItems(this.DataLoadID);
    this.itemPopupVisible = true;
  }

  GetStagingProjectItems(projectID) {
    //GET PROJECT ITEMS
    console.log(projectID);
    this.projectService.GetStagingProjectItems(projectID).subscribe(data => {
      this.ProjectStagingItemsList = data;
      
      this.ProjectStagingItemsListDataSource = {
        store: {
          type: "array",
          data: this.ProjectStagingItemsList,
          key: "DataLoadItemID"
        }
      }
      console.log("items list");
      console.log(this.ProjectStagingItemsListDataSource);
    },
      err => {
        console.log('Project items Data Fetch Failed..');
      });
  }
  GridSelectChangedHandler(StagingPrj) {
    if (StagingPrj.length == 0)
      this.IsDisabled = true;
    else
      this.IsDisabled = false;
    this.SelectedDataIds = "";
    for (var index: number = 0; index < StagingPrj.length; index++) {
      this.SelectedDataIds += StagingPrj[index].DataLoadID + ",";
    }
  }
  ApproveProject() {
    if (this.SelectedDataIds.length > 0) {
      var ApprPrj = {
        DataLoadIDs: this.SelectedDataIds,
        UserID: this.userProfile.sub
      }
      this.projectService.ApprroveStagedProjects(ApprPrj).subscribe(data => {
        this.GetAllStagingProjects();
        notify('Selected projects has been approved successfully.', 'success', 2000);
      },
        err => {
          notify('Exception occured.', 'error', 2000);
        });
    } else {
      notify('Please select atleast one project.', 'error', 2000);
    }
  }
  onCellPrepared(e) {

  }
  ImportProjectMdlOpen() {
    this.value = [];
    this.FileUploadPopupVisible = true;
  }
  updateQueryStringParameter(uri, key, value) {
    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf('?') !== -1 ? "&" : "?";
    if (uri.match(re)) {
      return uri.replace(re, '$1' + key + "=" + value + '$2');
    }
    else {
      return uri + separator + key + "=" + value;
    }
  }
  ngOnInit() {
  }

}


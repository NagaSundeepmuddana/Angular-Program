import { Component, OnInit } from '@angular/core';
import { Division } from '../../../models/division';
import { Project } from '../../../models/project';
import { MetadataService } from '../../services/metadata/metadata.service';
import { ProjectService } from '../../services/project/project.service';

@Component({
  selector: 'app-pcr',
  templateUrl: './pcr.component.html',
  styleUrls: ['./pcr.component.css']
})
export class PcrComponent implements OnInit {
  private ProjectsList: Project;
  private DivisionsList: Division[] = [];
  selProject: any;
  FromDate: string;
  ToDate: string;
  selDivisionList: any;
  Project: any;
  pcrReportData: any;
  pcrReportLoading: boolean = false;
  onToolbarPreparing(e) {
    var toolbarItems = e.toolbarOptions.items;
    // Modifies an existing item
    toolbarItems.forEach((item) => {
      if (item.name == "addRowButton") {
        item.options.text = "Add Process";
        item.options.hint = "Add Process";
        item.options.icon="";
        item.showText = "always";
        console.log(item);
      }
    });
  }
  /**
   * Creates an instance of LdrComponent.
   * @param {MetadataService} metaService 
   * @memberof LdrComponent
   */
  constructor(private metaService: MetadataService, private projectService: ProjectService) {
    var _localData = JSON.parse(window.localStorage.getItem('Projects'));
    console.log('Local Projects Data');
    console.log(_localData);
    if (_localData != null) {
      this.ProjectsList = _localData;
    } else {
      this.projectService.GetProjectById(0).subscribe(data => {
        console.log(data);
        window.localStorage.setItem('Projects', JSON.stringify(data));
        this.ProjectsList = data;
      },
        err => {
          console.log('Customer Data Fetch Failed..');
        });

    }
    //Get Divisions Data
    var _localDivData = JSON.parse(window.localStorage.getItem('Divisions'));
    if (_localDivData != null) {
      this.DivisionsList = _localDivData;
    } else {
      this.metaService.GetDivisions("0").subscribe(data => {
        console.log(data);
        window.localStorage.setItem('Divisions', JSON.stringify(data));
        this.DivisionsList = data;
      },
        err => {
          console.log('Division Data Fetch Failed..');
        });
    }
  }

  ngOnInit() {
  }

  /**
   * 
   * Generate Letting Date Report.
   * @memberof LdrComponent
   */
  GenerateReport(pcfFormData: any): void {
    //notify("This is test..", "error", 3000);
    this.pcrReportLoading = true;
    console.log(pcfFormData);
    var Proj_id = null;
    if (this.selProject) {
      Proj_id = this.selProject.PRJID;
    }
    this.GetLDRReportData(pcfFormData.FromDate, pcfFormData.ToDate, pcfFormData.Project, pcfFormData.selDivisionList);
  }

  /**
   * 
   * 
   * @param {any} m 
   * @memberof LdrComponent
   */
  SetSelectedProject(m) {
    this.selProject = m.selectedItem;
  }

  /**
   * 
   * 
   * @memberof LdrComponent
   */
  GetLDRReportData(FromDate: string, ToDate: string, ProjectID: number, DevisioLst: string) {
    this.metaService.GetPCRReportData(FromDate, ToDate, ProjectID, DevisioLst).subscribe(data => {
      this.pcrReportLoading = false;
      this.pcrReportData = data;
      // this.pcrReportData = {
      //   fields: [{
      //     caption: 'Project',
      //     width: 120,
      //     dataField: 'PROJECTNAME',
      //     area: 'row'
      //   }, {
      //     dataField: 'DIVNAME',
      //     dataType: 'string',
      //     area: 'column'
      //   }, {
      //     caption: 'Total Price($)',
      //     dataField: 'TOTALPRICE',
      //     dataType: 'number',
      //     summaryType: 'sum',
      //     format: 'currency',
      //     area: 'data'
      //   }, {
      //     caption: 'Margin (%)',
      //     dataField: 'MARGIN',
      //     dataType: 'number',
      //     summaryType: 'average',
      //     format: 'number',
      //     area: 'data'
      //   }],
      //   store: data
      // }
      console.log(this.pcrReportData);
    }, err => {

    });
  }

  /**
   * 
   * 
   * @param {any} m 
   * @memberof LdrComponent
   */
  SetSelectedDivision(m) {
    console.log(m);
  }

  ClearParameters() {
    this.FromDate = null;
    this.ToDate = null;
    this.Project = null;
    this.selDivisionList = null;
  }

}

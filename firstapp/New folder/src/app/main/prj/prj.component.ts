import { Component, OnInit, NgModule, ViewChild, Pipe } from '@angular/core';
import { DatePipe } from '@angular/common';
//import {DragAndDropModule} from 'angular-draggable-droppable';
//import { DragulaService} from 'ng2-dragula/ng2-dragula';
import { AuthenticationService } from "../../services/auth/authentication.service";
import { Project, ProjCategory, ProjSubCategory, Item, ItemAssemblySearchResult, AssemblyList, ProjectItem, ProjectAssembly, States, County, ProjectComments } from '../../../models/Project';
import { Contract } from '../../../models/Contract';
import { Division } from '../../../models/division';
import { DxDataGridComponent } from "devextreme-angular";
import { MetadataService } from '../../services/metadata/metadata.service';
import { UserService } from '../../services/user/user.service';
import { User, PITUser } from '../../../models/User';
import { Role, Permissions, UserPermissions } from '../../../models/Role';
import { ProjectService } from '../../services/project/project.service';
import { ProjectCategories, ProjectSubCategories } from '../../../models/projectcatagories';
import { ProductLines, ProductlineDivisions } from '../../../models/ProductLines';
import { PrimcomService } from '../../services/utilities/primcom.service';
import notify from 'devextreme/ui/notify';
import { strictEqual } from 'assert';
import { Router, NavigationEnd, Event  } from '@angular/router';
import 'rxjs/add/operator/filter';
// import 'devextreme/integration/jquery';
@Component({
  selector: 'app-prj',
  templateUrl: './prj.component.html',
  styleUrls: ['./prj.component.css']
})
export class PrjComponent implements OnInit {
  //router: any;
  previousUrl: string;
  ContractTypeValue: any = null;
  UserPermissionsList: UserPermissions;
  pattern: any = /^\(\d{3}\)\ \d{3}-\d{4}$/i;
  project: any;
  now: Date = new Date();
  IsNoRecord: boolean = false;
  AssemblyList: AssemblyList[];
  Quantity: number;
  flag: boolean = false;
  DivisionID: number;
  ProductLineID: number;
  IsProjectEdited: boolean = false;
  IsCommentBox: boolean = false;
  IsItemEdited: boolean = false;
  TodaysDate: Date = new Date();
  userProfile: any;
  saveSuccess: boolean = false;
  Status: any;
  ProjectNameField: any;
  StateValue: any;
  CountyValue: any;
  Project: any;
  Control: any;
  FromDate: string;
  ToDate: string;
  state: any;
  projectLoading: boolean = false;
  itemPopupVisible: boolean = false;
  loadingVisible = false;
  IsDisabled: boolean = true;
  AssemblyBtnIsDisabled: boolean = true;
  IsPopupDisabled: boolean = false;
  @ViewChild("itemListGrid") itmGrid: DxDataGridComponent;
  @ViewChild("grid") projectGrid: DxDataGridComponent;
  @ViewChild(DxDataGridComponent) dxDataGrid: DxDataGridComponent
  selectedRowKeys: number[];
  selectedRows: number[];
  selectedAssemblyRows: number[];
  defaultVisible = false;
  toolTipClass: string;
  public ProjectID: number;
  isDataFetched: boolean = false;
  popupVisible = false;
  ProjectComments: ProjectComments[] = [];
  public ProjectsList: Project[] = [];
  public ProjectListDataSource: Project[] = [];
  IsDeleteProjectPopupVisible: boolean = false;
  IsUnlockProjectPopupVisible: boolean = false;
  private DivisionList: Division[] = [];
  DivisionName: string[] = [];
  private ProductLinesList: ProductLines[] = [];
  private ItemOrAssembly: string[] = [];
  proj: Project[] = [];
  private ProjectsCategory: ProjectCategories[] = [];
  private ProjectSubCategory: ProjectSubCategories[] = [];
  public ContractType: Contract[] = [];
  public ProjectState: States[] = [];
  private ProjectCounty: County[] = [];
  StateSearch: States[] = [];
  CountySearch: County[] = [];
  private ProjectItemList: ProjectItem[] = [];
  private ProjectAssemblyList: ProjectAssembly[] = [];
  ProjectAssemblyListDataSource: any;
  ItemListDataSource: any;
  ProjectItems: string = "";
  //ItemList: Item[] = [];
  ItemList: ItemAssemblySearchResult[] = [];
  ProjectAssemblies: string = "";
  IsItems: boolean = true;
  IsAssembies: boolean = false;
  lookupData: any;
  users: User[];
  PITUserList: PITUser[];
  PhoneNoRule: any;
  itemReOrderPopupVisible: boolean = false;
  selectedOrderRows: number[];
  ItemOrderList: ProjectItem[] = [];
  OrderSelectedItem: ProjectItem;
  minDate: Date = new Date();
  ItemOrAssemblyValue: string = "Items";
  BusinessManager: string = "";
  //longText:string;
  onToolbarPreparing(e) {
    var toolbarItems = e.toolbarOptions.items;
    // Modifies an existing item
    toolbarItems.forEach((item) => {
      if (item.name == "addRowButton") {
        item.options.text = "Add Project";
        item.options.hint = "Add Project";
        item.options.icon = "";
        item.options.va = "";
        item.showText = "always";
      }
    });
  }

  constructor(private projectService: ProjectService, private metadataService: MetadataService, private userService: UserService, private _router: Router) {
    this.UserPermissionsList = JSON.parse(localStorage.getItem('rolespermissionslist'));
    localStorage.setItem('AccordionID', JSON.stringify('0'));
    this.ItemOrAssembly = ["Items", "Assembly"];
    this.ItemOrAssemblyValue = "Items";
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    this.ProjectCounty = JSON.parse(localStorage.getItem('CountyData'));
    

    //Get states and counties
    if (this.metadataService.StatesList && this.metadataService.StatesList.length > 0) {
      this.ProjectState = this.metadataService.StatesList;
      this.StateSearch = this.metadataService.StatesList;
    } else {
      this.metadataService.GetStates().subscribe(data => {
        this.metadataService.StatesList = data;
        this.ProjectState = data;
        this.StateSearch = data;
      }, err => {
        console.log('Get county data failed..');
      });
    }

    if (this.metadataService.CountyList && this.metadataService.CountyList.length > 0) {
      this.ProjectCounty = this.metadataService.CountyList;
      
      if(JSON.parse(localStorage.getItem('ProjectInfoURL')) != null && JSON.parse(localStorage.getItem('ProjectInfoURL')).toString().includes("prjdts"))
      {
        this.GetPersistantSearchProject();
      }
      else
      {
        localStorage.removeItem('ContractTypeValue');
        localStorage.removeItem('ProjectNameField');
        localStorage.removeItem('ProjectNumber');
        localStorage.removeItem('ControlNumber');
        localStorage.removeItem('FromDate');
        localStorage.removeItem('ToDate');
        this.GetAllProjects();
      }
    } else {
      this.metadataService.GetCounty().subscribe(data => {
        this.metadataService.CountyList = data;
        this.ProjectCounty = data;
        
        if(JSON.parse(localStorage.getItem('ProjectInfoURL')) != null && JSON.parse(localStorage.getItem('ProjectInfoURL')).toString().includes("prjdts"))
        {
          this.GetPersistantSearchProject();
        }
        else
        {
          localStorage.removeItem('ContractTypeValue');
          localStorage.removeItem('ProjectNameField');
          localStorage.removeItem('ProjectNumber');
          localStorage.removeItem('ControlNumber');
          localStorage.removeItem('FromDate');
          localStorage.removeItem('ToDate');
          localStorage.removeItem('StateFieldValue');
          localStorage.removeItem('CountyFieldValue');
          localStorage.removeItem('Status');
          this.GetAllProjects();
        }
      }, err => {
        console.log('Get county data failed..');
      });
      //this.GetAllProjects();
    }
    this.getFilteredSubCategory = this.getFilteredSubCategory.bind(this);
    this.getFilteredCounties = this.getFilteredCounties.bind(this);

    //Get Contract Type
    this.metadataService.GetContractType().subscribe(data => {
      this.ContractType = data;
      if (this.ContractType !== undefined && this.ContractType.length > 0) {
      this.ContractType.sort(function (a, b) { return (a.Name > b.Name) ? 1 : ((b.Name > a.Name) ? -1 : 0); });
    }
    },
      err => {
        console.log('Contract Type Data Fetch Failed..');
      });

    //Get Business Manager List
    if (this.userService.PITUserList && this.userService.PITUserList.length > 0) {
      this.PITUserList = this.userService.PITUserList;
    } else {
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
  }
  setUserValue(rowData: any, value: any): void {
    (<any>this).defaultSetCellValue(rowData, value);
  }

  setCategoryValue(rowData: any, value: any): void {
    rowData.ProjectSubCatID = null;
    (<any>this).defaultSetCellValue(rowData, value);
  }

  getFilteredSubCategory(options) {
    return {
      store: this.ProjectSubCategory,
      filter: options.data ? ["ProjectCatID", "=", options.data.ProjectCatID] : null
    };
  }
  StateValChanged() {
    console.log('val changed for state');
  }

  setStateValue(rowData: any, value: any): void {
    rowData.CountyID = null;
    (<any>this).defaultSetCellValue(rowData, value);
  }

  getFilteredCounties(options) {
      return {
        store: this.ProjectCounty,
        filter: options.data ? ["StateID", "=", options.data.StateID] : null
      };
  }

  GetAllProjects() {
    this.projectService.GetAllProjects().subscribe(data => {
      this.projectService.ProjectList = data;
      this.ProjectsList = data;
      this.isDataFetched = true;
      this.ProjectListDataSource = data;
    }, err => {
      console.log('Get projects data failed..');
    });
  }

  GetProject(formData: any): void {
    var FromDate;
    var ToDate;
    if (typeof(formData.FromDate) != "undefined" && formData.FromDate != null) 
    {
      if(formData.FromDate.toString().length > 0 && formData.FromDate.toString().indexOf('/') == -1)
      {
        var datePipe = new DatePipe(formData.FromDate);
        if (formData.FromDate)
          FromDate = datePipe.transform(formData.FromDate, 'MM/dd/yyyy');
      }
      else
        FromDate = formData.FromDate;
    }
    if(typeof(formData.ToDate) != "undefined" && formData.ToDate != null)
    {
      if(formData.ToDate.toString().length > 0 && formData.ToDate.toString().indexOf('/') == -1)
      {
        var datePipe2 = new DatePipe(formData.ToDate);
        if (formData.ToDate)
           ToDate = datePipe2.transform(formData.ToDate, 'MM/dd/yyyy');
      }
      else
        ToDate = formData.ToDate;
    }
    var _status = false;
    if (formData.Status == "In-Active")
      _status = false;
    else
      _status = true;
      
      localStorage.setItem('ContractTypeValue', formData.ContractTypeValue != null && typeof(formData.ContractTypeValue) != "undefined" ? formData.ContractTypeValue : null);
      localStorage.setItem('ProjectNameField', formData.ProjectNameField != null && typeof(formData.ProjectNameField) != "undefined" ? formData.ProjectNameField : null);
      localStorage.setItem('ProjectNumber', formData.Project != null && typeof(formData.Project) != "undefined" ? formData.Project : null);
      localStorage.setItem('ControlNumber', formData.Control != null && typeof(formData.Control) != "undefined" ? formData.Control : null);
      localStorage.setItem('FromDate', FromDate);
      localStorage.setItem('ToDate', ToDate);
      localStorage.setItem('StateFieldValue', formData.StateValue != null && typeof(formData.StateValue) != "undefined" ? formData.StateValue : null);
      localStorage.setItem('CountyFieldValue', formData.CountyValue != null && typeof(formData.CountyValue) != "undefined" ? formData.CountyValue : null);
      localStorage.setItem('Status', formData.Status != null && typeof(formData.Status) != "undefined" ? formData.Status : "Active");
      this.projectLoading = true;
    if (formData.ContractTypeValue != "NaN" || formData.ContractTypeValue != "" || formData.ProjectNameField != undefined || formData.Project != undefined || formData.Control != undefined || FromDate != null || ToDate != null || formData.StateValue != null || formData.CountyValue != null) 
    {
      if(formData.ContractTypeValue == "NaN" || formData.ContractTypeValue == NaN)
        formData.ContractTypeValue = 0 ;
      this.projectService.GetFilteredProjects(formData.ContractTypeValue, formData.ProjectNameField, formData.Project, formData.Control, FromDate, ToDate, _status, formData.StateValue, formData.CountyValue).subscribe(data => {
        this.ProjectsList = data;
        this.proj = data;
      },
        err => {
          console.log('Filtered Project Data Fetch Failed..');
        });
      this.projectLoading = false;
    }
    else
    {
      this.GetAllProjects();
      this.projectLoading = false;
    }
  }

  GetPersistantSearchProject(): void {
    this.isDataFetched = false;
    
      this.ContractTypeValue = localStorage.getItem('ContractTypeValue') != null && typeof(localStorage.getItem('ContractTypeValue')) != undefined && localStorage.getItem('ContractTypeValue') != "null" ? localStorage.getItem('ContractTypeValue') : null ;
      this.ProjectNameField = localStorage.getItem('ProjectNameField') != null && typeof(localStorage.getItem('ProjectNameField')) != undefined && localStorage.getItem('ProjectNameField') != "null" ? localStorage.getItem('ProjectNameField') : null;
      this.Project = localStorage.getItem('ProjectNumber') != null && typeof(localStorage.getItem('ProjectNumber')) != undefined && localStorage.getItem('ProjectNumber') != "null" ? localStorage.getItem('ProjectNumber') : null;
       this.Control = localStorage.getItem('ControlNumber') != null && typeof(localStorage.getItem('ControlNumber')) != undefined && localStorage.getItem('ControlNumber') != "null" ? localStorage.getItem('ControlNumber') : null;
      this.FromDate = localStorage.getItem('FromDate') != null && typeof(localStorage.getItem('FromDate')) != undefined &&  localStorage.getItem('FromDate') != "null" &&  localStorage.getItem('FromDate') != "undefined" ? localStorage.getItem('FromDate') : null;
      this.ToDate = localStorage.getItem('ToDate') != null && typeof(localStorage.getItem('ToDate')) != undefined && localStorage.getItem('ToDate') != "null" && localStorage.getItem('ToDate') != "undefined" ? localStorage.getItem('ToDate') : null;
      this.StateValue = localStorage.getItem('StateFieldValue') != null && typeof(localStorage.getItem('StateFieldValue')) != undefined && localStorage.getItem('StateFieldValue') != "null" ? localStorage.getItem('StateFieldValue') : null;
      this.CountyValue = localStorage.getItem('CountyFieldValue') != null && typeof(localStorage.getItem('CountyFieldValue')) != undefined && localStorage.getItem('CountyFieldValue') != "null" ? localStorage.getItem('CountyFieldValue') : null;
      this.Status = localStorage.getItem('Status') != null && typeof(localStorage.getItem('Status')) != undefined && localStorage.getItem('Status') != "null" ? localStorage.getItem('Status') : "Active";
      var _formData = {
        _ContractTypeID: this.ContractTypeValue != null ? parseInt(this.ContractTypeValue) : null,
        ProjectName: this.ProjectNameField,
        Project: this.Project,
        Control: this.Control,
        FromDate: this.FromDate,
        ToDate: this.ToDate,
        StateValue: this.StateValue,
        CountyValue: this.CountyValue != null ? parseInt(this.CountyValue) : null,
        Status: this.Status
      }
      var FromDate = _formData.FromDate;
      var ToDate = _formData.ToDate;
      var _status = false;
      if (_formData.Status == "In-Active")
        _status = false;
      else
        _status = true;
      this.projectLoading = true;
      
    if (_formData._ContractTypeID != null || _formData.ProjectName != undefined || _formData.Project != undefined || _formData.Control != undefined || FromDate != null || ToDate != null || _formData.StateValue != null || _formData.CountyValue != null) 
    {
      this.ContractTypeValue = _formData._ContractTypeID;
      this.CountyValue = _formData.CountyValue;
      this.projectService.GetFilteredProjects(_formData._ContractTypeID, _formData.ProjectName, _formData.Project, _formData.Control, FromDate, ToDate, _status, _formData.StateValue, _formData.CountyValue).subscribe(data => {
      this.ProjectsList = data;
      this.proj = data;
      },
        err => { 
          console.log('Filtered Project Data Fetch Failed.');
        });
      this.projectLoading = false;
      this.isDataFetched = true;
    }
    else
    {
      this.GetAllProjects();
      this.projectLoading = false;
    }
  }

  OpenItemsModal(e: any) {
    this.flag = false;
    if (e.key)
      this.ProjectID = e.key.ProjectID;
    else
      this.ProjectID = e;
    this.IsItems = true;
    this.IsAssembies = false;
    this.itemPopupVisible = true;
    this.DivisionID = 0;
    this.ProductLineID = 0;
    $('#serachItemsOrAssemblyBox').val('');
    this.GetProjectItems(this.ProjectID);
    this.GetAllDivisionss();
  }

  GetAllDivisionss() {
    this.metadataService.GetAllDivisions().subscribe(data => {
      this.DivisionList = data;
      this.DivisionList.forEach((element) => {
        this.DivisionName.push(element.Name);
      });
      if (this.DivisionList !== undefined && this.DivisionList.length > 0) {
      this.DivisionList.sort(function (a, b) { return (a.Name > b.Name) ? 1 : ((b.Name > a.Name) ? -1 : 0); });
      }
    },
      err => {
        console.log('Division Data Fetch Failed..');
      });
  }

  FilterWithDivisions(e) {
    this.DivisionID = e.value;
    this.ProductLineID = null;
    this.metadataService.GetProductLinesByDivId(e.value).subscribe(data => {
      this.ProductLinesList = data;
      if (this.ProductLinesList !== undefined && this.ProductLinesList.length > 0) {
      this.ProductLinesList.sort(function (a, b) { return (a.Name > b.Name) ? 1 : ((b.Name > a.Name) ? -1 : 0); });
      }
    },
      err => {
        console.log('Product lines Data Fetch Failed..');
      });
  }

  FilterWithProductLine(e) {
    this.ProductLineID = e.value;
  }

  GetProjectItems(projectID) {
    //GET PROJECT ITEMS
    this.projectService.GetProjectItems(projectID).subscribe(data => {
      this.ProjectItemList = data;
      this.ItemListDataSource = {
        store: {
          type: "array",
          data: this.ProjectItemList,
          key: "ItemID"
        }
      }
      this.ItemOrderList = this.ItemListDataSource;
    },
      err => {
        console.log('Project items Data Fetch Failed..');
      });
  }

  CurrencyFormatter(cellInfo) {
    if (cellInfo.value == null)
      cellInfo.value = 0;
    return cellInfo.value.toFixed(2).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,")
  }

  onProjectItemRowPrepared(e) {
    if (e.rowType === 'data') {
      e.rowElement.addClass('PItemRow');
    }
    //   e.rowElement.find('.PItemRow').draggable({
    //     helper: 'clone',
    //     start: function (event, ui) {
    //         var $originalRow = $(this),
    //             $clonedRow = ui.helper;
    //         var $originalRowCells = $originalRow.children(),
    //             $clonedRowCells = $clonedRow.children();
    //         for (var i = 0; i < $originalRowCells.length; i++)
    //             $($clonedRowCells.get(i)).width($($originalRowCells.get(i)).width());
    //         $clonedRow
    //           .width($originalRow.width())
    //           .addClass('drag-helper');
    //     }
    // })
  }

  ItemSelectionChangedHandler(itemsId) {
    if (itemsId.length == 0)
      this.IsDisabled = true;
    else
      this.IsDisabled = false;
    this.ProjectItemList = [];
    this.ProjectItems = "";
    for (var index: number = 0; index < itemsId.length; index++) {
      this.ProjectItemList.push(itemsId[index])
      this.ProjectItems += itemsId[index] + ",";
    }
  }

  FilterSelected(event) {
    if (event.value == "Items") {
      this.IsItems = true;
      this.IsAssembies = false;
    }
    else if (event.value == null || event.value == "null") {
      this.IsItems = true;
      this.IsAssembies = false;
    }
    else {
      this.IsItems = false;
      this.IsAssembies = true;
    }
  }

  SearchItems(e) {
    if (e.length == 3 || e.length > 3) 
    {
      if (this.IsItems == true) {
        if (this.ProductLineID == undefined)
          this.ProductLineID = null;
        this.projectService.GetItemsBySearchParam("Items", this.ProjectID, 0, this.ProductLineID, this.DivisionID, e).subscribe(data => {
          this.ItemList = data;
          if (this.ItemList.length == 0)
            this.IsNoRecord = true;
          else
            this.IsNoRecord = false;
          this.flag = true;
          this.IsItems = true;
          this.IsAssembies = false;
        },
          err => {
            console.log('Items Data Fetch Failed..');
          });
      }
      if (this.IsAssembies == true) {
        this.projectService.GetAssemblyBySearchParam("Assembly", this.ProjectID, 0, this.ProductLineID, e).subscribe(data => {
          this.AssemblyList = data;
          if (this.AssemblyList.length == 0)
            this.IsNoRecord = true;
          else
            this.IsNoRecord = false;
          this.flag = true;
          this.IsItems = false;
          this.IsAssembies = true;
        },
          err => {
            console.log('Assembly Data Fetch Failed..');
          });
      }
      else {
        this.projectService.GetItemsBySearchParam("Items", this.ProjectID, 0, this.ProductLineID, this.DivisionID, e).subscribe(data => {
          this.ItemList = data;
          this.flag = true;
          this.IsItems = true;
          this.IsAssembies = false;
        },
          err => {
            console.log('Assembly Data Fetch Failed..');
          });
      }
    }
    else
      this.flag = false;
  }

  CloseMatAjax(e) {
    if (e.target.classList.contains('serachItems') || e.target.classList.contains('fa-plus')) {
      this.flag = true;
    }
    else {
      this.flag = false;
      this.ItemList = [];
      this.AssemblyList = [];
      var val = $('#serachItemsOrAssemblyBox').val().toString();
      if ($.trim(val) == '')
        $('#serachItemsOrAssemblyBox').val('');
    }
  }

  AddProjectItems(e, quantity: number) {
    // if ($('#Quantity').val() == "")
    //   this.Quantity = 1;
    // else
    //   this.Quantity = +$('#Quantity').val();
    $('.AddPItems').css("pointer-events","none");
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    this.Quantity = $('#'+e.ItemID).val() == ""? 1 : +$('#'+e.ItemID).val();
    if(e.Type == 'I')
    {
      var ProjectItems = {
        ItemID: e.ItemID,
        ProjectID: this.ProjectID,
        Quantity: this.Quantity,
        OrderNumber: 0,
        ProductLineID: e.ProductLineID,
        CreatedBy: this.userProfile.sub,
        CreatedDate: $('#today').val(),
        Active: true,
        Type: e.Type
      }
      this.projectService.AddProjectItem(ProjectItems).subscribe(data => {
        if (data) {
          this.ItemList = this.ItemList.filter(m => m.ItemID != e.ItemID);
          this.GetProjectItems(this.ProjectID);
          notify('Item added successfully.', 'success', 2000);
        }
        $('.AddPItems').css("pointer-events","auto");
      }, err => {
        $('.AddPItems').css("pointer-events","auto");
      });
    }
    else {
      var ProjectAssembly = {
        ItemID: e.ItemID,
        ProjectID: this.ProjectID,
        Quantity: this.Quantity,
        OrderNumber: 0,
        CreatedBy: this.userProfile.sub,
        CreatedDate: $('#today').val(),
        Active: true,
        Type: e.Type
      }
      this.projectService.AddProjectItem(ProjectAssembly).subscribe(data => {
        if (data) {
          this.ItemList = this.ItemList.filter(m => m.ItemID != e.ItemID);
          this.GetProjectItems(this.ProjectID);
          notify('Item added successfully.', 'success', 2000);
        }
        $('.AddPItems').css("pointer-events","auto");
      }, err => {
        $('.AddPItems').css("pointer-events","auto");
      });
    }
  }

  UpdateProjectItem(e: any) {
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    var ProjectItem = {
      Quantity: e.data.Quantity,
      ItemID: e.key,
      ProjectID: this.ProjectID,
      LastModifiedBy: this.userProfile.sub,
    }
    this.projectService.UpdateProjectItems(ProjectItem).subscribe(data => {
      if (data) {
        this.GetProjectItems(this.ProjectID);
        notify('Item updated successfully.', 'success', 2000);
      }
    }, err => {
    });
  }

  AddProjectAssembly(e) {
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    this.ItemList = this.ItemList.filter(m => m.ItemID != e.ItemID);
    var ProjectAssembly = {
      AssemblyID: e.AssemblyID,
      ProjectID: this.ProjectID,
      CreatedBy: this.userProfile.sub,
    }
    this.projectService.AddProjectItemByassembly(ProjectAssembly).subscribe(data => {
      if (data) {
        this.GetProjectItems(this.ProjectID);
        notify('Assembly added successfully.', 'success', 2000);
      }
    }, err => {
    });
  }

  DeleteProjectItem(e) {
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    this.projectService.DeleteProjectItem(e.data.ProjectID, e.data.ItemID, this.userProfile.sub).subscribe(data => {
      if (data) {
        //this.GetProjectItems(this.ProjectID);
        notify('Item deleted successfully.', 'success', 2000);
      }
    }, err => {
    });
  }

  // SaveItems()
  // {
  //   this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
  //   this.loadingVisible = true;
  //   this.IsDisabled = true;
  //   this.IsPopupDisabled = true;

  //   //SAVE OR UPDATE PROJECT ITEMS
  //   this.projectService.PutProjectItems(this.ProjectID, this.ProjectItems, this.ProductLineID, this.DivisionID, 1, true, this.userProfile.sub, new Date(Date.now()), "Basanta", new Date(Date.now())).subscribe(data => {
  //     this.ProjectItemList = data;
  //     this.loadingVisible = false;
  //     this.IsPopupDisabled = false;
  //     this.itemPopupVisible = false;
  //     if(data)
  //     {
  //       this.GetAllProjects();
  //       notify('items added successfully.','success',2000);
  //     }
  //   }, err => {
  //     notify(err,'error',2000);
  //   });
  // this.saveSuccess = true;
  // }

  SetSelectedCustomer(e) {

  }

  GetProjectAssemblies(projectID) {
    this.projectService.GetProjectAssembly(1).subscribe(data => {
      this.ProjectAssemblyList = data;
      this.ProjectAssemblyListDataSource = {
        store: {
          type: "array",
          data: this.ProjectAssemblyList,
          key: "AssemblyID"
        }
      }
      this.selectedAssemblyRows = this.ProjectAssemblyList.filter(m => m.ProjectID === projectID).map(n => n.AssemblyID);
    },
      err => {
        console.log('Project assembly Data Fetch Failed..');
      });
  }

  AssemblySelectionChangedHandler(assemblyId) {
    if (assemblyId.length == 0)
      this.AssemblyBtnIsDisabled = true;
    else
      this.AssemblyBtnIsDisabled = false;
    this.ProjectAssemblies = "";
    for (var index: number = 0; index < assemblyId.length; index++) {
      this.ProjectAssemblies += assemblyId[index] + ",";
    }
  }

  SaveAssemblies() {
    this.loadingVisible = true;
    this.AssemblyBtnIsDisabled = true;
    this.IsPopupDisabled = true;

    //SAVE OR UPDATE PROJECT ASSEMBLY
    this.projectService.PutProjectAssembly(this.ProjectID, this.ProjectAssemblies, true, "Basanta", new Date(Date.now()), "Basanta", new Date(Date.now())).subscribe(data => {
      this.ProjectAssemblyList = data;
      this.loadingVisible = false;
      this.IsPopupDisabled = false;
      this.itemPopupVisible = false;
      if (data) {
        this.GetAllProjects();
        notify('Assembly added successfully.', 'success', 2000);
      }
    }, err => {
      notify(err, 'error', 2000);
    });
    this.saveSuccess = true;
  }

  CloseItemsPopup() {
    this.ContractTypeValue = localStorage.getItem('ContractTypeValue') != null ? localStorage.getItem('ContractTypeValue') : null ;
    this.ProjectNameField = localStorage.getItem('ProjectNameField') != null ? localStorage.getItem('ProjectNameField') : null;
    this.Project = localStorage.getItem('ProjectNumber') != null ? localStorage.getItem('ProjectNumber') : null;
    this.Control = localStorage.getItem('ControlNumber') != null ? localStorage.getItem('ControlNumber') : null;
    this.FromDate = localStorage.getItem('FromDate') != null ? localStorage.getItem('FromDate') : null;
    this.ToDate = localStorage.getItem('ToDate') != null ? localStorage.getItem('ToDate') : null;
    this.StateValue = localStorage.getItem('StateFieldValue') != null ? localStorage.getItem('StateFieldValue') : null;
    this.CountyValue = localStorage.getItem('CountyFieldValue') != null ? localStorage.getItem('CountyFieldValue') : null;
    
    var formData = {
      ContractType: this.ContractTypeValue != null ? parseInt(this.ContractTypeValue) : null,
      ProjectName: this.ProjectNameField,
      Project: this.Project,
      Control: this.Control,
      FromDate: this.FromDate,
      ToDate: this.ToDate,
      StateValue: this.StateValue,
      CountyValue: this.CountyValue != null ? parseInt(this.CountyValue) : null
    }
    if (formData.ContractType != null || formData.ProjectName != undefined || formData.Project != undefined || formData.Control != undefined || formData.FromDate != null || formData.FromDate != "undefined" || formData.ToDate != null || formData.ToDate != "undefined" || formData.StateValue != null || formData.CountyValue != null) 
    {
      this.GetPersistantSearchProject();
      this.projectLoading = false;
    }
    else
    {
      this.GetAllProjects();
      this.projectLoading = false;
    }
    this.IsDisabled = true;
    this.AssemblyBtnIsDisabled = true;
    this.IsPopupDisabled = false;
    this.itemPopupVisible = false;
  }

  onCellPrepared(e) {
    if (e.rowType == 'data' && e.row.data.Locked && e.column.command === "edit") {
      e.cellElement.empty();
      //e.editorOptions.disabled = true;
      //e.cellElement.css('background-color', 'rgba(171, 168, 168, 0.52)');
    }
    if (e.rowType == 'data' && !e.row.data.Active && e.column.command === "edit") {
      e.cellElement.empty();
    }
  }
  initNewRow(e) {
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    e.data.LettingDate = $('#today').val(); 
    e.data.WorkingDays = 0;
    e.data.StateID = this.ProjectState.filter(m=>m.StateID == "TX")[0].StateID;//this.ProjectState[42].StateID;// this.ProjectState.filter(m => m.StateID == "TX").map(n => n.StateID);
    if(this.userProfile.name)
    {
      e.data.BusinessManager = this.userProfile.sub;
    }  
  }
  AddNewProject(e) {
    //var datePipe = new DatePipe(e.data.LettingDate);
    //var LettingDate = "";
    //if (e.data.LettingDate)
    //  LettingDate = datePipe.transform(e.data.LettingDate, 'MM/dd/yyyy');
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    e.data.Active = true;
    e.data.CreatedBy = this.userProfile.sub;
    //console.log(e);
    e.data.Version = 1;
    e.data.Locked = false;
    e.data.LettingDate = e.data.LettingDate; //LettingDate;
    //this.isDataFetched = false;
    this.projectService.AddProject(e.data).subscribe(data => {
      if (data) {
        this.GetAllProjects();
        notify('Project saved successfully.', 'success', 2000);
      }
    }, err => {
      this.GetAllProjects();
      notify("Exception occured while creating project.", 'error', 2000);
    });
  }

  UnlockConfirmMsgPopup(e) {
    this.project = e;
    console.log(this.project);
    this.IsUnlockProjectPopupVisible = true;
  }

  DontUnlockProject() {
    //this.GetAllProjects();
    console.log(this.ProjectsList);
    this.projectGrid.instance.refresh();
    this.IsUnlockProjectPopupVisible = false;
    //this.ProjectsList = this.projectService.ProjectList;
    //this.ProjectsList = [];
    //console.log(this.ProjectsList);
    //this.ProjectsList = this.ProjectListDataSource;
    //console.log(this.ProjectsList);
    //switchon.
  }

  YesUnlockProject() {
    this.UpdateLockUnlock(this.project);
    this.IsUnlockProjectPopupVisible = false;
  }

  UpdateLockUnlock(e: any) {
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    if (e.data.Locked == false)
      e.data.Locked == true;
    else
      e.data.Locked == false;
    let LockHistory = {
      ProjectID: e.data.ProjectID,
      UserID: this.userProfile.sub,
      LockedDate: $('#today').val(),
      Active: true,
      CreatedBy: this.userProfile.sub,
      CreatedDate: $('#today').val(),
      LastModifiedBy: this.userProfile.sub,
      LastModifiedDate: $('#today').val(),
    }
    //this.isDataFetched = false;
    this.projectService.PostProjectLockHistory(LockHistory).subscribe(data => {
      if (data) {
        if (localStorage.getItem('ContractTypeValue') != null || localStorage.getItem('ContractTypeValue') != undefined || localStorage.getItem('ProjectNameField') != null || localStorage.getItem('ProjectNameField') != undefined || localStorage.getItem('ProjectNumber') != null || localStorage.getItem('ProjectNumber') != undefined || localStorage.getItem('ControlNumber') != null || localStorage.getItem('ControlNumber') != undefined || localStorage.getItem('FromDate') != null || localStorage.getItem('ToDate') != null || localStorage.getItem('StateFieldValue') != null || localStorage.getItem('CountyFieldValue') != null) 
          this.GetPersistantSearchProject();
        else
          this.GetAllProjects();
        notify('Project saved successfully.', 'success', 2000);
      }
    }, err => {
      if (localStorage.getItem('ContractTypeValue') != null || localStorage.getItem('ContractTypeValue') != undefined || localStorage.getItem('ProjectNameField') != null || localStorage.getItem('ProjectNameField') != undefined || localStorage.getItem('ProjectNumber') != null || localStorage.getItem('ProjectNumber') != undefined || localStorage.getItem('ControlNumber') != null || localStorage.getItem('ControlNumber') != undefined || localStorage.getItem('FromDate') != null || localStorage.getItem('ToDate') != null || localStorage.getItem('StateFieldValue') != null || localStorage.getItem('CountyFieldValue') != null) 
        this.GetPersistantSearchProject();
      else
        this.GetAllProjects();
      notify(err, 'error', 2000);
    });
  }

  OnProjectEditStart(e:any)
  {
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    if(e.parentType == "dataRow" && e.dataField == "BusinessManager" && !e.row.inserted)
    {
      if(!e.row.data.BusinessManager)   
      {
        e.editorOptions.value = this.userProfile.sub;
        e.row.data.BusinessManager = this.userProfile.sub;
      } 
    }
      
    //e.editorOptions.disabled = e.parentType == "dataRow" && e.dataField == "ContractTypeID" && !e.row.inserted;  
   
    if (e.parentType === "dataRow" && e.dataField === "ProjectNumber" || e.dataField === "ControlNumber" || e.dataField === "Highway") {
      e.editorOptions.onKeyPress = function(args) {
        var event = args.event;
        if (!/[0-9A-Za-z _#() -]/.test(String.fromCharCode(event.keyCode)))
          event.preventDefault();
      }
    }
  }

  UpdateProject(e) {
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    e.Locked = false;
    let project = {
      BusinessManager: e.BusinessManager,
      ProjectID: e.ProjectID,
      ContractTypeID: e.ContractTypeID,
      ContractName: e.ContractName,
      StateID: e.StateID,
      CountyID: e.CountyID,
      Version: e.PVersion,
      Locked: false,
      ProjectName: e.ProjectName,
      ProjectNumber: e.ProjectNumber,
      ControlNumber: e.ControlNumber,
      LettingDate: e.LettingDate,
      Architect: e.Architect == null || e.Architect == "" ?"":e.Architect,
      Highway: e.Highway,
      PhoneNo: e.PhoneNo == null || e.PhoneNo == "" ?"":e.PhoneNo,
      ExternalSystemRefNo: e.ExternalSystemRefNo == null || e.ExternalSystemRefNo == "" ?"":e.ExternalSystemRefNo,
      CreatedBy: e.CreatedBy,//this.userProfile.sub,
      CreatedDate: e.CreatedDate,
      LastModifiedBy: this.userProfile.sub,
      LastModifiedDate: $('#today').val(),
      //UnlockedBy:e.UnlockedBy,
      Active: true,
      WorkingDays: e.WorkingDays,
      PrimeContractor:e.PrimeContractor == null || e.PrimeContractor == "" ?"":e.PrimeContractor
    }
    //this.isDataFetched = false;
    this.projectService.UpdateProject(project).subscribe(data => {
      if (data) {
        this.GetAllProjects();
        this.IsProjectEdited = true;
        notify('Project saved successfully.', 'success', 2000);
      }
    }, err => {
      this.GetAllProjects();
      notify(err, 'error', 2000);
    });
  }

  DeleteProject(e: any) {
    this.projectService.DeleteProject(e.data.ProjectID).subscribe(data => {
      if (data == "OK")
        notify("Project deleted successfully.", 'success', 2000);
      else
        notify(data, 'error', 2000);
      this.GetAllProjects();
    }, err => {
      notify("Exception occured.", 'error', 2000);
    });
  }

  OpenChatBox(e) {
    this.ProjectID = e.data.ProjectID;
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    this.IsCommentBox = true;
    $("#style-1").dxScrollView();
    this.GetProjectComments(this.ProjectID);
  }

  SaveProjectComment() {
    if ($('#Comment').val().toString().length > 0) {
      $("#style-1").dxScrollView();
      this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
      var Comments = {
        ProjectID: this.ProjectID,
        Comment: $('#Comment').val(),
        ParentCommentID: 0,
        CreatedBy: this.userProfile.sub
      }
      this.projectService.AddProjectComments(Comments).subscribe(data => {
        if (data) {
          $('#Comment').val('');
          this.GetProjectComments(this.ProjectID);
          notify('Comments added successfully.', 'success', 2000);
        }
      }, err => {
        notify(err, 'error', 2000);
      });
    }
    else{
    notify('Please enter Comments.', 'error', 2000);
    }
  }

  GetProjectComments(ProjectID) {
    this.projectService.GetProjectComments(ProjectID).subscribe(data => {
      if (data) {
        this.ProjectComments = data;
        $("#style-1").dxScrollView();
      }
    }, err => {
      notify(err, 'error', 2000);
    });
  }

  CloseCommentPopup() {
    this.IsCommentBox = false;
  }

  /* CUSTOME DELETE 
  DeleteConfirmPopup(projectId)
  {
    this.ProjectID = projectId;
    console.log(projectId);
    this.IsDeleteProjectPopupVisible = true;
  }
 
  YesDeleteProject()
  {
    console.log(this.ProjectID);
    this.projectService.DeleteProject(this.ProjectID).subscribe(data => {
      if(data){
        notify('Quote deleted successfully.','success',2000);
        this.GetAllProjects();
    }
     }, err => {
      notify(err,'error',2000);
     });
     this.IsDeleteProjectPopupVisible = false;
  }
 
  NoDeleteProject()
  {
    this.IsDeleteProjectPopupVisible = false;
  }
  */

  //@param {any} m 
  SetSelectedProjectName(m) {
    this.ProjectNameField = m.selectedItem;
  }

  SetSelectedProject(m) {
    this.Project = m.selectedItem;
  }

  SetSelectedControl(m) {
    this.Control = m.selectedItem;
  }

  ngOnInit() {
  }

  showInfo() {
    this.popupVisible = true;
  }

  ClearParameters() {
    this.ProjectNameField = null;
    this.Project = null;
    this.Control = null;
    this.FromDate = null;
    this.ToDate = null;
    this.Status = null;
    this.StateValue = null;
    this.CountyValue = null;
    this.ContractTypeValue = null;
    //this.ProjectsList = this.projectService.ProjectList;
    this.selectedRowKeys = null;
    this.selectedRows = null;
    localStorage.removeItem('ContractTypeValue');
    localStorage.removeItem('ProjectNameField');
    localStorage.removeItem('ProjectNumber');
    localStorage.removeItem('ControlNumber');
    localStorage.removeItem('FromDate');
    localStorage.removeItem('ToDate');
    localStorage.removeItem('StateFieldValue');
    localStorage.removeItem('CountyFieldValue');
    localStorage.removeItem('Status');
    this.GetAllProjects();
  }
  OpenItemsReOrderPopUp() {
    this.OrderSelectedItem = null;
    this.selectedOrderRows = [];
    this.itemReOrderPopupVisible = true;
  }
  CloseItemsReorderPopup() {
    this.itemReOrderPopupVisible = false;
  }
  SelectedOrderRow(e) {
    console.log(e.selectedRowsData[0]);
    this.OrderSelectedItem = e.selectedRowsData[0];
  }
  DragToTop() {
    if (this.OrderSelectedItem == null) {
      notify("Please select an Item.", 'error', 2000);
    } else {
      var Order = {
        ProjectItemID: this.OrderSelectedItem.ProjectItemID,
        ProjectID: this.OrderSelectedItem.ProjectID,
        QuoteID: 0,
        QuoteItemsID: 0,
        Up: true
      };
      this.projectService.ReOrderItems(Order).subscribe(data => {
        this.GetProjectItems(this.OrderSelectedItem.ProjectID);
        notify("Items order updated successfully.", 'success', 2000);
      }, err => {
        notify(err, 'error', 2000);
      });
    }
  }
  DragToBottom() {
    if (this.OrderSelectedItem == null) {
      notify("Please select an item", 'error', 2000);
    } else {
      var Order = {
        ProjectItemID: this.OrderSelectedItem.ProjectItemID,
        ProjectID: this.OrderSelectedItem.ProjectID,
        QuoteID: 0,
        QuoteItemsID: 0,
        Up: false
      };
      this.projectService.ReOrderItems(Order).subscribe(data => {
        this.GetProjectItems(this.OrderSelectedItem.ProjectID);
        notify("Order Updated", 'success', 2000);
      }, err => {
        notify(err, 'error', 2000);
      });
    }
  }

  FilterWithState(e)
  {
    this.CountySearch = this.ProjectCounty.filter(m=>m.StateID === e.value);
  }
}

export class TruncatePipe {
  transform(value: string, args: string[]): string {
    let limit = args.length > 0 ? parseInt(args[0], 10) : 10;
    let trail = args.length > 1 ? args[1] : '...';

    return value.length > limit ? value.substring(0, limit) + trail : value;
  }
}
import { Component, OnInit, NgModule, ViewChild, Pipe } from '@angular/core';
import { AuthenticationService } from "../../services/auth/authentication.service";
import { Project, ProjCategory, ProjSubCategory, QuoteCustomerInfo, Division, Item, AssemblyList, ProductLineQuote, ProjectItem, ProjectDivisions, CustomerDivisions, CountyCustomer, ReplicateMQuote, EmailProposalContacts } from '../../../models/Project';
import { ActivatedRoute, Router, NavigationEnd, Event } from '@angular/router';
import { MetadataService } from '../../services/metadata/metadata.service';
import { ProjectService } from '../../services/project/project.service';
import { Role, Permissions, UserPermissions } from '../../../models/Role';
import { Customer, CustomerOfficeContacts } from "../../../models/customers";
import { EmailHistory } from "../../../models/EmailHistory";
import { customercontact } from "../../../models/customers";
import { DatePipe } from '@angular/common';
//import ArrayStore from "devextreme/data/array_store";
import { DxDataGridComponent } from "devextreme-angular";
import notify from 'devextreme/ui/notify';
@Component({
  selector: 'app-prjdts',
  templateUrl: './prjdts.component.html',
  styleUrls: ['./prjdts.component.css']
})
export class PrjdtsComponent implements OnInit {
  IsNoItemsVisible:boolean=false;
  TotalCost: any;
  TotalFreight: any;
  MasterQuoteCount: number = 0
  CustomerQuoteCount: number = 0;
  UnlockedQuoteCount: number = 0;
  LockedQuoteCount: number = 0;
  CurrentProductLineID: number;
  CurrentDivisionID: number;
  EditAwardBidValue: number;
  EditAwardedAmount: number;
  AwardedMarginValue: number;
  EditAwardValue: number;
  EditQuoteStatus: number;
  EditAwardDate: Date;
  EditCRMNotes: string;
  public QuoteCustomerInfo: QuoteCustomerInfo;
  RefreshPageAlert: boolean = false;
  AlertMessage: string;
  UserPermissionsList: UserPermissions;
  userPermissions: Permissions[];
  BatchLockProductLineID: number;
  BatchLockDivisionID: number;
  IsUnlockQuotePopupVisible: boolean = false;
  AwardedInfoPopupVisible:boolean=false;
  /* TripReportPopupVisible:boolean=false; */
  TodaysDate: Date = new Date();
  ProductLine: number;
  AwardQuote: number;
  AccId: number = -1;
  userProfile: any;
  Status: any;
  ProjectName: any;
  Project: any;
  Control: any;
  FromDate: string;
  ToDate: string;
  state: any;
  projectLoading: boolean = false;
  ProjectID: number;
  DivisionID: number;
  QuoteID: number;
  QuoteCustomerID: number;
  private sub: any;
  isDataFetched: boolean = false;
  private EmailProposalContactsList: EmailProposalContacts[] = [];
  private QuoteEmailProposalContacts: EmailProposalContacts[] = [];
  UnlockedQuotesList: EmailProposalContacts[] = [];
  private ProjectItemList: ProjectItem[] = [];
  ItemListDataSource: any;
  ProjectItems: string = "";
  CustomerItems: string = "";
  CustomerOffices: string = "";
  selectedRows: number[];
  selectedCustRowsForAward: number[];
  defaultVisible = false;
  itemPopupVisible: boolean = false;
  loadingVisible: boolean = false;
  emailLoadingVisible: boolean = false;
  IsDisabled: boolean = true;
  IsQtCstBtnDisabled: boolean = false;
  IsPopupDisabled: boolean = false;
  IsDeleteQoutePopupVisible: boolean = false;
  ItemList: Item[];
  selectedEmailContactsRows: number[];
  EmailProposalContacts: string = "";
  ProjectData: Project;
  ProjectDivisionList: ProjectDivisions[];
  AwardLoadingVisible: boolean = false;
  IsProjectDivisionsData: boolean = false;
  IsAlerts: boolean = false;
  //ProjectItemsList: Division[];
  private CustomersList: Customer[] = [];
  private CustomerDivisionsList: CustomerDivisions[] = [];
  ProductLineQuoteList: ProductLineQuote[] = [];
  ProductLineMasterQuote: ProductLineQuote[] = [];
  IsAwardQuoteDataFetched: boolean = false;
  ProductLineQuoteListDataSource: any;
  private CountyCustomerList: CountyCustomer[] = [];
  private CountyCustomerListDataSource: any;
  private CustomerDivisionsListDataSource: any;
  customerPopupVisible: boolean = false;
  QuoteCustomerPopupVisible: boolean = false;
  AwardQuotePopupVisible: boolean = false;
  private ReplicateMasterQuote: ReplicateMQuote[] = [];
  emailPopupVisible: boolean = false;
  IsEmailByQuoteLevel: boolean = true;
  IsEmailByProjectLevel: boolean = true;
  private EmailHistoryList: EmailHistory[] = [];
  private EmailListDataSource: any;
  private EmailListDataSourceList: EmailHistory[] = [];
  public CustomerEmail: string;
  private EmailProposalContactsDataSource: any;
  private customercontactList: customercontact[] = [];
  EmailList: boolean = false;
  private CustomerOfficeContactsList: CustomerOfficeContacts[] = [];
  IsEmailTab: boolean = false;
  IsEmailHistoryTab: boolean = false;
  IsUnlockedQuoteTab: boolean = false;
  EmailTabSelectedIndex: number;
  QuoteEmailsByComma: string = "";
  QuoteEmailsCCByComma: string = "";
  QuoteEmailList: string[] = [];
  QuoteEmailListDataSource: any;
  selectedQuoteRows: number[];
  selectedUnlockedQuoteRows: number[];
  SelectedQuoteIds: string = "";
  SelectedUnlockedQuoteIds: string = "";
  selectedAwardQuote: number;
  checkBoxesMode: any;
 /*  url = ''; */
  AwardUpdate: ProductLineQuote;
  @ViewChild("CustomerQuoteGrid") projectQuoteAccordion: DxDataGridComponent;
  @ViewChild("QuoteCustomerGrid") AwardGrid: DxDataGridComponent;
  emailTabsDataSource: any[] = [{
    "id": 1,
    "text": "Quote Status"
  },
  {
    "id": 2,
    "text": "Mailing List"
  },
  {
    "id": 3,
    "text": "Mailing History"
  }];

  AwardQuoteStatus: any[] = [{
    "id": 1,
    "Name": "Award",
  },
  {
    "id": 2,
    "Name": "Cancel"
  },
  {
    "id": 3,
    "Name": "Lost"
  }];
  AwardBidValue: number;
  AwardValue: number;
  AwardMargin: number;
  AwardedDate: Date;
  CRMNote: string;
  QuoteStatus: number;
  constructor(private route: ActivatedRoute, private router: Router, private metaService: MetadataService, private projectService: ProjectService) {
    this.UserPermissionsList = JSON.parse(localStorage.getItem('rolespermissionslist'));
    this.checkBoxesMode = "always";
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));

    this.router.events.subscribe((event:Event) => {
      if(event instanceof NavigationEnd ){
        localStorage.setItem('ProjectInfoURL', JSON.stringify(event.url));
      }
    });


    this.sub = this.route.params.subscribe(params => {
      this.ProjectID = +params['id']; // (+) converts string 'id' to a number
      var _localProjectData = JSON.parse(window.localStorage.getItem('Projects'));
      if (_localProjectData != null) {
        console.log('Local Projects Data');
        this.ProjectData = _localProjectData;
        console.log("load projects data from localstorage");
        console.log(this.ProjectData);
      } else {
        this.GetProjectById();
      }
      //PROJECT DIVISIONS
      this.GetProjectDivisions();
      //this.AccId = 0;
      if (JSON.parse(localStorage.getItem('AccordionID')) != "0")
        this.AccId = JSON.parse(localStorage.getItem('AccordionID'));
      else
        this.AccId = -1;
      //localStorage.setItem('AccordionID', JSON.stringify('0'));
    });
  }

  GetProjectById() {
    this.projectService.GetProjectById(this.ProjectID).subscribe(data => {
      if (data != null) {
        this.ProjectData = data;
        this.isDataFetched = true;
      }
      console.log("Load projects data start");
      console.log(this.ProjectData);
    },
      err => {
        console.log('Project Data Fetch Failed..');
      });
  }

  ngOnInit() {
  }

  CurrencyFormatter(cellInfo) {
    if (cellInfo.value == null)
      cellInfo.value = 0;
    return cellInfo.value.toFixed(2).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,")
  }

  GetProjectDivisions() {
    this.projectService.GetProjectDivisions(this.ProjectID).subscribe(data => {

      this.ProjectDivisionList = data;
      console.log(this.ProjectDivisionList);
      if (this.ProjectDivisionList.length > 0) {
        var i = 0;
        this.ProjectDivisionList.forEach((prodiv) => {
          prodiv.ID = i;
          i++;
        })

        this.IsProjectDivisionsData = true;
        this.IsAlerts = false;
        //this.AccordionId = 0;
      }
      else {
        this.IsProjectDivisionsData = false;
        this.IsAlerts = true;
      }
    }, err => {
      console.log('Get project divisions data failed..');
      console.log('----------------'+this.GetProjectDivisions);
    });
  }

  OpenItemsModal() {
    //GET PROJECT ITEMS
    this.projectService.GetProjectItems(this.ProjectID).subscribe(data => {
      this.ProjectItemList = data;
      this.ItemListDataSource = {
        store: {
          type: "array",
          data: this.ProjectItemList,
          key: "ItemID"
        }
      }
      //this.selectedRows = this.ProjectItemList.filter(m => m.ProjectID === e.key.ProjectID).map(n => n.ItemID);
    },
      err => {
        console.log('Project items Data Fetch Failed..');
      });
    this.itemPopupVisible = true;
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

  SaveItems() {
    this.loadingVisible = true;
    this.IsDisabled = true;
    this.IsPopupDisabled = true;

    //SAVE OR UPDATE PROJECT ITEMS
    // this.projectService.PutProjectItems(this.ProjectID, this.ProjectItems, 1, true, "Basanta", new Date(Date.now()), "Basanta", new Date(Date.now())).subscribe(data => {
    //   this.ProjectItemList = data;
    //   this.loadingVisible = false;
    //   this.IsPopupDisabled = false;
    //   this.itemPopupVisible = false;
    //   this.GetProjectDivisions();
    // }, err => {
    // });
  }

  CloseItemsPopup() {
    this.IsDisabled = true;
    this.IsPopupDisabled = false;
    this.itemPopupVisible = false;
  }
  onCustomerCellPrepared(e) {
    if (e.rowType == 'data' && e.data.IsAwarded) {
      e.cellElement.css('background-color', 'rgba(210, 186, 24, 0.43)');
    }
  }


  OpenCustomerPopUpForAward(awdData: any) {
    console.log(awdData);
    this.projectService.GetQuoteLockStatus(awdData.QuoteID).subscribe(QtData => {
      this.QuoteCustomerInfo = QtData;
      if(QtData.Locked == false && QtData.QuoteLockedBy !=null && QtData.QuoteLockedBy != this.userProfile.sub)
      {
        this.RefreshPageAlert = true;
        this.AlertMessage = "This quote can't be accessed right now as Mr./Mrs. " + this.QuoteCustomerInfo.QuoteLockedByUserName + " currently working on it.";
        this.projectQuoteAccordion.instance.refresh();
      }
      else
      {
        var _quoteID = awdData.QuoteID;
        this.QuoteID = awdData.QuoteID;
        this.selectedAwardQuote = 0;
        this.IsQtCstBtnDisabled = true;
        this.ProductLine = awdData.ProductLine;
        this.CurrentProductLineID = awdData.ProductLine;
        this.CurrentDivisionID = awdData.DivisionID;
        this.projectService.GetCustomerByProductLine(awdData.ProductLine, this.ProjectID, awdData.DivisionID).subscribe(data => {
          this.ProductLineQuoteList = data;
          this.ProductLineQuoteListDataSource = this.ProductLineQuoteList.filter(m => m.IsMasterQuote == false);
          console.log(this.ProductLineQuoteListDataSource);
          this.IsAwardQuoteDataFetched = true;
          this.AwardValue = this.ProductLineQuoteListDataSource[0].AwardValue;
          this.CRMNote = this.ProductLineQuoteListDataSource[0].CRMNote;
          this.QuoteStatus = this.ProductLineQuoteListDataSource[0].QuoteStatusID;
          if(this.ProductLineQuoteListDataSource[0].AwardedDate == null)
          {
            //this.ProductLineQuoteListDataSource[0].AwardedDate = new Date;
            this.AwardedDate = new Date;
          }
          else 
          {
            //this.AwardedDate = this.ProductLineQuoteListDataSource[0].AwardedDate;
          }
          this.ProductLineMasterQuote = this.ProductLineQuoteList.filter(m => m.IsMasterQuote == true);
          console.log(this.ProductLineMasterQuote);
          this.selectedCustRowsForAward = [];//this.ProductLineQuoteList.filter(m => m.IsMasterQuote == false && m.IsAwarded == true).map(n => n.QuoteID); // [];//this.CountyCustomerList.filter(n => n.QuoteCustomerID!= null && n.QuoteID == this.QuoteID).map(m => m.CustomerID);;
        },
          err => {
            console.log('Customer Quote data fetch failed');
          });
        this.QuoteCustomerPopupVisible = true;
        this.IsQtCstBtnDisabled = true;
      }
    },
      err => {
        console.log('email history data fetch failed');
      });
  }

  QuoteCustomerSelectionChangedHandler(e) {
    // this.IsQtCstBtnDisabled = false;
    // if (e.selectedRowKeys.length > 0)
    //   this.AwardQuote = e.selectedRowKeys[0].QuoteID;
  }

  onRowPreparedAwardQuote(e) {
    if (e.rowType == 'data' && e.data.QuoteStatusID == 1)
      e.rowElement.css('background-color', '#13977b61');
    if (e.rowType == 'data' && e.data.QuoteStatusID == 2)
      e.rowElement.css('background-color', '#ffa500c2');
    if (e.rowType == 'data' && e.data.QuoteStatusID == 3)
      e.rowElement.css('background-color', '#ff7588');
  }

  OnAwardEditingStart(e) {
    if (e.data.AwardedDate == null)
      e.data.AwardedDate = $('#today').val();
    //else
    //{
    // var datePipe = new DatePipe(e.data.AwardedDate);
    // var AwardedDate = "";
    // if (e.AwardedDate)
    //   AwardedDate = datePipe.transform(e.AwardedDate, 'MM/dd/yyyy');
    //}
    // e.data.AwardedDate = e.data.AwardedDate;
  }

  EditPrimeContractor() {
    $('#PrimeContractorField').focus();
    // $('#PrimeContractorField').css("background", "white !important");
    // $('#primeContractDiv').css("background", "white !important");
    $('#PrimeContractorField').css("width", 110);
    $('#PrimeContractorField').css("border", 0);
    // $('#primeContractDiv').css("max-width", 145);
    $('#primeContractDiv').css("border", "1px solid #80808052");
    $('#primeContractDiv').css("border-radius", "5px");
    $('#PrimeContractorField').prop("readonly", false);
    $('#primeContractorEditBtn').addClass("hidden");
    $('#primeContractorSaveBtn').removeClass("hidden");
    $('#primeContractorCancelBtn').removeClass("hidden");
  }

  CancelPrimeContractor() {
    $('#primeContractorEditBtn').removeClass("hidden");
    $('#primeContractorSaveBtn').addClass("hidden");
    $('#primeContractorCancelBtn').addClass("hidden");

    // $('#PrimeContractorField').css("background", "#f3f30c7a !important;");
    // $('#primeContractDiv').css("background", "#f3f30c7a !important;");
    $('#primeContractDiv').css("border", 0);
    $('#primeContractDiv').css("border-radius", 0);
    $('#PrimeContractorField').prop("readonly", true);
    $('#PrimeContractorField').val(this.ProjectData.PrimeContractor);
    $('#PrimeContractorField').css("width", "100%");
  }

  SavePrimeContractorByEnter(key) {
    if (key.keyCode == 13) {
      this.SavePrimeContractor();
      return false;
    }
  }

  SavePrimeContractor() {
    $('#PrimeContractorField').blur();
    $('#SavingSubContractor').removeClass("hidden");
    $('#primeContractorSaveBtn').addClass("hidden");
    $('#primeContractorCancelBtn').addClass("hidden");
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    var Prj = {
      ProjectID: this.ProjectID,
      PrimeContractor: $('#PrimeContractorField').val(),
      LastModifiedBy: this.userProfile.sub
    }
    this.projectService.UpdatePrimeContractor(Prj).subscribe(data => {
      if (data) {
        this.ProjectData.PrimeContractor = $('#PrimeContractorField').val().toString();
        notify('Prime Contractor saved successfully.', 'success', 2000);
        $('#primeContractorEditBtn').removeClass("hidden");
        $('#SavingSubContractor').addClass("hidden");
        $('#primeContractDiv').css("border", 0);
        $('#primeContractDiv').css("border-radius", 0);
        $('#PrimeContractorField').prop("readonly", true);
        $('#PrimeContractorField').css("width", "100%");
        // $('#PrimeContractorField').css("background", "#f3f30c7a !important;");
        // $('#primeContractDiv').css("background", "#f3f30c7a !important;");
      }
    }, err => {
      this.GetProjectById();
      notify(err, 'error', 2000);
      $('#primeContractorEditBtn').removeClass("hidden");
      $('#SavingSubContractor').addClass("hidden");
      $('#primeContractDiv').css("border", 0);
      $('#primeContractDiv').css("border-radius", 0);
      $('#PrimeContractorField').prop("readonly", true);
      $('#PrimeContractorField').css("width", "100%");
      // $('#PrimeContractorField').css("background", "#f3f30c7a !important;");
      // $('#primeContractDiv').css("background", "#f3f30c7a !important;");
    });
  }

  onAwardEditorPreparing(e) {
    if (e.dataField == "CRMNote") {
      e.editorName = "dxTextArea";
      e.editorOptions.height = 70;
    }
  }
  OpenAwardUpdatePopup(e){
    console.log(e);
    $('#AwardValue input').css("border","none")
    this.EditAwardBidValue = e.key.TotalBidPrice;
    this.EditAwardedAmount = e.key.AwardedAmount;
    this.EditAwardValue = e.key.AwardValue;
    this.EditQuoteStatus = e.key.QuoteStatusID;
    this.EditAwardDate = e.key.AwardedDate;
    this.EditCRMNotes = e.key.CRMNote;
    this.QuoteID=e.key.QuoteID;
    this.AwardedMarginValue = e.key.AwardedMargin;
    this.TotalCost = e.key.TotalCost;
    this.TotalFreight = e.key.TotalFreight;
    if (e.key.AwardedDate == null){
      this.EditAwardDate = new Date;
    }
    this.AwardedInfoPopupVisible = true;
  }
  CloseAwardPopup(){
    $('#QuoteStatusDropDown input').css("border","none");
    $('#AwardValue input').css("border","none")
    this.EditAwardBidValue = null;
    this.EditAwardedAmount = null;
    this.EditAwardValue = null;
    this.EditQuoteStatus = null;
    this.AwardedMarginValue = null;
    this.EditAwardDate = new Date;
    this.EditCRMNotes = "";
    $('#CRMNote textarea').val('');
    this.AwardedInfoPopupVisible = false;
  }

  CalculateAwardMargin()
  {
    if($('#AwardValue input').val())
    {
      var _awardValue = +$('#AwardValue input').val();
      var y = this.TotalCost + this.TotalFreight;
      var x = _awardValue - y;
      var z = x/_awardValue;
      var result = z*100;
      console.log(result);
      this.AwardedMarginValue = result; //$('#').val(_awardMargin);
    }
    if(this.EditQuoteStatus == null && $('#AwardValue input').val() > 0)
     {
      $('#QuoteStatusDropDown input').css("border","1px solid red");
    }
    else
     {
      this.AwardedMarginValue = 0.00;
      $('#QuoteStatusDropDown input').css("border","none")
      $('#AwardValue input').css("border","none")
    }
  }

  UpdateQuoteAward() {
    if($('#AwardValue input').val().toString().length == 0 && this.EditQuoteStatus == null)
    {
      this.UpdateStatus();
    }
    else if(this.EditQuoteStatus == null && $('#AwardValue input').val() > 0)
    {
      $('#QuoteStatusDropDown input').css("border","1px solid red");
      $('#AwardValue input').css("border","none");
      return false;
    }
    else if($('#AwardValue input').val().toString().length == 0 && this.EditQuoteStatus == 1)
     {
      $('#AwardValue input').css("border","1px solid red");
      return false;
    }
    else if(($('#AwardValue input').val() == "0" || $('#AwardValue input').val() < 0 || $('#AwardValue input').val() == "") && this.EditQuoteStatus != null || this.EditQuoteStatus == null) 
    {
      $('#AwardValue input').css("border","1px solid red");
      return false;
    }
    else 
    {
      this.UpdateStatus();
    }
  }
  UpdateStatus()
   {
    $('#QuoteStatusDropDown input').css("border","none")
    $('#AwardValue input').css("border","none")
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    var AwardQuote = {
      QuoteID: this.QuoteID,//e.QuoteID,
      Awarded: false,
      AwardedAmount: $('#awardAmount input').val(),
      AwardValue: $('#AwardValue input').val(),
      BidValue: $('#awardBidValue input').val(),
      AwardedDate: $('#ToDate input').val(),
      QuoteStatusID: this.EditQuoteStatus == null ? 0 : this.EditQuoteStatus,
      PrimeContractor: $('#PrimeContractor input').val(),
      CRMNote: $('#CRMNote textarea').val(),
      User: this.userProfile.sub
    }
    this.projectService.AwardValueUpdate(AwardQuote).subscribe(data => {
      if (data) {

        this.AwardedInfoPopupVisible = false;
        notify('Award value has been saved successfully.', 'success', 2000);
        this.GetProjectDivisions();
        this.projectService.GetCustomerByProductLine(this.CurrentProductLineID, this.ProjectID, this.CurrentDivisionID).subscribe(data => {
          this.ProductLineQuoteList = data;
          this.ProductLineQuoteListDataSource = this.ProductLineQuoteList.filter(m => m.IsMasterQuote == false);
          // if(this.ProductLineQuoteListDataSource[0].AwardedDate == null)
          //   this.ProductLineQuoteListDataSource[0].AwardedDate = new Date;
          this.IsAwardQuoteDataFetched = true;
          this.ProductLineMasterQuote = this.ProductLineQuoteList.filter(m => m.IsMasterQuote == true);
          console.log(this.ProductLineMasterQuote);
          this.selectedCustRowsForAward = [];
        },
          err => {
            console.log('Customer Quote data fetch failed');
          });
      }
    }, err => {
      notify('Exception occured.', 'error', 2000);
    });
  }
  onRowAwardClick(evt: any): void {
    // console.log(evt.key.QuoteID);
    // this.selectedAwardQuote = evt.key.QuoteID;
    // evt.component.selectRows([evt.key.QuoteID], false);
  }

  AwardCustomer() {
    console.log(this.ProductLineQuoteListDataSource[0]);
    this.AwardLoadingVisible = true;
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    var AwardQuote = {
      QuoteID: this.selectedAwardQuote,
      Awarded: true,
      AwardedDate: $('#today').val(),
      User: this.userProfile.sub,
      AwardedStatus: this.ProductLineQuoteListDataSource[0].QuoteStatusID
    }
    this.projectService.AwardQuote(AwardQuote).subscribe(data => {
      if (data) {
        //this.AwardQuotePopupVisible = false;
        this.AwardLoadingVisible = false;
        notify('Quote has been awarded successfully.', 'success', 2000);
        this.GetProjectDivisions();

        this.projectService.GetCustomerByProductLine(this.CurrentProductLineID, this.ProjectID, this.CurrentDivisionID).subscribe(data => {
          this.ProductLineQuoteList = data;
          this.ProductLineQuoteListDataSource = this.ProductLineQuoteList.filter(m => m.IsMasterQuote == false);
          // if(this.ProductLineQuoteListDataSource[0].AwardedDate == null)
          //   this.ProductLineQuoteListDataSource[0].AwardedDate = new Date;
          this.IsAwardQuoteDataFetched = true;
          this.ProductLineMasterQuote = this.ProductLineQuoteList.filter(m => m.IsMasterQuote == true);
          console.log(this.ProductLineMasterQuote);
          this.selectedCustRowsForAward = [];
        },
          err => {
            console.log('Customer Quote data fetch failed');
          });

      }
    }, err => {
      this.AwardLoadingVisible = false;
    });
  }

  SaveQuoteStatus(formdata: any) 
  {
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    var datePipe = new DatePipe(formdata);
    var _AwardedDate = "";
    if (formdata.AwardedDate)
      _AwardedDate = datePipe.transform(formdata.AwardedDate, 'MM/dd/yyyy');
    console.log(formdata.QuoteStatus);
    var AwardQuote = {
      QuoteID: this.QuoteID,
      AwardValue: formdata.AwardValue,
      CRMNote: formdata.CRMNote,
      AwardedDate: _AwardedDate,
      User: this.userProfile.sub,
      QuoteStatusID: formdata.QuoteStatus == null ? 0 : formdata.QuoteStatus
    }
    this.projectService.AwardQuote(AwardQuote).subscribe(data => {
      if (data) {
        this.QuoteCustomerPopupVisible = false;
        //this.AwardQuotePopupVisible = false;
        this.AwardLoadingVisible = false;
        notify('Quote Status has been changed successfully.', 'success', 2000);
        this.GetProjectDivisions();
      }
    }, err => {
      this.AwardLoadingVisible = false;
    });
  }

  CloseQuoteCustomerPopup() {
    this.IsQtCstBtnDisabled = true;
    this.QuoteCustomerPopupVisible = false;
    //this.AwardQuotePopupVisible = false;
  }

  OpenCustomerPopUp(quoteID, custData: any) {
    this.projectService.GetQuoteLockStatus(quoteID).subscribe(QtData => {
      this.QuoteCustomerInfo = QtData;
      if(QtData.Locked == false && QtData.QuoteLockedBy !=null && QtData.QuoteLockedBy != this.userProfile.sub) 
      {
        this.RefreshPageAlert = true;
        this.AlertMessage = "This quote can't be accessed right now as Mr./Mrs. " + this.QuoteCustomerInfo.QuoteLockedByUserName + " currently working on it.";
        this.projectQuoteAccordion.instance.refresh();
      }
      else 
      {
        this.ProductLine = custData.ProductLine;
        this.QuoteID = quoteID;
        this.DivisionID = custData.DivisionID;
        //GET CUSTOMER LIST
        this.projectService.GetCustomerByProjectCounty(this.ProjectData.CountyID, custData.ProductLine, this.ProjectID, this.DivisionID).subscribe(data => {
          this.CountyCustomerList = data;

          this.CountyCustomerListDataSource = {
            store: {
              type: "array",
              data: this.CountyCustomerList,//.filter(m=>m.Active != true),
              key: "CustomerOfficeID"
            }
          }
          console.log(this.CountyCustomerListDataSource);
          this.selectedRows = [];//this.CountyCustomerList.filter(n => n.QuoteCustomerID!= null && n.QuoteID == this.QuoteID).map(m => m.CustomerID);;
        },
          err => {
            console.log('Customers data fetch failed');
          });
        this.customerPopupVisible = true;
      }
    },
      err => {
        console.log('email history data fetch failed');
      });
  }

  AccordionselectionChanged(e) {
    if (e.addedItems.length > 0)
      this.AccId = e.addedItems[0].ID;
    localStorage.setItem('AccordionID', JSON.stringify(this.AccId));
  }

  // OpenCustomerPopUp(divID, quoteID)
  // {
  //   this.DivisionID = divID;
  //   this.QuoteID = quoteID;
  //   console.log("quote ID" + this.QuoteID);
  //   console.log("cust clciked" + divID);
  //   //GET CUSTOMER LIST
  //   this.projectService.GetCustomerByDivision(0, divID).subscribe(data=>{
  //     console.log("load Customers data");
  //     console.log(this.CustomerDivisionsList);
  //     this.CustomerDivisionsList=data;

  //     this.CustomerDivisionsListDataSource = {
  //       store: {
  //         type: "array",
  //         data: this.CustomerDivisionsList,
  //         key: "CustomerID"
  //       }       
  //   } 
  //   this.selectedRows = this.CustomerDivisionsList.filter(n => n.QuoteCustomerID!= null).map(m => m.CustomerID);;
  //   console.log(this.CustomerDivisionsList);
  //   },
  //     err => {
  //       console.log('Customers data fetch failed');
  //     });
  //   this.customerPopupVisible = true;
  // }

  CustomerSelectionChangedHandler(CustomerOfficeID) {
    if (CustomerOfficeID.length == 0)
      this.IsDisabled = true;
    else
      this.IsDisabled = false;
    this.ProjectItemList = [];
    this.CustomerOffices = "";
    for (var index: number = 0; index < CustomerOfficeID.length; index++) {
      this.CustomerOffices += CustomerOfficeID[index] + ",";
    }
  }

  // CustomerSelectionChangedHandler(custId)
  // {
  //   console.log(custId);
  //   if(custId.length == 0)
  //     this.IsDisabled = true;
  //   else
  //     this.IsDisabled = false;
  //   this.ProjectItemList = [];
  //   this.CustomerItems = "";
  //   for (var index: number = 0; index < custId.length; index++) 
  //   {
  //     this.CustomerItems += custId[index] + ",";
  //   }
  // }

  SaveCustomer() {
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    this.loadingVisible = true;
    this.IsDisabled = true;
    this.IsPopupDisabled = true;

    //REPLICATE M QUOTE TO CUSTOMER
    this.projectService.ReplicateMasterQuote(this.QuoteID, this.CustomerOffices, this.userProfile.sub, this.ProductLine, this.ProjectID).subscribe(data => {
      if (data) {
        this.ReplicateMasterQuote = data;
        this.loadingVisible = false;
        this.IsPopupDisabled = false;
        this.itemPopupVisible = false;
        this.customerPopupVisible = false;
        this.GetProjectDivisions();
        this.GetProjectById();
        //this.projectService.GetProjectById(this.ProjectID);
        notify('Quotes Replicated successfully.', 'success', 2000);
      }

    }, err => {
    });
  }

  CloseCustomerPopup() {
    this.IsDisabled = true;
    this.IsPopupDisabled = false;
    this.customerPopupVisible = false;
  }

  OpenQuoteLevelEmailModal(data) {
    console.log(data);
    if(data.data.ItemsCount >0){
      this.emailTabsDataSource = [{
        "id": 1,
        "text": "Mailing List",
      },
      {
        "id": 2,
        "text": "Mailing History"
      }];

      console.log(this.IsUnlockedQuoteTab);
      this.projectService.GetQuoteLockStatus(data.data.QuoteID).subscribe(QtData => {
        this.QuoteCustomerInfo = QtData;
        if(QtData.Locked == false && QtData.QuoteLockedBy !=null && QtData.QuoteLockedBy != this.userProfile.sub) 
        {
          this.RefreshPageAlert = true;
          this.AlertMessage = "This quote can't be accessed right now as Mr./Mrs. " + this.QuoteCustomerInfo.QuoteLockedByUserName + " currently working on it.";
          this.projectQuoteAccordion.instance.refresh();
        }
        else
         {
          this.QuoteID = data.data.QuoteID;
          this.CustomerOfficeContactsList = [];
          this.projectService.GetEmailProposalContacts(this.ProjectID, this.QuoteID).subscribe(data => {
            this.QuoteEmailProposalContacts = data;
            if (this.QuoteEmailProposalContacts.length > 0)
              this.EmailList = true;
            else
              this.EmailList = false;
            this.QuoteEmailsByComma = "";
            this.QuoteEmailList = [];
            this.QuoteEmailProposalContacts.forEach(element => {
              if (this.QuoteEmailsByComma == "") {
                this.QuoteEmailsByComma = element.Email;
                this.QuoteEmailList.push(element.Email);
              }
              else {
                this.QuoteEmailsByComma = this.QuoteEmailsByComma + ";" + element.Email;
                this.QuoteEmailList.push(element.Email);
                this.QuoteEmailListDataSource = {
                  store: {
                    type: "array",
                    data: this.QuoteEmailList,
                    key: element.ContactID
                  }
                }
              }
            });
            this.IsEmailTab = true;
            this.EmailProposalContactsDataSource = {
              store: {
                type: "array",
                data: this.QuoteEmailProposalContacts,
                key: "CustomerOfficeContactMapID"
              }
            }
            this.IsEmailTab = true;
            this.EmailTabSelectedIndex = 0;
            this.IsEmailHistoryTab = false;
            this.IsUnlockedQuoteTab = false;
            this.emailPopupVisible = true;
            this.IsEmailByQuoteLevel = true;
            this.IsEmailByProjectLevel = false;
            this.IsDisabled = false;
          },
            err => {
              console.log('email data fetch failed');
            });
          this.GetEmailHistory(this.ProjectID, this.QuoteID);
        }
      },
        err => {
          console.log('email history data fetch failed');
        });
    }
    else{
      this.IsNoItemsVisible=true;
    }
  }
  canclePop() {
    this.IsNoItemsVisible = false;
  }
  BatchEmailData()
  {
    this.projectService.GetEmailProposalContacts(this.ProjectID, 0).subscribe(data => {
      this.MasterQuoteCount = data.filter(m=>m.IsMasterQuote === true).length;
      this.CustomerQuoteCount = data.filter(m=>m.IsMasterQuote === false).length;
      this.LockedQuoteCount = data.filter(m=>m.Locked === true && m.IsMasterQuote === false).length;
      this.UnlockedQuoteCount = data.filter(m=>m.Locked === false && m.IsMasterQuote === false).length;
      this.EmailProposalContactsList = data.filter(m=>m.Locked === true && m.IsMasterQuote === false);
      this.UnlockedQuotesList = data.filter(m=>m.Locked === false);
      if (this.EmailProposalContactsList.length > 0)
        this.EmailList = true;
      else
        this.EmailList = false;
      this.EmailProposalContactsDataSource = {
        store: {
          type: "array",
          data: this.EmailProposalContactsList,
          key: "CustomerOfficeContactMapID"
        }
      }
      this.selectedEmailContactsRows = [];
    },
      err => {
        console.log('email history data fetch failed');
      });
  }

  OpenProjectLevelEmailModal() {

    this.SelectedQuoteIds = "";
    this.EmailList = false;
    this.IsDisabled = false;
    this.BatchEmailData();
    this.GetEmailHistory(this.ProjectID, 0);
    this.EmailTabSelectedIndex = 0;
    this.IsEmailHistoryTab = false;
    this.IsUnlockedQuoteTab = false;
    this.emailPopupVisible = true;
    this.emailTabsDataSource = [
      {
        "id": 1,
        "text": "Quote Status"
      },
      {
        "id": 2,
        "text": "Mailing List",
      },
      {
        "id": 3,
        "text": "Mailing History"
      }];
    this.IsEmailByQuoteLevel = false;
    this.IsEmailByProjectLevel = true;
    this.IsUnlockedQuoteTab = true;
  }


  getEmailSubject(e) 
  {
    var subject = e.target.value;
    $('#ProjectLevEmailSub').val(subject);
  }
  getEmailBody(e) 
  {
    var subject = e.target.value;
    $('#ProjectLevEmailBody').val(subject);
  }

  TabSelectionChanged2(e) {
    console.log(e);
    if(e.addedItems[0].id == 1 && this.IsEmailByQuoteLevel == false){
      this.EmailTabSelectedIndex = 0;
      this.IsEmailTab = false;
      this.IsEmailHistoryTab = false;
      this.IsUnlockedQuoteTab = true;
    }
    else if(e.addedItems[0].id == 1 && this.IsEmailByQuoteLevel == true){
      this.EmailTabSelectedIndex = 0;
      this.IsEmailTab = true;
      this.IsEmailHistoryTab = false;
      this.IsUnlockedQuoteTab = false;
    }
    else if (e.addedItems[0].id == 2 && this.IsEmailByQuoteLevel == true) {
      this.EmailTabSelectedIndex = 1;
      this.IsEmailHistoryTab = true;
      this.IsUnlockedQuoteTab = false;
      this.IsEmailTab = false;
    }
    else if (e.addedItems[0].id == 2 && this.IsEmailByQuoteLevel == false) {
      this.EmailTabSelectedIndex = 1;
      this.IsEmailHistoryTab = false;
      this.IsUnlockedQuoteTab = false;
      this.IsEmailTab = true;
    }
    // else if(e.addedItems[0].id == 2 && this.IsEmailByQuoteLevel == false){
    //   this.EmailTabSelectedIndex = 1;
    //   this.IsEmailTab = false;
    //   this.IsEmailHistoryTab = false;
    //   this.IsUnlockedQuoteTab = true;
    // }
    // else if(e.addedItems[0].id == 2 && this.IsEmailByQuoteLevel == true){
    //   this.EmailTabSelectedIndex = 1;
    //   this.IsEmailTab = false;
    //   this.IsEmailHistoryTab = true;
    //   this.IsUnlockedQuoteTab = false;
    // }
    else if(e.addedItems[0].id == 3)
    {
      this.EmailTabSelectedIndex = 2;
      this.IsEmailTab = false;
      this.IsEmailHistoryTab = true;
      this.IsUnlockedQuoteTab = false;
    }
  }

  GetEmailHistory(projectID, quoteID) {
    //GET EMAIL HISTORY
    this.projectService.GetEmailHistory(projectID, quoteID).subscribe(data => {
      this.EmailHistoryList = data;
      this.EmailListDataSource = {
        store: {
          type: "array",
          data: this.EmailHistoryList,
          key: "EmailRequestID"
        }
      }
      if (data !== undefined || data.length > 0) {
        this.EmailListDataSourceList = data.sort(function (a, b) { return (a.RequestedDate < b.RequestedDate) ? 1 : ((b.RequestedDate < a.RequestedDate) ? -1 : 0); });
      }
    },
      err => {
        console.log('email history data fetch failed');
      });
  }

  emailCCKeyup() {
    if (this.QuoteEmailsByComma != "" || $('#QuoteLevEmailCC').val() != "")
      this.IsDisabled = false;
    else
      this.IsDisabled = true;
    // var testEmail = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
    // if($('#QuoteLevEmailCC').val() != "")
    // {
    //   var ccMail = $('#QuoteLevEmailCC').val().toString();
    //   if (testEmail.test(ccMail))
    //       $('#QuoteLevEmailCC').css("border","1px solid green");
    //   else
    //       $('#QuoteLevEmailCC').css("border","1px solid red");
    // }
  }
  ValidateEmail() {

  }
  GetEmailList(e) {
    //this.QuoteEmailsByComma = this.QuoteEmailsByComma + ";" + e.value;
    this.QuoteEmailsByComma = "";
    e.value.forEach(element => {
      if (this.QuoteEmailsByComma == "")
        this.QuoteEmailsByComma = element;
      else
        this.QuoteEmailsByComma = this.QuoteEmailsByComma + ";" + element;
    });
    if (this.QuoteEmailsByComma == "" && $('#QuoteLevEmailCC').val() == "")
      this.IsDisabled = true;
    else
      this.IsDisabled = false;
  }
  GetEmailCCList(e) {
    //this.QuoteEmailsByComma = this.QuoteEmailsByComma + ";" + e.value;
    this.QuoteEmailsCCByComma = "";
    e.value.forEach(element => {
      if (this.QuoteEmailsCCByComma == "")
        this.QuoteEmailsCCByComma = element;
      else
        this.QuoteEmailsCCByComma = this.QuoteEmailsCCByComma + ";" + element;
    });
    if (this.QuoteEmailsCCByComma == "" && $('#QuoteLevEmailCC').val() == "")
      this.IsDisabled = true;
    else
      this.IsDisabled = false;
  }

  SendEmail() {
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    var testEmail = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
    var ccMail = $('#QuoteLevEmailCC').val().toString().replace(/\s/g, '').split(";");
    console.log(ccMail)
    var IsValidEmail = true;
    for (var i = 0; i < ccMail.length; i++) {
      if (!testEmail.test(ccMail[i].toString()))
        IsValidEmail = false;
    }
    if (IsValidEmail || $('#QuoteLevEmailCC').val() == "") {
      //if (testEmail.test(ccMail[i].toString()) || $('#QuoteLevEmailCC').val() == "") {
      //  $('#QuoteLevEmailCC').css("border", "1px solid green");
      //}
      $('#QuoteLevEmailCC').css("border", "1px solid green");
      this.emailLoadingVisible = true;
      this.IsPopupDisabled = true;
      var Email = {
        ProjectID: this.ProjectID,
        QuoteID: this.QuoteID,
        EmailSubject: $('#QuoteLevEmailSub').val(),
        EmailBody: $('#QuoteLevEmailBody').val(),
        RequestedBy: this.userProfile.sub,
        EmailTo: this.QuoteEmailsByComma,//$('#QuoteLevEmailTo').val(),
        CCTo: ccMail
      }
      this.projectService.PostEmail(Email).subscribe(data => {
        if (data) {
          notify('Your Email has been queued.', 'success', 2000);
          this.GetEmailHistory(this.ProjectID, this.QuoteID);
          this.emailLoadingVisible = false;
          this.IsPopupDisabled = false;
          this.IsDisabled = true;
          this.GetProjectDivisions();
          this.projectService.GetEmailProposalContacts(this.ProjectID, this.QuoteID).subscribe(data => {
            this.QuoteEmailProposalContacts = data;
            if (this.QuoteEmailProposalContacts.length > 0)
              this.EmailList = true;
            else
              this.EmailList = false;
            this.QuoteEmailsByComma = "";
            this.QuoteEmailProposalContacts.forEach(element => {
              if (this.QuoteEmailsByComma == "")
                this.QuoteEmailsByComma = element.Email;
              else
                this.QuoteEmailsByComma = this.QuoteEmailsByComma + ";" + element.Email;
            });
            this.IsEmailTab = true;
            this.EmailProposalContactsDataSource = {
              store: {
                type: "array",
                data: this.QuoteEmailProposalContacts,
                key: "CustomerOfficeContactMapID"
              }
            }
            this.IsEmailTab = true;
          },

            err => {
              console.log('email data fetch failed');
            });
        }
        else {
          this.emailLoadingVisible = false;
          this.IsPopupDisabled = false;
          this.IsDisabled = true;
          notify('Email is already in queue.', 'error', 2000);
        }
      },
        err => {
          console.log('Email request failed');
        });
    }
    else
      $('#QuoteLevEmailCC').css("border", "1px solid red");

  }

  SendEmailProjectLevel() {
    this.emailLoadingVisible = true;
    this.IsPopupDisabled = true;
    this.IsDisabled = true;
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    var Email = {
      ProjectID: this.ProjectID,
      User: this.userProfile.sub,
      Subject: $('#ProjectLevEmailSub').val(),
      Body: $('#ProjectLevEmailBody').val(),
      QuoteIds: this.SelectedQuoteIds
    }
    this.projectService.SendEmailProjectLevel(Email).subscribe(data => {
      notify('Emails has been queued for the selected customers.', 'success', 2000);
      this.GetEmailHistory(this.ProjectID, 0);
      this.SelectedQuoteIds = "";
      this.IsDisabled = false;
      this.projectService.GetEmailProposalContacts(this.ProjectID, 0).subscribe(data => {
        this.EmailProposalContactsList = data.filter(m=>m.Locked === true && m.IsMasterQuote === false);
        if (this.EmailProposalContactsList.length > 0)
          this.EmailList = true;
        else
          this.EmailList = false;
        this.EmailProposalContactsDataSource = {
          store: {
            type: "array",
            data: this.EmailProposalContactsList,
            key: "CustomerOfficeContactMapID"
          }
        }
        this.selectedEmailContactsRows = [];

        this.IsEmailTab = true;
      },
        err => {
          console.log('email history data fetch failed');
        });
      this.emailLoadingVisible = false;
      this.IsPopupDisabled = false;
      this.IsDisabled = true;
      this.GetProjectDivisions();
    },
      err => {
        console.log('Email sent failed');
      });
  }
  onCellPreparedforPrimary(e: any) {
    if (e.rowType === "data" && e.column.command === 'select' && e.data.CustomerContactName == '') {
      e.cellElement.find('.dx-select-checkbox').dxCheckBox("instance").option("disabled", true);
      e.cellElement.off();
    }
  }
  CloseEmailPopup() {
    this.EmailList = false;
    this.IsDisabled = false;
    this.emailPopupVisible = false;
  }

  DeleteConfirmPopup(quoteCustomerID) {
    this.QuoteCustomerID = quoteCustomerID;
    console.log(quoteCustomerID);
    this.IsDeleteQoutePopupVisible = true;
  }

  YesDeleteQuote() {
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    this.projectService.DeleteQuoteCustomer(this.QuoteCustomerID, this.userProfile.sub).subscribe(data => {
      if (data) {
        notify('Quote deleted successfully.', 'success', 2000);
        this.GetProjectDivisions();
      }
    }, err => {
      notify(err, 'error', 2000);
    });
    this.IsDeleteQoutePopupVisible = false;
  }

  NoDeleteQuote() {
    this.IsDeleteQoutePopupVisible = false;
  }
  EmailContactsSelectionChangedHandler(Quote) {
    this.SelectedQuoteIds = "";
    for (var index: number = 0; index < Quote.length; index++) {
      this.SelectedQuoteIds += Quote[index].QuoteID + ",";
    }
    if (this.SelectedQuoteIds.length > 0)
      this.IsDisabled = true;
    else
      this.IsDisabled = false;
    console.log(this.SelectedQuoteIds);
  }

  UnlockConfirmMsgPopup(ProductLineID, DivisionID) {
    this.BatchLockProductLineID = ProductLineID;
    this.BatchLockDivisionID = DivisionID;
    this.IsUnlockQuotePopupVisible = true;
  }

  DontUnlockBatchQuotes() {
    //this.projectQuoteAccordion.instance.refresh();
    this.IsUnlockQuotePopupVisible = false;
  }

  YesUnlockBatchQuotes() {
    this.UpdateLockUnlock();
    this.IsUnlockQuotePopupVisible = false;
  }

  UpdateLockUnlock() {
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    let QLock = {
      ProductLineID: this.BatchLockProductLineID,
      DivisionID: this.BatchLockDivisionID,
      ProjectID: this.ProjectID,
      User: this.userProfile.sub
    }
    this.projectService.BatchLockUnLockQuote(QLock).subscribe(data => {
      if (data == "Alert Message") {
        this.RefreshPageAlert = true;
        this.GetProjectById();
        this.GetProjectDivisions();
        this.AlertMessage = "Some Quotes are being used by other user. You can't LOCK them.";
      }
      else
       {
        this.GetProjectById();
        this.GetProjectDivisions();
        notify('Quotes locked successfully.', 'success', 2000);
      }
    }, err => {
      notify(err, 'error', 2000);
    });
  }

  ReloadPage() {
    this.RefreshPageAlert = false;
    //window.location.reload();
  }

  OpenQuoteInfoPage(data)
  {
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    this.projectService.GetQuoteLockStatus(data.data.QuoteID).subscribe(QtData => {
      this.QuoteCustomerInfo = QtData;
      console.log(QtData);
      if(this.UserPermissionsList.PL000007 && data.data.IsMasterQuote)
      {
        this.router.navigate(['/main/prjmng/'+data.data.QuoteID],{ queryParams: {mq: 'true'}});
      }
      else if(this.UserPermissionsList.PL000007 && !data.data.IsMasterQuote)
       {
        this.router.navigate(['/main/prjmng/'+data.data.QuoteID]);
      }
      else if(QtData.Locked == false && QtData.QuoteLockedBy !=null && QtData.QuoteLockedBy != this.userProfile.sub) 
      {
        this.RefreshPageAlert = true;
        this.AlertMessage = "This quote can't be accessed right now as Mr./Mrs. " + this.QuoteCustomerInfo.QuoteLockedByUserName + " currently working on it.";
        this.projectQuoteAccordion.instance.refresh();
      }
      else if(data.data.IsMasterQuote) 
      {
        this.router.navigate(['/main/prjmng/'+data.data.QuoteID],{ queryParams: {mq: 'true'}});
      }
      else
      {
        this.router.navigate(['/main/prjmng/'+data.data.QuoteID]);
      }
    },
      err => {
        console.log('Quote Information navigation failed');
      });
  }
  UnlockedQuotesSelectionChangedHandler(Quote) {
    this.SelectedUnlockedQuoteIds = "";
    for (var index: number = 0; index < Quote.length; index++) {
      this.SelectedUnlockedQuoteIds += Quote[index].QuoteID + ",";
    }
    if (this.SelectedUnlockedQuoteIds.length > 0)
      this.IsDisabled = true;
    else
      this.IsDisabled = false;
    console.log(this.SelectedUnlockedQuoteIds);
  }

  LockUnlockedBatchQuotes() {
    this.emailLoadingVisible = true;
    this.IsPopupDisabled = true;
    this.IsDisabled = true;
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    var UnlockedQuotes = {
      ProjectID: this.ProjectID,
      User: this.userProfile.sub,
      QuoteIds: this.SelectedUnlockedQuoteIds
    }
    this.projectService.LockAllUnlockedQuote(UnlockedQuotes).subscribe(data => {
      console.log(data);
      this.BatchEmailData();
      notify('All quotes locked successfully', 'success', 2000);
      this.SelectedUnlockedQuoteIds = "";
      this.IsDisabled = false;
      this.IsUnlockedQuoteTab = true;
      // this.projectService.GetEmailProposalContacts(this.ProjectID, 0).subscribe(data => {
      //   this.EmailProposalContactsList = data.filter(m=>m.Locked === true);
      //   if (this.EmailProposalContactsList.length > 0)
      //     this.EmailList = true;
      //   else
      //     this.EmailList = false;
      //   this.EmailProposalContactsDataSource = {
      //     store: {
      //       type: "array",
      //       data: this.EmailProposalContactsList,
      //       key: "CustomerOfficeContactMapID"
      //     }
      //   }
      //   this.selectedEmailContactsRows = [];
      // },
      //   err => {
      //     console.log('email history data fetch failed');
      //   });
      this.emailLoadingVisible = false;
      this.IsPopupDisabled = false;
      this.IsDisabled = true;
      this.GetProjectDivisions();
    },
      err => {
        console.log('Quote Locked failed');
      });
  }
  /* TripReportModal(e) {   
    console.log(e);
    $('#AwardValue input').css("border","none")
    this.EditAwardBidValue = e.key.TotalBidPrice;
    this.EditAwardedAmount = e.key.AwardedAmount;
    this.EditAwardValue = e.key.AwardValue;
    this.EditQuoteStatus = e.key.QuoteStatusID;
    this.EditAwardDate = e.key.AwardedDate;
    this.EditCRMNotes = e.key.CRMNote;
    this.QuoteID=e.key.QuoteID;
    this.AwardedMarginValue = e.key.AwardedMargin;
    this.TotalCost = e.key.TotalCost;
    this.TotalFreight = e.key.TotalFreight;
    if (e.key.AwardedDate == null){
      this.EditAwardDate = new Date;
    }
    this.TripReportPopupVisible = true;
  } */
}



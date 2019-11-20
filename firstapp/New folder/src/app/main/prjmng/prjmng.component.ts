import { Component, OnInit, NgModule, ViewChild } from '@angular/core';
import { Project, ProductLineQuote, ProjCategory, ProjSubCategory, Item, ItemAssemblySearchResult, AssemblyList, ProjectItem, ProjectAssembly, QuoteCustomerInfo, DivisionsItems, DivisionNotes, DivisionTermsNConditions, AssociateTermsNConditions, EmailProposalContacts } from '../../../models/Project';
import { ActivatedRoute, Router, NavigationEnd, Event } from '@angular/router';
import { DxDataGridComponent } from "devextreme-angular";
import { MetadataService } from '../../services/metadata/metadata.service';
import { ProjectService } from '../../services/project/project.service';
import { QuotesItems, QuotesTerms, QuotesNotes, Quote, GetallLostCustomer, Customersearch, QuoteItemUpdate } from '../../../models/Quotes';
import { UserService } from '../../services/user/user.service';
import { User, PITUser } from '../../../models/User';
import { Role, Permissions, UserPermissions } from '../../../models/Role';
import { Phase } from '../../../models/Phase';
import { customercontact, CustomerOfficeContacts, Customer } from "../../../models/customers";
import { EmailHistory } from "../../../models/EmailHistory";
import { Division } from '../../../models/division';
import { ProductLines, ProductlineDivisions, ProductLineItems, ProductLineNotes, AssociateNotes } from '../../../models/ProductLines';
import { Freight } from "../../../models/Freight";
import notify from 'devextreme/ui/notify';
import 'devextreme/integration/jquery';
@Component({
  selector: 'app-prjmng',
  templateUrl: './prjmng.component.html',
  styleUrls: ['./prjmng.component.css']
})
export class PrjmngComponent implements OnInit {
  IsNoItemsVisible: boolean = false;
  CurrentUser: string;
  EstimatedBy: string;
  AuthorisedBy: string;
  RefreshPageAlert: boolean = false;
  AlertMessage: string;
  IsSwitch: boolean = false;
  OverRideFlag: string;
  UserPermissionsList: UserPermissions;
  AwardQuote: number;
  QuoteNum: any[];
  selectedAwardQuote: number;
  IsQtCstBtnDisabled: boolean = false;
  IsQtCstBtnLostDisabled: boolean = false;
  AwardLoadingVisible: boolean = false;
  IsAwardQuoteDataFetched: boolean = false;
  ProductLineQuoteList: ProductLineQuote[] = [];
  ProductLineQuoteListDataSource: any;
  ProductLineMasterQuote: ProductLineQuote[] = [];
  selectedCustRowsForAward: number[];
  QuoteCustomerPopupVisible: boolean = false;
  QuoteCustomerPopupLostVisible: boolean = false;
  termsLoadingVisible: boolean = false;
  IsUnlockQuotePopupVisible: boolean = false;
  IsProjectLocked: boolean = false;
  IsAwarded: boolean = false;
  IsFreightFetched: boolean = false;
  TotalFreight: number;
  IsQuoteSave: boolean = false;
  TotalCost: number = 0;
  ActualTotalCost: number = 0;
  TodaysDate: Date = new Date();
  Quantity: number;
  //ItemList: Item[] = [];
  ItemList: ItemAssemblySearchResult[] = [];
  AssemblyList: AssemblyList[];
  flag: boolean = false;
  ProjectCountyID: number;
  private FreightList: Freight[] = [];
  HighestVersion: number;
  IsHighestVersion: boolean = false;
  ClickedQuoteVersion: number;
  ProductLineID: number;
  tabID: number;
  QuoteList: Quote[] = [];
  IsQuoteLocked: boolean = false;
  emailPopupVisible: boolean = false;
  emailLoadingVisible: boolean = false;
  addEditItemloadingVisible: boolean = false;
  private customercontactList: customercontact[] = [];
  private EmailHistoryList: EmailHistory[] = [];
  QuoteEmailList: string[] = [];
  QuoteEmailListDataSource: any;
  private CustomerOfficeContactsList: CustomerOfficeContacts[] = [];
  private QuoteEmailProposalContacts: EmailProposalContacts[] = [];
  private EmailProposalContactsDataSource: any;
  private EmailListDataSource: any;
  EmailList: boolean = false;
  userProfile: any;
  PhaseList: Phase[];
  users: User[];
  Status: any;
  ProjectName: any;
  Project: any;
  Control: any;
  FromDate: string;
  ToDate: string;
  state: any;
  QuoteNumber: string;
  projectLoading: boolean = false;
  QuoteID: number;
  QID: number;
  QuoteCustomerID: number;
  CustomerID: number;
  ProjectID: number;
  ProjectNumber: string;
  ControlNumber: string;
  Highway: string;
  ProjectCountyName: string;
  ProductLineName: string;
  Version: number;
  CustomerOfficeID: number;
  private sub: any;
  isDataFetched: boolean = false;
  IsNoRecord: boolean = false;
  QueryString: string = "";
  isMasterQuote: boolean = false;
  TabIndex: any;
  IsItemTab: boolean = false;
  IsAddItemsBtn: boolean = false;
  IsNotesTab: boolean = false;
  IsAddNotesBtn: boolean = false;
  IsTermsTab: boolean = false;
  IsAddTermsBtn: boolean = false;
  notesPopupVisible: boolean = false;
  IsCustomeNotePopup: boolean = false;
  DivisionID: number;
  itemPopupVisible: boolean = false;
  IsPopupDisabled: boolean = false;
  loadPanelForUpdateQuotes: boolean = false;
  selectedRowKeys: number[];
  selectedRows: number[];
  selectedAssemblyRows: number[];
  defaultVisible = false;
  loadingVisible = false;
  IsDisabled: boolean = true;
  AssemblyBtnIsDisabled: boolean = true;
  private ProjectItemList: ProjectItem[] = [];
  private ProjectAssemblyList: ProjectAssembly[] = [];
  ProjectAssemblyListDataSource: any;
  ItemListDataSource: any;
  ProjectItems: string = "";
  ProductLineNotes: string = "";
  ProjectAssemblies: string = "";
  QuoteTerms: string = "";
  IsItems: boolean = true;
  IsAssembies: boolean = false;
  saveSuccess: boolean = false;
  TabSelectedIndex: number;
  EmailTabSelectedIndex: number;
  IsAddTermsPopup: boolean = false;
  private DivisionList: Division[] = [];
  DivisionName: string[] = [];
  private ProductLinesList: ProductLines[] = [];
  private ProductLineNotesList: ProductLineNotes[] = [];
  public AssociateNotesList: AssociateNotes[] = []
  ProductLine: number;
  IsMasterQuoteAwarded: boolean = false;
  QuoteEmailsByComma: string = "";
  checkboxinit: boolean = true;
  checkboxinitDummy: boolean = true;
  EditAwardBidValue: number;
  EditAwardedAmount: number;
  AwardedMarginValue: number;
  EditAwardValue: number;
  EditQuoteStatus: number;
  EditAwardDate: Date;
  EditCRMNotes: string;
  EditlostReason: string;
  AwardedInfoPopupVisible: boolean = false;
  isvaluechanged: boolean = false;
  lostCustval: string = "";
  LostCustomer: number = 0;
  ReasonLost: string = "";
  public GetallLostCustomer: GetallLostCustomer;


  quoteTabsDataSource: any[] = [{
    "id": 1,
    "text": "Items",
  },
  {
    "id": 2,
    "text": "Notes"
  },
  {
    "id": 3,
    "text": "Terms"
  }];
  emailTabsDataSource: any[] = [{
    "id": 1,
    "text": "Mailing List",
  },
  {
    "id": 2,
    "text": "Mailing History"
  }];
  AwardQuoteStatus: any[] = [{
    "QuoteStatusID": 1,
    "Name": "Award",
  },
  {
    "QuoteStatusID": 2,
    "Name": "Cancel"
  },
  {
    "QuoteStatusID": 3,
    "Name": "Lost"
  }];
  AwardMargin: number;
  IsEmailHistoryTab: boolean = false;
  IsEmailTab: boolean = true;
  ProjectData: Project[];
  public QuoteCustomerInfo: QuoteCustomerInfo;
  TabDataSource: any;
  public ProductLineItemsList: ProductLineItems[] = [];
  ProductLineItemsListDataSource: any;
  public DivisionsItemsList: DivisionsItems[] = [];
  DivisionItemsListDataSource: any;
  public DivisionNotesList: DivisionNotes[] = [];
  ProductLineNotesListDataSource: any;
  AssociateNotesListDataSource: any;
  public DivisionTermsNConditionsList: DivisionTermsNConditions[] = [];
  public AssociateTermsNConditionsList: AssociateTermsNConditions[] = [];
  TermsNConditionsListDataSource: any;
  AssociateTermsNConditionsDataSource: any;
  public QuotesItemsList: QuotesItems[] = [];
  QuotesItemsListDataSource: any;
  OrderSelectedItem: QuotesItems;
  selectedOrderRows: number[];
  selectedNotesOrderRows: number[];
  itemReOrderPopupVisible: boolean = false;
  notesReOrderPopupVisible: boolean = false;
  ItemOrderList: QuotesItems[] = [];
  public InitialQuotesItemsListForCalculation: QuotesItems[] = [];
  public QuotesTermsList: QuotesTerms[] = [];
  public QuotesNotesList: QuotesNotes[] = [];
  OrderSelectedNotes: QuotesNotes;
  NotesOrderList: QuotesNotes[] = [];
  public QuotesNotesListDataSource: any;
  QuoteItemEditPopupVisible: boolean = false;
  QuoteItemUpdate: QuoteItemUpdate;
  PITUserList: PITUser[];
  confirmationpopupvisible: boolean = false;
  CustomerList: Customersearch[] = [];
  FilteredCustomerList: Customersearch[] = [];

  @ViewChild("QuotesItemsGrid") QuoteItemGrid: DxDataGridComponent;
  @ViewChild("TabNotesGrid") QuoteNotesGrid: DxDataGridComponent;
  @ViewChild("TabTermsGrid") QuoteTermsGrid: DxDataGridComponent;
  @ViewChild("lockSwitch") onLockSwitch: DxDataGridComponent;
  @ViewChild("QuoteCustomerGrid") AwardCustomerQuoteGrid: DxDataGridComponent;
  constructor(private router: Router, private route: ActivatedRoute, private metaService: MetadataService, private projectService: ProjectService, private userService: UserService) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        localStorage.setItem('QuoteInfoURL', JSON.stringify(event.url));
      }
      //this.GetAllCustomers1();
    });

    this.UserPermissionsList = JSON.parse(localStorage.getItem('rolespermissionslist'));
    this.PITUserList = JSON.parse(localStorage.getItem('UserList'));
    if (this.PITUserList == null) {
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


    this.IsNotesTab = false;
    this.IsTermsTab = false;
    route.queryParams.subscribe(
      data => this.QueryString = data['mq']
    );

    this.sub = this.route.params.subscribe(params => {
      this.QuoteID = +params['id']; // (+) converts string 'id' to a number
      //console.log("Status Namme" +this.QuoteCustomerInfo.QuoteStatusName);
      console.log("this is my  q id" + this.QuoteID);
      console.log("this is reason for sustomer----"+this.QuoteCustomerInfo)
      // if(this.QueryString == "true")
      // {
      //   this.QuoteID = this.QuoteCustomerID;
      //   this.QuoteCustomerID = 0;
      // }
      // else
      // {
      //   this.QuoteID = 0;
      // }

      //GET QOUTE AND CUSTOMER INFO
      //   this.projectService.GetQuoteCustomer(this.QuoteID, 0).subscribe(data => {
      //   this.QuoteCustomerInfo = data;
      //   console.log("quote customer info.....");
      //   console.log(this.QuoteCustomerInfo);
      //   this.QID = this.QuoteCustomerInfo.QuoteID;
      //   this.isDataFetched = true;
      //   if(this.QueryString == "true")
      //   {
      //     this.isMasterQuote = true;
      //   }
      //   //FETCH ITEMS
      //   if (this.QuoteCustomerInfo != null)
      //   {
      //     this.IsQuoteLocked = this.QuoteCustomerInfo.Locked;
      //     this.DivisionID = this.QuoteCustomerInfo.DivisionID;
      //     this.CustomerID = this.QuoteCustomerInfo.CustomerID;
      //     console.log(this.QuoteCustomerInfo);
      //     this.GetAndLoadItemsByQuote(this.QID);
      //     this.IsItemTab = true;
      //     this.IsAddItemsBtn = true;
      //     this.ProjectID = this.QuoteCustomerInfo.ProjectID;
      //   }
      //   this.tabID = 0;
      //   this.QuoteVersion();
      // }, err => {
      //   console.log('Get quote customer data failed..');
      // });
      this.GetQuoteCustomerData(this.QuoteID, 0);
      
    });

    //this.getUsersList();
  }


  GetDataByQuoteVersion(e) {
    this.ClickedQuoteVersion = e;
    this.GetQuoteCustomerData(this.QuoteID, e.value);
    //this.IsDisabled = true;
    //this.IsAddItemsBtn = false;
  }

  GetQuoteCustomerData(QuoteID, version) {
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));

    this.projectService.GetQuoteCustomer(this.QuoteID, version).subscribe(data => {
      this.QuoteCustomerInfo = data;
      this.QID = this.QuoteCustomerInfo.QuoteID;
      this.isDataFetched = true;

      if (this.QueryString == "true") {
        this.isMasterQuote = true;
      }
      //FETCH ITEMS
      if (this.QuoteCustomerInfo != null) {
        console.log('this.QuoteCustomerInfo');
        console.log(this.QuoteCustomerInfo);
        if (this.QuoteCustomerInfo.AuthorisedBy != null) {
          this.AuthorisedBy = this.QuoteCustomerInfo.AuthorisedBy;
        }
        else {
          //this.AuthorisedBy = this.userProfile.sub;
        }
        if (this.QuoteCustomerInfo.EstimatedBy != null) {
          this.EstimatedBy = this.QuoteCustomerInfo.EstimatedBy;
        }
        else {
          this.EstimatedBy = this.userProfile.sub;
        }
        if (version == 0) {
          this.IsHighestVersion = true;
        }
        else if (version == this.HighestVersion) {
          this.IsHighestVersion = true;
          this.IsAddItemsBtn = true;
        }
        else {
          this.IsHighestVersion = false;
          this.IsAddItemsBtn = false;
        }
        if (this.QuoteCustomerInfo.Locked == false) {
          //this.IsHighestVersion = false;
          this.IsQuoteLocked = false;
        }
        else {
          this.IsQuoteLocked = true;
        }
        if (this.QuoteCustomerInfo.QuoteLockedBy != null && this.userProfile.sub != this.QuoteCustomerInfo.QuoteLockedBy) {
          if (this.QuoteCustomerInfo.Locked == false) {
            this.IsHighestVersion = true;
            this.IsQuoteLocked = false;
          }
          else {
            this.IsQuoteLocked = true;
          }
        }
        // if(this.UserPermissionsList.PL000009)
        // {
        //   this.IsHighestVersion = true;
        // }
        // else{
        //   this.IsQuoteLocked = this.QuoteCustomerInfo.Locked;
        // }
        this.DivisionID = this.QuoteCustomerInfo.DivisionID;
        this.CustomerID = this.QuoteCustomerInfo.CustomerID;
        this.ProjectCountyID = this.QuoteCustomerInfo.CountyID;
        this.ProjectNumber = this.QuoteCustomerInfo.ProjectNumber;
        this.ControlNumber = this.QuoteCustomerInfo.ControlNumber;
        this.Highway = this.QuoteCustomerInfo.Highway;
        this.ProjectCountyName = this.QuoteCustomerInfo.CountyName;
        this.ProductLineName = this.QuoteCustomerInfo.ProductLineName;
        this.Version = +this.QuoteCustomerInfo.Version;
        this.CustomerOfficeID = this.QuoteCustomerInfo.CustomerOfficeID;
        this.IsProjectLocked = this.QuoteCustomerInfo.IsProjectLocked;
        this.IsAwarded = this.QuoteCustomerInfo.Awarded;
        this.IsMasterQuoteAwarded = this.QuoteCustomerInfo.IsMasterQuoteAwarded;
        this.state = this.QuoteCustomerInfo.StateID;
        this.QuoteNumber = this.QuoteCustomerInfo.QuoteNumber;
        this.IsItemTab = true;
        this.ProjectID = this.QuoteCustomerInfo.ProjectID;
        this.ProductLineID = this.QuoteCustomerInfo.ProductLineID;
      }
      this.tabID = 0;
      this.QuoteVersion();
      this.GetMyFreight();

      this.GetAndLoadItemsByQuote(this.QID, version);
      this.GetAndLoadNotesByQuote(this.QID, version);
      this.GetAndLoadTermsByQuote(this.QID, version);
      this.TabSelectedIndex = 0;
      this.IsNotesTab = false;
      this.IsTermsTab = false;
      this.IsItemTab = true;
    }, err => {
      console.log('Get quote customer data failed..');
    });
  }

  QuoteVersion() {
    this.projectService.GetQuoteVersions(this.QID).subscribe(data => {
      this.QuoteList = data;
      this.HighestVersion = this.QuoteList.length;
    }, err => {
      console.log('Get Versions data failed..');
    });
  }


  GetMyFreight() {
    this.metaService.GetFreight().subscribe(data => {
      this.FreightList = data;
      if (this.FreightList.length > 0)
        this.FreightList = this.FreightList.filter(m => m.CountyID == this.ProjectCountyID);
      this.IsFreightFetched = true;
    },
      err => {
        notify('Frieght Data Fetch Failed.', 'Error', 2000);
      });
  }

  TabSelectionChanged2(e) {
    if (e.addedItems[0].id == 1) {
      this.IsNotesTab = false;
      this.IsTermsTab = false;
      this.IsItemTab = true;
    }
    else if (e.addedItems[0].id == 2) {
      this.TabSelectedIndex = 1;
      this.IsItemTab = false;
      this.IsTermsTab = false;
      this.IsNotesTab = true;
    }
    else {
      this.TabSelectedIndex = 2;
      this.IsItemTab = false;
      this.IsNotesTab = false;
      this.IsTermsTab = true;
    }
  }

  ngOnInit() {
  }

  GetNotesForAssociate() {
    this.projectService.GetNotesForAssociate(this.QuoteID).subscribe(data => {
      this.AssociateNotesList = data;
      this.AssociateNotesListDataSource = {
        store: {
          type: "array",
          data: this.AssociateNotesList,
          key: "NotesID"
        }
      }
      this.selectedRows = [];
    },
      err => {
        console.log('Notes Data Fetch Failed..');
      });
    this.notesPopupVisible = true;
  }
  // GetNotesByProductLine() {
  //   this.projectService.GetNotesByProductLine(this.ProductLineID, this.QuoteID).subscribe(data => {
  //     this.ProductLineNotesList = data;
  //       this.ProductLineNotesListDataSource = {
  //       store: {
  //         type: "array",
  //         data: this.ProductLineNotesList,
  //         key: "NotesID"
  //       }
  //     }
  //     this.selectedRows = [];
  //   },
  //     err => {
  //       console.log('Division Notes Data Fetch Failed..');
  //     });
  //     this.notesPopupVisible = true;
  // }

  NotesSelectionChangedHandler(NotesID) {
    if (NotesID.length == 0)
      this.IsDisabled = true;
    else
      this.IsDisabled = false;
    this.ProductLineNotes = "";
    for (var index: number = 0; index < NotesID.length; index++) {
      this.ProductLineNotes += NotesID[index] + ",";
    }
  }

  AssociateQuoteNotes() {
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    this.loadingVisible = true;
    this.IsPopupDisabled = true;
    var QuotesNotes = {
      QuoteID: this.QuoteID,
      QuoteNotes: this.ProductLineNotes,
      User: this.userProfile.sub
    }
    this.projectService.AssociateQuoteNotes(QuotesNotes).subscribe(data => {
      if (data) {
        this.notesPopupVisible = false;
        this.IsPopupDisabled = false;
        this.loadingVisible = false;
        this.IsAddTermsPopup = false;
        notify('Notes added successfully.', 'success', 2000);
        this.GetAndLoadNotesByQuote(this.QID, this.Version);
      }
    }, err => {
    });
  }

  CloseNotesPopup() {
    this.notesPopupVisible = false;
  }

  // OpenCustomeNotesModal() {
  //   $('#CustomeNote').css("border", "1px solid #BABFC7");
  //   $('#CustomeNote').val("");
  //   this.IsCustomeNotePopup = true;
  // }
  OpenCustomeNotesModal() {
    $('#CustomeNote').focus();
    $('#CustomeNote').css("border", "1px solid #BABFC7");
    $('#CustomeNote').val("");
    this.IsCustomeNotePopup = true;
  }
  SaveCustquickNotes() {
    $('#SaveCustNotes').focus();
  }

  SaveCustomeNotes() {
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    if ($('#CustomeNote').val() == "") {
      $('#CustomeNote').css("border", "1px solid #ff586b");
    }
    else {
      $('#CustomeNote').css("border", "1px solid #BABFC7");
      var QuotesNotes = {
        QuoteID: this.QuoteID,
        Description: $('#CustomeNote').val(),
        Active: true,
        CreatedBy: this.userProfile.sub,
        CreatedDate: $('#today').val(),
      }
      this.projectService.AddCustomeQuoteNotes(QuotesNotes).subscribe(data => {
        if (data) {
          notify('Note added successfully.', 'success', 2000);
          this.GetAndLoadNotesByQuote(this.QID, this.Version);
          this.IsCustomeNotePopup = false;
        }
      }, err => {
        notify(err, 'error', 5000);
      });
    }
  }

  CloseCustomeNotePopup() {
    this.IsCustomeNotePopup = false;
  }

  GetAndLoadItemsByQuote(QuoteID, Version) {
    this.projectService.GetItemsByQuote(QuoteID, Version).subscribe(data => {
      if (this.QuoteCustomerInfo.QuoteLockedBy != null && this.userProfile.sub != this.QuoteCustomerInfo.QuoteLockedBy) {
        data.forEach(element => {
          element.Locked = true;
        });
        this.QuotesItemsList = data;
      }
      else {
        this.QuotesItemsList = data;
      }
      this.QuotesItemsListDataSource = {
        store: {
          type: "array",
          data: this.QuotesItemsList,
          key: "QuoteItemsID"
        }
      }
      this.ItemOrderList = this.QuotesItemsListDataSource;
      //this.InitialQuotesItemsListForCalculation = data;

      //this.InitialQuotesItemsListForCalculation.forEach(element => {
      //this.TotalCost = this.TotalCost + +element.UnitPrice;
      //});
    },
      err => {
        console.log('Quote items Data Fetch Failed..');
      });
  }

  CloseReOrderNotesPopup() {
    this.GetAndLoadNotesByQuote(this.QuoteID, this.Version);
  }

  GetAndLoadNotesByQuote(QuoteID, Version) {
    this.projectService.GetNotesByQuote(QuoteID, Version, ).subscribe(data => {
      if (this.QuoteCustomerInfo.QuoteLockedBy != null && this.userProfile.sub != this.QuoteCustomerInfo.QuoteLockedBy) {
        data.forEach(element => {
          element.Locked = true;
        });
        this.QuotesNotesList = data;
      }
      else {
        this.QuotesNotesList = data;
      }
      this.QuotesNotesListDataSource = {
        store: {
          type: "array",
          data: this.QuotesNotesList,
          key: "QuoteNoteID"
        }
      }
      this.NotesOrderList = this.QuotesNotesList;
    },
      err => {
        console.log('Quote Notes Data Fetch Failed..');
      });
  }

  OnNotesCellPrepared(e) {
    if (e.rowType == 'data' && e.column.command === "edit") {
      if (e.row.data.Locked) {
        e.cellElement.empty();
      }
      console.log(e.row.data);
      if (!e.row.data.Locked && e.row.data.DefaultNote == "null") {
        console.log("======----=====");
      }
      if (!e.row.data.Locked && e.row.data.DefaultNote) {
        //e.cellElement.find(".dx-link-delete").remove();
        e.cellElement.empty();
      }
      // if(!e.row.data.Locked && e.row.data.DefaultNote == false)
      // {
      //   e.isEditing = false;
      // }
    }
    // if (e.rowType == 'data' && e.data.Description) {
    //   e.cellElement.css('white-space', 'pre-line');
    // }
  }

  AddNewNote(e) {
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    e.data.CreatedBy = this.userProfile.sub;
    e.data.QuoteID = this.QID;
    this.projectService.AddNotes(e.data).subscribe(data => {
      if (data) {
        if (data == "Alert Message" && this.QuoteCustomerInfo.Locked) {
          this.RefreshPageAlert = true;
          this.AlertMessage = "Some other user EDITING this Quote. You can't edit until it's LOCKED";
        }
        else if (data == "Alert Message" && !this.QuoteCustomerInfo.Locked) {
          this.RefreshPageAlert = true;
          this.AlertMessage = "Some other user EDITING this Quote. You can't edit until it's LOCKED";
        }
        else {
          this.GetAndLoadNotesByQuote(this.QID, this.Version);
          notify('Notes saved successfully.', 'success', 2000);
        }
      }
    }, err => {
      notify(err, 'error', 2000);
    });
  }

  OnNotesEditStart(e) {
    if (e.dataField == "Description") {
      e.editorName = "dxTextArea";
      e.editorOptions.height = 90;
    }
  }

  UpdateNote(e: any) {
    console.log(e);
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    e.key.LastModifiedBy = this.userProfile.sub;
    e.key.LastModifiedDate = "";
    e.key.NotesID = "";
    this.projectService.UpdateNote(e.key).subscribe(data => {
      if (data) {
        if (data == "Alert Message" && this.QuoteCustomerInfo.Locked) {
          this.RefreshPageAlert = true;
          this.AlertMessage = "Some other user EDITING this Quote. You can't edit until it's LOCKED";
        }
        else if (data == "Alert Message" && !this.QuoteCustomerInfo.Locked) {
          this.RefreshPageAlert = true;
          this.AlertMessage = "Some other user EDITING this Quote. You can't edit until it's LOCKED";
        }
        else {
          notify('Notes updated successfully.', 'success', 2000);
        }
      }
    }, err => {
      notify(err, 'error', 5000);
    });
  }

  DeleteNote(e: any) {
    this.projectService.DeleteNote(e.data.QuoteNoteID).subscribe(data => {
      if (data) {
        if (data == "Alert Message" && this.QuoteCustomerInfo.Locked) {
          this.RefreshPageAlert = true;
          this.AlertMessage = "Some other user EDITING this Quote. You can't edit until it's LOCKED";
        }
        else if (data == "Alert Message" && !this.QuoteCustomerInfo.Locked) {
          this.RefreshPageAlert = true;
          this.AlertMessage = "Some other user EDITING this Quote. You can't edit until it's LOCKED";
        }
        else {
          notify('Notes deleted successfully.', 'success', 2000);
        }
      }
    }, err => {
      notify(err, 'error', 2000);
    });
  }

  GetAndLoadTermsByQuote(QuoteID, Version) {
    this.projectService.GetTermsByQuote(QuoteID, Version).subscribe(data => {
      if (this.QuoteCustomerInfo.QuoteLockedBy != null && this.userProfile.sub != this.QuoteCustomerInfo.QuoteLockedBy) {
        data.forEach(element => {
          element.Locked = true;
        });
        this.QuotesTermsList = data;
      }
      else {
        this.QuotesTermsList = data;
      }
    },
      err => {
        console.log('Quote TermsNConditions Data Fetch Failed..');
      });
  }

  OpenItemsModal(e: any) {
    //this.GetItemsByProductLine(this.ProductLineID);
    this.IsItems = true;
    this.IsAssembies = false;
    this.itemPopupVisible = true;
    this.flag = false;
  }

  GetItemsByProductLine(PLId) {
    this.projectService.GetItemsByProductLine(PLId).subscribe(data => {
      this.ProductLineItemsList = data;
      this.ProductLineItemsListDataSource = {
        store: {
          type: "array",
          data: this.ProductLineItemsList,
          key: "ItemID"
        }
      }
    },
      err => {
        console.log('Product Line items Data Fetch Failed..');
      });
  }

  GetProductLine(e: number) {
    this.metaService.GetProductLinesByDivId(e).subscribe(data => {
      this.ProductLinesList = data;
    },
      err => {
        console.log('Product lines Data Fetch Failed..');
      });
  }

  FilterWithProductLine(e) {
    //Get P ITems by Product Line Id
    this.projectService.GetProjectItemsByDivOrPLID(this.ProjectID, 0, e.value).subscribe(data => {
      this.ProjectItemList = data;
      this.DivisionItemsListDataSource = {
        store: {
          type: "array",
          data: this.ProjectItemList,
          key: "ItemID"
        }
      }
    },
      err => {
        console.log('product line items Data Fetch Failed..');
      });
  }


  GetItemsByDivision(DivId) {
    this.projectService.GetItemsByDivision(DivId).subscribe(data => {
      this.DivisionsItemsList = data;
      this.DivisionItemsListDataSource = {
        store: {
          type: "array",
          data: this.DivisionsItemsList,
          key: "ItemID"
        }
      }
      this.selectedRows = this.DivisionsItemsList.filter(m => m.QuoteItemsID != null).map(n => n.ItemID);
    },
      err => {
        console.log('division items Data Fetch Failed..');
      });
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

  OnQuoteItemsCellPrepared(e) {
    if (e.rowType == 'data' && e.row.data.Locked && e.column.command === "edit") {
      e.cellElement.empty();
    }
  }

  CurrencyFormatter(cellInfo) {
    if (cellInfo.value == null)
      cellInfo.value = 0;
    return cellInfo.value.toFixed(2).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,")
  }

  AddQuoteItems(e, quantity: number) {
    $('.AddPItems').css("pointer-events", "none");
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    this.Quantity = $('#' + e.ItemID).val() == "" ? 1 : +$('#' + e.ItemID).val();
    if (e.Type == 'I') {
      this.addEditItemloadingVisible = true;
      this.IsDisabled = true;
      this.IsPopupDisabled = true;
      var quoteItems = {
        QuoteID: this.QID,
        ItemID: e.ItemID,
        ProjectID: this.ProjectID,
        QTY: this.Quantity,
        TotalPrice: 1,
        Freight: 1,
        TotalFreight: 1,
        CreatedBy: this.userProfile.sub,
        CreatedDate: $('#today').val(),
        Active: true,
        Rounding: e.Rounding
      }
      this.projectService.AddQuoteItems(quoteItems).subscribe(data => {
        if (data) {
          if (data == "Alert Message" && this.QuoteCustomerInfo.Locked) {
            this.RefreshPageAlert = true;
            this.AlertMessage = "Some other user EDITING this Quote. You can't edit until it's LOCKED";
          }
          else if (data == "Alert Message" && !this.QuoteCustomerInfo.Locked) {
            this.RefreshPageAlert = true;
            this.AlertMessage = "Some other user EDITING this Quote. You can't edit until it's LOCKED";
          }
          else {
            this.ItemList = this.ItemList.filter(m => m.ItemID != e.ItemID);
            notify('Items added successfully.', 'success', 2000);
            this.GetAndLoadItemsByQuote(this.QuoteID, this.Version);
            this.GetQuoteCustomerData(this.QuoteID, 0);
            $('#' + e.ItemID).val('');
          }
        }
        this.addEditItemloadingVisible = false;
        this.IsPopupDisabled = false;
        $('.AddPItems').css("pointer-events", "auto");
      }, err => {
        $('.AddPItems').css("pointer-events", "auto");
      });
    }
    else {
      this.Quantity = $('#' + e.ItemID).val() == "" ? 1 : +$('#' + e.ItemID).val();
      this.addEditItemloadingVisible = true;
      this.IsDisabled = true;
      this.IsPopupDisabled = true;
      var quoteAssemblyItem = {
        QuoteID: this.QID,
        ItemID: e.ItemID,
        ProjectID: this.ProjectID,
        QTY: this.Quantity,
        TotalPrice: 1,
        Freight: 1,
        TotalFreight: 1,
        CreatedBy: this.userProfile.sub,
        CreatedDate: $('#today').val(),
        Active: true,
        AssemblyID: e.ItemID
      }
      this.projectService.AddQuoteItems(quoteAssemblyItem).subscribe(data => {
        if (data) {
          this.ItemList = this.ItemList.filter(m => m.ItemID != e.ItemID);
          notify('Items added successfully.', 'success', 2000);
          this.GetAndLoadItemsByQuote(this.QuoteID, this.Version);
          this.GetQuoteCustomerData(this.QuoteID, 0);
          $('#' + e.ItemID).val('');
        }
        $('.AddPItems').css("pointer-events", "auto");
        this.addEditItemloadingVisible = false;
        this.IsPopupDisabled = false;
      }, err => {
        $('.AddPItems').css("pointer-events", "auto");
      });
    }
  }

  UpdateQuoteItem(e) {
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    var QuoteItem = {
      QuoteItemsID: e.key.QuoteItemsID,
      QuoteID: this.QuoteID,
      QTY: e.key.QTY,
      //UnitPrice: e.key.UnitPrice,
      LastModifiedBy: this.userProfile.sub,
      QuoteItemGlobalMarkup: e.key.QuoteItemGlobalMarkup,
      UnitCost: e.key.QuoteItemUnitCost,
      UseSugGlobalMarkup: e.key.UseSuggestedGlobalMarkup,
      QuoteItemDescription: e.key.QuoteItemDescription
    }
    this.projectService.UpdateQuoteItems(QuoteItem).subscribe(data => {
      if (data) {
        if (data == "Alert Message" && this.QuoteCustomerInfo.Locked) {
          this.RefreshPageAlert = true;
          this.AlertMessage = "Some other user EDITING this Quote. You can't edit until it's LOCKED";
        }
        else if (data == "Alert Message" && !this.QuoteCustomerInfo.Locked) {
          this.RefreshPageAlert = true;
          this.AlertMessage = "Some other user EDITING this Quote. You can't edit until it's LOCKED";
        }
        else {
          notify('Items updated successfully.', 'success', 2000);
          this.GetAndLoadItemsByQuote(this.QuoteID, this.Version);
          this.GetQuoteCustomerData(this.QuoteID, 0);
          //this.GetItemsByProductLine(this.ProductLineID);
        }
      }
    }, err => {
    });
  }

  DeleteQuoteItem(e) {
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    this.projectService.DeleteQuoteItems(e.data.QuoteItemsID, this.userProfile.sub).subscribe(data => {
      if (data) {
        if (data == "Alert Message" && this.QuoteCustomerInfo.Locked) {
          this.RefreshPageAlert = true;
          this.AlertMessage = "Some other user EDITING this Quote. You can't edit until it's LOCKED";
        }
        else if (data == "Alert Message" && !this.QuoteCustomerInfo.Locked) {
          this.RefreshPageAlert = true;
          this.AlertMessage = "Some other user EDITING this Quote. You can't edit until it's LOCKED";
        }
        else {
          notify('Item deleted successfully.', 'success', 2000);
          this.GetAndLoadItemsByQuote(this.QuoteID, this.Version);
          this.GetQuoteCustomerData(this.QuoteID, 0);
        }
      }
    }, err => {
    });
  }

  OpenNotesReOrderPopUp() {
    this.OrderSelectedNotes = null;
    this.selectedNotesOrderRows = [];
    this.notesReOrderPopupVisible = true;
  }
  CloseNotesReorderPopup() {
    this.notesReOrderPopupVisible = false;
  }
  SelectedNotesOrderRow(e) {
    console.log(e);
    this.OrderSelectedNotes = e.selectedRowsData[0];
    console.log(this.OrderSelectedNotes);
  }
  DragToTopNotes() {
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    if (this.OrderSelectedNotes == null) {
      notify("Please select a Note.", 'error', 2000);
    } else {
      var Order = {
        QuoteID: this.QuoteID,
        QuoteNoteID: this.OrderSelectedNotes.QuoteNoteID,
        Up: true,
        LastModifiedBy: this.userProfile.sub
      };
      this.projectService.ReOrderNotes(Order).subscribe(data => {
        this.GetAndLoadNotesByQuote(this.QuoteID, this.Version);
        notify("Order Updated", 'success', 2000);
      }, err => {
        notify(err, 'error', 2000);
      });
    }
  }
  DragToBottomNotes() {
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    if (this.OrderSelectedNotes == null) {
      notify("Please select a Note.", 'error', 2000);
    } else {
      var Order = {
        QuoteID: this.QuoteID,
        QuoteNoteID: this.OrderSelectedNotes.QuoteNoteID,
        Up: false,
        LastModifiedBy: this.userProfile.sub
      };
      this.projectService.ReOrderNotes(Order).subscribe(data => {
        this.GetAndLoadNotesByQuote(this.QuoteID, this.Version);
        notify("Order Updated", 'success', 2000);
      }, err => {
        notify(err, 'error', 2000);
      });
    }
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
    this.OrderSelectedItem = e.selectedRowsData[0];
  }
  DragToTop() {
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    if (this.OrderSelectedItem == null) {
      notify("Please select an item", 'error', 2000);
    } else {
      var Order = {
        ProjectItemID: 0,
        ProjectID: 0,
        QuoteID: this.QuoteID,
        QuoteItemsID: this.OrderSelectedItem.QuoteItemsID,
        Up: true,
        LastModifiedBy: this.userProfile.sub
      };
      this.projectService.ReOrderItems(Order).subscribe(data => {
        this.GetAndLoadItemsByQuote(this.QuoteID, this.Version);
        notify("Order Updated", 'success', 2000);
      }, err => {
        notify(err, 'error', 2000);
      });
    }
  }
  DragToBottom() {
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    if (this.OrderSelectedItem == null) {
      notify("Please select an item", 'error', 2000);
    } else {
      var Order = {
        ProjectItemID: 0,
        ProjectID: 0,
        QuoteID: this.QuoteID,
        QuoteItemsID: this.OrderSelectedItem.QuoteItemsID,
        Up: false,
        LastModifiedBy: this.userProfile.sub
      };
      this.projectService.ReOrderItems(Order).subscribe(data => {
        this.GetAndLoadItemsByQuote(this.QuoteID, this.Version);
        notify("Order Updated", 'success', 2000);
      }, err => {
        notify(err, 'error', 2000);
      });
    }
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
    this.IsAddItemsBtn = true;
    this.projectService.PutProjectAssembly(this.ProjectID, this.ProjectAssemblies, true, "Basanta", new Date(Date.now()), "Basanta", new Date(Date.now())).subscribe(data => {
      this.ProjectAssemblyList = data;
      this.loadingVisible = false;
      this.IsPopupDisabled = false;
      this.itemPopupVisible = false;
    }, err => {
    });
    this.saveSuccess = true;
  }

  CloseItemsPopup() {
    this.IsDisabled = true;
    this.AssemblyBtnIsDisabled = true;
    this.IsPopupDisabled = false;
    this.itemPopupVisible = false;
    //this.IsAddItemsBtn = true;
    $('#addItemsInputField').val("");
  }

  FilterSelected(event) {
    if (event.value == "Items") {
      this.IsItems = true;
      this.IsAssembies = false;
      //this.OpenItemsModal(this.ProjectID);
      //this.IsItems = true;
      //this.IsAssembies = false;
    }
    else {
      this.IsItems = false;
      this.IsAssembies = true;
      //this.GetProjectAssemblies(this.ProjectID);
      //this.IsItems = false;
      //this.IsAssembies = true;
    }
  }

  SearchItems(e) {
    if (e.length == 3 || e.length > 3) {
      if (this.IsItems == true) {
        this.projectService.GetItemsBySearchParam("Items", this.ProjectID, this.QuoteID, this.ProductLineID, this.DivisionID, e).subscribe(data => {
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
      else {
        this.projectService.GetAssembliesBySearchParam(e, e, e, e, true).subscribe(data => {
          this.AssemblyList = data;
          this.flag = true;
          this.IsItems = false;
          this.IsAssembies = true;
        },
          err => {
            console.log('Division Data Fetch Failed..');
          });
      }
    }
  }

  OnTermsCellPrepared(e) {
    if (e.rowType == 'data' && e.row.data.DefaultTermsAndConditions && e.column.command === "edit") {
      e.cellElement.empty();
    }
    if (e.rowType == 'data' && e.column.command === "edit" && this.IsQuoteLocked) {
      e.cellElement.empty();
    }
  }


  OpenTermsModal(e: any) {
    this.IsAddTermsPopup = true;
    this.GetAssociateTermsAndConditions(this.DivisionID, this.QuoteID);
  }

  DeleteQuoteTerms(e: any) {
    this.projectService.DeleteQuoteTerms(e.data.QuoteTermsAndConditionsID).subscribe(data => {
      console.log(data);
      if (data) {
        if (data == "Alert Message" && this.QuoteCustomerInfo.Locked) {
          this.RefreshPageAlert = true;
          this.AlertMessage = "Some other user EDITING this Quote. You can't edit until it's LOCKED";
        }
        else if (data == "Alert Message" && !this.QuoteCustomerInfo.Locked) {
          this.RefreshPageAlert = true;
          this.AlertMessage = "Some other user EDITING this Quote. You can't edit until it's LOCKED";
        }
        else {
          notify('Terms deleted successfully.', 'success', 2000);
        }
      }
    }, err => {
      notify(err, 'error', 2000);
    });
  }

  GetAssociateTermsAndConditions(DivisionID, QuoteID) {
    this.projectService.GetAssociateTerms(DivisionID, QuoteID).subscribe(data => {
      this.AssociateTermsNConditionsList = data;
      this.AssociateTermsNConditionsDataSource = {
        store: {
          type: "array",
          data: this.AssociateTermsNConditionsList,
          key: "TermsAndConditionsID"
        }
      }
      this.selectedRows = [];
    },
      err => {
        console.log('Division TermsNConditions Data Fetch Failed..');
      });
  }

  TermsSelectionChangedHandler(termsId) {
    if (termsId.length == 0)
      this.IsDisabled = true;
    else
      this.IsDisabled = false;
    this.ProjectItemList = [];
    this.QuoteTerms = "";
    for (var index: number = 0; index < termsId.length; index++) {
      this.QuoteTerms += termsId[index] + ",";
    }
  }

  SaveTerms() {
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    this.termsLoadingVisible = true;
    //this.IsDisabled = true;
    this.IsPopupDisabled = true;
    var QuotesTerms = {
      QuoteID: this.QuoteID,
      QuoteTerms: this.QuoteTerms,
      CreatedBy: this.userProfile.sub
    }
    this.projectService.SaveQuoteTerms(QuotesTerms).subscribe(data => {
      if (data) {
        if (data == "Alert Message" && this.QuoteCustomerInfo.Locked) {
          this.RefreshPageAlert = true;
          this.AlertMessage = "Some other user EDITING this Quote. You can't edit until it's LOCKED";
        }
        else if (data == "Alert Message" && !this.QuoteCustomerInfo.Locked) {
          this.RefreshPageAlert = true;
          this.AlertMessage = "Some other user EDITING this Quote. You can't edit until it's LOCKED";
        }
        else {
          notify('Terms added successfully.', 'success', 2000);
          this.GetAndLoadTermsByQuote(this.QID, this.Version);
        }
      }
      this.termsLoadingVisible = false;
      this.IsPopupDisabled = false;
      this.IsAddTermsPopup = false;
    }, err => {
    });
    this.IsAddTermsPopup = false;
  }

  CloseTermPopup() {
    this.IsAddTermsPopup = false;
  }

  UnlockConfirmMsgPopup(e) {
    this.IsUnlockQuotePopupVisible = true;
  }

  DontUnlockProject() {
    console.log(this.QuoteCustomerInfo);
    this.IsSwitch = true;
    this.QuoteCustomerInfo.Locked = true;
    this.IsQuoteLocked = true;
    console.log(this.onLockSwitch.instance);
    this.IsUnlockQuotePopupVisible = false;
  }

  YesUnlockProject() {
    this.UpdateLockUnlock();
    this.IsUnlockQuotePopupVisible = false;
  }


  UpdateLockUnlock() {
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    let QLockHistory = {
      QuoteID: this.QID,
      //QuoteCustomerID: this.QuoteCustomerID,
      User: this.userProfile.sub,
      Active: true,
      CreatedBy: this.userProfile.sub,
      LastModifiedBy: this.userProfile.sub,
      Locked: this.QuoteCustomerInfo.Locked
    }
    this.projectService.LockUnLockQuote(QLockHistory).subscribe(data => {
      if (data) {
        console.log(this.QuoteCustomerInfo.Locked);
        if (data == "Alert Message" && this.QuoteCustomerInfo.Locked) {
          this.RefreshPageAlert = true;
          this.AlertMessage = "Some other user EDITING this Quote. You can't edit until it's LOCKED";
          this.QuoteCustomerInfo.Locked = true;
          this.QuoteItemGrid.instance.refresh();
          this.QuoteNotesGrid.instance.refresh();
          this.QuoteTermsGrid.instance.refresh();
        }
        else if (data == "Alert Message" && !this.QuoteCustomerInfo.Locked) {
          this.RefreshPageAlert = true;
          this.AlertMessage = "Some other user EDITING this Quote. You can't edit until it's LOCKED";
          this.QuoteCustomerInfo.Locked = true;
          this.QuoteItemGrid.instance.refresh();
          this.QuoteNotesGrid.instance.refresh();
          this.QuoteTermsGrid.instance.refresh();
        }
        else {
          if (this.IsQuoteLocked == true) {
            this.IsQuoteLocked = false;
            this.IsAddItemsBtn = false;
          }
          else {
            this.IsQuoteLocked = true;
            this.IsAddItemsBtn = true;
          }
          this.QuoteVersion();
          this.GetQuoteCustomerData(this.QuoteID, 0);
          if (this.QuoteCustomerInfo.Locked)
            notify('Quote un-locked successfully.', 'success', 2000);
          else
            notify('Quote locked successfully.', 'success', 2000);
        }
      }
    }, err => {
      notify(err, 'error', 2000);
    });
  }

  ReloadPage() {
    this.RefreshPageAlert = false;
    //window.location.reload();
  }

  OpenEmailModal() {
    console.log(this.QuotesItemsList)
    if (this.QuotesItemsList.length > 0) {
      this.projectService.GetEmailProposalContacts(this.ProjectID, this.QuoteID).subscribe(data => {
        this.QuoteEmailProposalContacts = data;
        //this.CustomerOfficeContactsList = data;
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
            this.QuoteEmailList.push(element.Email);
            this.QuoteEmailListDataSource = {
              store: {
                type: "array",
                data: this.QuoteEmailList,
                key: element.ContactID
              }
            }
            this.QuoteEmailsByComma = this.QuoteEmailsByComma + ";" + element.Email;
          }

        });
        this.EmailProposalContactsDataSource = {
          store: {
            type: "array",
            data: this.QuoteEmailProposalContacts,
            key: "ContactID"
          }
        },
          err => {
            console.log('customer contacts data fetch failed');
          }
      });

      this.GetEmailHistory();
      this.EmailTabSelectedIndex = 0
      this.emailPopupVisible = true;
      this.IsDisabled = false;
    }
    else {
      this.IsNoItemsVisible = true;
    }

  }

  canclePop() {
    this.IsNoItemsVisible = false;
  }

  GetEmailList(e) {
    this.QuoteEmailsByComma = "";
    e.value.forEach(element => {
      if (this.QuoteEmailsByComma == "")
        this.QuoteEmailsByComma = element;
      else
        this.QuoteEmailsByComma = this.QuoteEmailsByComma + ";" + element;
    });
    console.log(this.QuoteEmailsByComma);

    if (this.QuoteEmailsByComma == "" && $('#QuoteLevEmailCC').val() == "")
      this.IsDisabled = true;
    else
      this.IsDisabled = false;
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

  EmailTabSelectionChanged(e) {
    if (e.addedItems[0].id == 1) {
      this.EmailTabSelectedIndex = 0;
      this.IsEmailHistoryTab = false;
      this.IsEmailTab = true;
    }
    else {
      this.EmailTabSelectedIndex = 1;
      this.IsEmailTab = false;
      this.IsEmailHistoryTab = true;
    }
  }

  GetEmailHistory() {
    //GET EMAIL HISTORY
    this.projectService.GetEmailHistory(this.ProjectID, this.QuoteID).subscribe(data => {
      this.EmailHistoryList = data;
      this.EmailListDataSource = {
        store: {
          type: "array",
          data: this.EmailHistoryList,
          key: "EmailRequestID"
        }
      }
    },
      err => {
        console.log('email history data fetch failed');
      });
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
        RequestedBy: this.userProfile.sub,
        EmailSubject: $('#QuoteLevEmailSub').val(),
        EmailBody: $('#QuoteLevEmailBody').val(),
        EmailTo: this.QuoteEmailsByComma, //$('#QuoteLevEmailTo').val(),
        CCTo: $('#QuoteLevEmailCC').val()
      }
      this.projectService.PostEmail(Email).subscribe(data => {
        if (data) {
          if (data == "Alert Message" && this.QuoteCustomerInfo.Locked) {
            this.RefreshPageAlert = true;
            this.AlertMessage = "Some other user EDITING this Quote. You can't edit until it's LOCKED";
          }
          else if (data == "Alert Message" && !this.QuoteCustomerInfo.Locked) {
            this.RefreshPageAlert = true;
            this.AlertMessage = "Some other user EDITING this Quote. You can't edit until it's LOCKED";
          }
          else {
            notify('Your Email has been queued.', 'success', 2000);
            this.GetEmailHistory();
            this.emailLoadingVisible = false;
            this.IsPopupDisabled = false;
            this.IsDisabled = true;
            //this.emailPopupVisible = false;
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
        }
        else {
          notify('Email request is already in queue.', 'error', 2000);
          this.emailLoadingVisible = false;
          this.IsPopupDisabled = false;
          this.IsDisabled = true;
          //this.emailPopupVisible = false;
        }
      },
        err => {
          console.log('Email request failed');
        });

    }
    else
      $('#QuoteLevEmailCC').css("border", "1px solid red");

  }

  onShown() {
    setTimeout(() => {
      this.IsQuoteSave = false;
    }, 3000);
  }

  CloseEmailPopup() {
    this.IsDisabled = false;
    this.emailPopupVisible = false;
  }

  CloseMatAjax(e) {
    if (e.target.classList.contains('serachItems') || e.target.classList.contains('fa-plus')) {
      this.flag = true;
    }
    else {
      this.flag = false;
      this.ItemList = [];
      this.AssemblyList = [];
    }


  }

  GeneratePDF() {
    if (this.QuotesItemsList.length > 0) {
      this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
      var PDFProposal = {
        QuoteID: this.QID,
        QuoteNumber: this.QuoteNumber,
        StateID: this.state,
        ProjectID: this.ProjectID.toString(),
        ProjectNumber: this.ProjectNumber,
        ControlNumber: this.ControlNumber,
        Highway: this.Highway,
        County: this.ProjectCountyName,
        ProductLine: this.ProductLineName,
        Version: this.Version,
        CreatedBy: this.userProfile.sub
      }
      this.projectService.GeneratePDF(PDFProposal).subscribe(data => {
        if (data) {
          window.open(data, "_blank");
          notify('PDF Generated Successfully.', 'success', 2000);
        }
      },
        err => {
          console.log('PDF Generated failed');
        });
    }
    else {
      this.IsNoItemsVisible = true;
    }
  }

  CalculateNoOfTrucks() {
    var truckCapacity = $('#TruckCapacity').val();
    var NoOfTrucksCalculated = this.QuoteCustomerInfo.TotalWeight / +truckCapacity;
    $('#NoOfTrucksCalculated').val(NoOfTrucksCalculated.toFixed(2));
  }

  // CalculateFreight()
  // {
  //   var NoOfTrucks = +$('#NoOfTrucks').val();
  //   var Freight = NoOfTrucks * this.FreightList[0].FreightRate;
  //   $('#Freight input').val(Freight);
  //// if (e.rowType == 'data' && e.data.QuoteStatusID == 1)	    
  ////    e.rowElement.css('background-color', '#13977b61');
  // }

  YesbackQuote() {
    //this.router.events.subscribe((val) => "['/main/prjdts', QuoteCustomerInfo.ProjectID]")
    //this.router.navigateByUrl("['/main/prjdts', QuoteCustomerInfo.ProjectID]");
    //this.router.navigateByUrl("['/main/prjdts', QuoteCustomerInfo.ProjectID]");
    this.confirmationpopupvisible = false;
  }


  DontbackQuote() {
    console.log("No");

  }

  backQuote() {
    this.isvaluechanged = true;
    console.log("this is value changed")

  }
  navigateLink() {
    if (this.isvaluechanged) {
      console.log("valuechanged");
      this.confirmationpopupvisible = true;
      //this.router.events.subscribe((val) => "['/main/prjdts', QuoteCustomerInfo.ProjectID]")
    } else {
      console.log("not changed");
      this.router.navigateByUrl('/main/prj');
      //this.router.navigateByUrl("['/main/prjdts', QuoteCustomerInfo.ProjectID]");
      /*  this.router.events.subscribe((val) => "['/main/prjdts', QuoteCustomerInfo.ProjectID]") */
    }
    //this.router.events.subscribe((val) => [routerLink]="['/main/prjdts', QuoteCustomerInfo.ProjectID]")

  }
  SubmitQuote() {
    this.IsQuoteSave = true;
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    var quote = {
      QuoteID: this.QuoteID,
      ProjectID: this.ProjectID,
      GlobalMarkup: +$('#SugGlobalMarkup').val(),
      NoOfTrucks: +$('#NoOfTrucks').val(),
      Surcharge1: +$('#Surcharge1').val(),
      Surcharge2: +$('#Surcharge2').val(),
      Surcharge3: +$('#Surcharge3').val(),
      ActualGlobalMarkUp: this.QuoteCustomerInfo.GlobalMarkup,
      Freight: +$('#Freight').val(),
      TotalBidPrice: this.QuoteCustomerInfo.TotalBidPrice,
      TotalFreight: this.QuoteCustomerInfo.TotalFreight,
      TotalCost: this.QuoteCustomerInfo.TotalCost,
      LastModifiedBy: this.userProfile.sub,
      AuthorisedBy: this.AuthorisedBy,
      EstimatedBy: this.EstimatedBy
    }
    this.projectService.UpdateQuote(quote).subscribe(data => {
      this.loadingVisible = false;
      if (data == null) {
        this.GetQuoteCustomerData(this.QuoteID, 0);
        this.GetAndLoadItemsByQuote(this.QID, 0);
        this.IsQuoteSave = false;
        notify('Quote Updated successfully.', 'success', 2000);
      }
      else {
        this.GetQuoteCustomerData(this.QuoteID, 0);
        this.IsQuoteSave = false;
        notify('Sorry! You can not update the quote', 'error', 2000);
      }
    }, err => {
      notify(err, 'error', 2000);
    });
  }

  /* Quote Item update */
  OpenQuoteOtemUpdatePopup(e) {
    $('#_ItemDesc input').css("border", "none");
    $('#_ItemWeight input').css("border", "none");
    $('#_ItemQTY input').css("border", "none");
    if (this.QuoteItemUpdate)
      this.checkboxinit = !this.QuoteItemUpdate.UseSugGlobalMarkup;
    else
      this.checkboxinit = true;
    this.projectService.GetQuoteItemForUpdate(e.key.QuoteItemsID).subscribe(data => {
      console.log(data);
      this.QuoteItemUpdate = data;
      //this.checkboxinit = false;
      this.checkboxinit = !this.QuoteItemUpdate.UseSugGlobalMarkup;
      this.checkboxinitDummy = this.QuoteItemUpdate.UseSugGlobalMarkup;
      this.QuoteItemEditPopupVisible = true;
    }, err => {
      console.log('Get Versions data failed..');
    });
  }
  SaveQuoteItemupdate() {
    console.log(this.QuoteItemUpdate);
    if (this.QuoteItemUpdate.Description == "") {
      $('#_ItemDesc input').css("border", "1px solid #ff00006b");
    }
    else
      $('#_ItemDesc input').css("border", "none");
    if (this.QuoteItemUpdate.Weight == null) {
      $('#_ItemWeight input').css("border", "1px solid #ff00006b");
    }
    else
      $('#_ItemWeight input').css("border", "none");
    if (this.QuoteItemUpdate.QTY == null) {
      $('#_ItemQTY input').css("border", "1px solid #ff00006b");
    }
    else
      $('#_ItemQTY input').css("border", "none");
    if (this.QuoteItemUpdate.Description != "" && this.QuoteItemUpdate.Weight != null && this.QuoteItemUpdate.QTY != null) {
      this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
      var QuoteItem = {
        QuoteItemsID: this.QuoteItemUpdate.QuoteItemsID,
        QuoteID: this.QuoteItemUpdate.QuoteID,
        QTY: this.QuoteItemUpdate.QTY,
        Weight: this.QuoteItemUpdate.Weight,
        LastModifiedBy: this.userProfile.sub,
        QuoteItemGlobalMarkup: this.QuoteItemUpdate.GlobalMarkup,
        UnitCost: this.QuoteItemUpdate.UnitCost,
        UseSugGlobalMarkup: this.QuoteItemUpdate.UseSugGlobalMarkup,
        QuoteItemDescription: this.QuoteItemUpdate.Description,
        UnitPrice: this.QuoteItemUpdate.UnitPrice,
        OverRideValue: this.OverRideFlag
      }
      this.projectService.UpdateQuoteItems(QuoteItem).subscribe(data => {
        if (data) {
          if (data == "Alert Message" && this.QuoteCustomerInfo.Locked) {
            this.RefreshPageAlert = true;
            this.AlertMessage = "Some other user EDITING this Quote. You can't edit until it's LOCKED";
          }
          else if (data == "Alert Message" && !this.QuoteCustomerInfo.Locked) {
            this.RefreshPageAlert = true;
            this.AlertMessage = "Some other user EDITING this Quote. You can't edit until it's LOCKED";
          }
          else {
            notify('Items updated successfully.', 'success', 2000);
            this.GetAndLoadItemsByQuote(this.QuoteID, this.Version);
            this.GetQuoteCustomerData(this.QuoteID, 0);
            this.QuoteItemEditPopupVisible = false;
          }
        }
      }, err => {
        notify('Exception Occured.', 'error', 2000);
      });
    }
  }
  CloseQuoteItemupdate() {
    console.log(this.checkboxinit);
    console.log(this.checkboxinitDummy);
    this.QuoteItemUpdate.UseSugGlobalMarkup = this.checkboxinitDummy;
    QuoteItemUpdate
    this.QuoteItemEditPopupVisible = false;
  }
  UseSugGlobalMarkupChange() {
    console.log(this.checkboxinit);
    console.log(this.QuoteItemUpdate.UseSugGlobalMarkup);
    if (this.checkboxinit) {
      if (!this.QuoteItemUpdate.UseSugGlobalMarkup) {
        this.QuoteItemUpdate.GlobalMarkup = this.QuoteItemUpdate.QuoteGlobalMarkup;
        this.CalculateUnitPrice();
      }
    }
    this.checkboxinit = true;
  }
  SugMarkupInit() {
    this.checkboxinit = true;
  }
  CalculateUnitPrice() {
    var UnitPrice = 0;
    var Qty = 0;
    if (this.QuoteItemUpdate.Weight == null) {
      this.QuoteItemUpdate.Weight = 0;
    }
    if (this.QuoteItemUpdate.Rounding == "C")
      Qty = Math.ceil(this.QuoteItemUpdate.QTY);
    else
      Qty = Math.floor(this.QuoteItemUpdate.QTY);
    /*console.log(this.QuoteItemUpdate.GlobalMarkup);
    if (((+this.QuoteItemUpdate.Weight.toFixed(2) + +this.QuoteItemUpdate.TotalWeight.toFixed(2)) * Qty) > 0)
      UnitPrice = (+this.QuoteItemUpdate.UnitCost.toFixed(2) * (1 + (+this.QuoteItemUpdate.GlobalMarkup.toFixed(2) / 100))) +
        ((+this.QuoteItemUpdate.TotalFreight.toFixed(2) * +this.QuoteItemUpdate.Weight.toFixed(2)) / ((+this.QuoteItemUpdate.Weight.toFixed(2) + +this.QuoteItemUpdate.TotalWeight.toFixed(2)) * Qty)) +
        (((+this.QuoteItemUpdate.TotalFreight.toFixed(2) * +this.QuoteItemUpdate.Weight.toFixed(2)) / ((+this.QuoteItemUpdate.Weight.toFixed(2) + +this.QuoteItemUpdate.TotalWeight.toFixed(2)) * Qty)) * ((+this.QuoteItemUpdate.GlobalMarkup.toFixed(2) / 100)))
    else*/
    var UnitPrice12 = (+this.QuoteItemUpdate.UnitCost.toFixed(2) * (1 + (+this.QuoteItemUpdate.GlobalMarkup.toFixed(2) / 100))) +
      ((+this.QuoteItemUpdate.TotalFreight.toFixed(2) * (+this.QuoteItemUpdate.QTY * +this.QuoteItemUpdate.Weight.toFixed(2))) / (((+this.QuoteItemUpdate.QTY * +this.QuoteItemUpdate.Weight.toFixed(2)) + +this.QuoteItemUpdate.TotalWeight.toFixed(2)) * Qty)) +
      (((+this.QuoteItemUpdate.TotalFreight.toFixed(2) * (+this.QuoteItemUpdate.QTY * +this.QuoteItemUpdate.Weight.toFixed(2))) / (((+this.QuoteItemUpdate.QTY * +this.QuoteItemUpdate.Weight.toFixed(2)) + +this.QuoteItemUpdate.TotalWeight.toFixed(2)) * Qty)) * ((+this.QuoteItemUpdate.GlobalMarkup.toFixed(2) / 100)))
    console.log(UnitPrice12);
    UnitPrice = UnitPrice12//(+this.QuoteItemUpdate.UnitCost.toFixed(2) * (1 + (+this.QuoteItemUpdate.GlobalMarkup.toFixed(2) / 100)))
    if (UnitPrice.toString() === "NaN")
      UnitPrice = 0
    console.log(this.QuoteItemUpdate);
    this.QuoteItemUpdate.UnitPrice = UnitPrice;
    console.log(UnitPrice);
    this.OverRideFlag = "Markup";
    console.log(this.OverRideFlag);
  }
  QuantityKeyPress() {
    // console.log(event);
    // if(event.charCode >= 48 && event.charCode <= 57 || event.charCode == 46)
    // {
    //   $('#_ItemQTY').val(event);
    //   console.log("-------"+ event);
    // }
  }
  CalculateGlobalMargin() {
    var GlobalMarkup = 0;
    if (this.QuoteItemUpdate.UnitCost == null) {
      this.QuoteItemUpdate.UnitCost = 0;
    }
    // if(!$('#_ItemQTY').val())
    // {
    //   $('#_ItemQTY').val("0.00");
    // }
    if (this.QuoteItemUpdate.QTY == null) {
      this.QuoteItemUpdate.QTY = 0.00;
    }
    // if(this.QuoteItemUpdate.Weight == null)
    // {
    //   this.QuoteItemUpdate.Weight = 0;
    // }
    /*
    GlobalMarkup = ((this.QuoteItemUpdate.UnitPrice * (this.QuoteItemUpdate.TotalWeight + this.QuoteItemUpdate.Weight)) /
      ((this.QuoteItemUpdate.TotalFreight * this.QuoteItemUpdate.Weight) + (this.QuoteItemUpdate.UnitCost * (this.QuoteItemUpdate.TotalWeight + this.QuoteItemUpdate.Weight))) - 1) * 100
      */
    //GlobalMarkup = (this.QuoteItemUpdate.UnitPrice - this.QuoteItemUpdate.UnitCost) / this.QuoteItemUpdate.UnitPrice;
    GlobalMarkup = ((this.QuoteItemUpdate.UnitPrice - this.QuoteItemUpdate.UnitCost) / this.QuoteItemUpdate.UnitCost) * 100;
    console.log(this.QuoteItemUpdate);
    this.QuoteItemUpdate.GlobalMarkup = GlobalMarkup;
    console.log(GlobalMarkup);
    this.OverRideFlag = "Unit Price";
    console.log(this.OverRideFlag);

    var GlobalMarkup12 = ((this.QuoteItemUpdate.UnitPrice * (this.QuoteItemUpdate.TotalWeight + (+this.QuoteItemUpdate.QTY * +this.QuoteItemUpdate.Weight.toFixed(2)))) /
      ((this.QuoteItemUpdate.TotalFreight * (+this.QuoteItemUpdate.QTY * +this.QuoteItemUpdate.Weight.toFixed(2))) + (this.QuoteItemUpdate.UnitCost * (this.QuoteItemUpdate.TotalWeight + (+this.QuoteItemUpdate.QTY * +this.QuoteItemUpdate.Weight.toFixed(2))))) - 1) * 100
    console.log("=========" + GlobalMarkup12);
    if (GlobalMarkup12 == Infinity)
      GlobalMarkup12 = 0
    if (GlobalMarkup12.toString() === "NaN")
      GlobalMarkup12 = 0;
    this.QuoteItemUpdate.GlobalMarkup = GlobalMarkup12;
  }
  EmailProposalToMe() {
    if (this.QuotesItemsList.length > 0) {
      this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
      var PDFProposal = {
        QuoteID: this.QID,
        ProjectID: this.ProjectID.toString(),
        ProjectNumber: this.ProjectNumber,
        ControlNumber: this.ControlNumber,
        Highway: this.Highway,
        County: this.ProjectCountyName,
        ProductLine: this.ProductLineName,
        Version: this.Version,
        CreatedBy: this.userProfile.sub,
        StateID: this.state,
        QuoteNumber: this.QuoteNumber
      }
      this.projectService.GeneratePDFAndEmailToMe(PDFProposal).subscribe(data => {
        if (data) {
          notify('Proposal has been sent to you, please check your inbox.', 'success', 2000);
        }
      },
        err => {
          console.log('Failed to send email.');
        });
    }
    else {
      this.IsNoItemsVisible = true;
    }
  }


  EditPrimeContractor() {
    $('#PrimeContractorField').focus();
    $('#PrimeContractorField').css("width", 110);
    $('#PrimeContractorField').css("border", 0);
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

    $('#primeContractDiv').css("border", 0);
    $('#primeContractDiv').css("border-radius", 0);
    $('#PrimeContractorField').prop("readonly", true);
    $('#PrimeContractorField').val(this.QuoteCustomerInfo.PrimeContractor);
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
    var Quote = {
      QuoteID: this.QuoteID,
      PrimeContractor: $('#PrimeContractorField').val(),
      LastModifiedBy: this.userProfile.sub
    }
    this.projectService.UpdateQuotePrimeContractor(Quote).subscribe(data => {
      if (data) {
        this.QuoteCustomerInfo.PrimeContractor = $('#PrimeContractorField').val().toString();
        //this.GetProjectById();
        notify('Prime Contractor saved successfully.', 'success', 2000);
        $('#primeContractorEditBtn').removeClass("hidden");
        $('#primeContractorSaveBtn').addClass("hidden");
        $('#primeContractorCancelBtn').addClass("hidden");
        $('#SavingSubContractor').addClass("hidden");
        $('#primeContractDiv').css("border", 0);
        $('#primeContractDiv').css("border-radius", 0);
        $('#PrimeContractorField').prop("readonly", true);
        $('#PrimeContractorField').css("width", "100%");
      }
    }, err => {
      //this.GetProjectById();
      notify(err, 'error', 2000);
      $('#primeContractorEditBtn').removeClass("hidden");
      $('#primeContractorSaveBtn').addClass("hidden");
      $('#primeContractorCancelBtn').addClass("hidden");
      $('#SavingSubContractor').addClass("hidden");
      $('#primeContractDiv').css("border", 0);
      $('#primeContractDiv').css("border-radius", 0);
      $('#PrimeContractorField').prop("readonly", true);
      $('#PrimeContractorField').css("width", "100%");
    });
  }

  onAwardEditorPreparing(e) {
    if (e.dataField == "CRMNote") {
      e.editorName = "dxTextArea";
      e.editorOptions.height = 70;
    }
    if ((e.dataField === "AwardValue") && (e.parentType === "dataRow")) {
      var Input = $("#AwardValueField").dxTextBox("instance");
      console.log(Input);
    }
  }
  OpenAwardUpdatePopup(e) {
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    $('#QuoteStatusDropDown input').css("border", "none");
    $('#AwardValue input').css("border", "none")
    this.EditAwardBidValue = e.key.TotalBidPrice;
    this.EditAwardValue = e.key.AwardValue;
    this.EditAwardedAmount = e.key.AwardedAmount;
    this.EditQuoteStatus = e.key.QuoteStatusID;
    this.EditAwardDate = e.key.AwardedDate;
    this.EditCRMNotes = e.key.CRMNote;
    this.QuoteID = e.key.QuoteID;
    this.AwardedMarginValue = e.key.AwardedMargin;
    this.TotalCost = e.key.TotalCost;
    this.TotalFreight = e.key.TotalFreight;
    if (e.key.AwardedDate == null) {
      this.EditAwardDate = new Date;
    }
    this.AwardedInfoPopupVisible = true;
  }

  UpdateQuoteAward() {
    if ($('#AwardValue input').val().toString().length == 0 && this.EditQuoteStatus == null) {
      this.UpdateStatus();
    }
    else if (this.EditQuoteStatus == null && $('#AwardValue input').val() > 0) {
      $('#QuoteStatusDropDown input').css("border", "1px solid red");
      $('#AwardValue input').css("border", "none");
      return false;
    }
    else if ($('#AwardValue input').val().toString().length == 0 && this.EditQuoteStatus == 1) {
      $('#AwardValue input').css("border", "1px solid red");
      return false;
    }
    else if (($('#AwardValue input').val() == "0" || $('#AwardValue input').val() < 0 || $('#AwardValue input').val() == "") && this.EditQuoteStatus != null || this.EditQuoteStatus == null) {
      $('#AwardValue input').css("border", "1px solid red");
      return false;
    }
    else {
      this.UpdateStatus();
    }
  }
  UpdateStatus() {
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
        this.projectService.GetCustomerByProductLine(this.QuoteCustomerInfo.ProductLineID, this.ProjectID, this.DivisionID).subscribe(data => {
          this.ProductLineQuoteList = data;
          this.ProductLineQuoteListDataSource = this.ProductLineQuoteList.filter(m => m.IsMasterQuote == false);
          this.IsAwardQuoteDataFetched = true;
          this.ProductLineMasterQuote = this.ProductLineQuoteList.filter(m => m.IsMasterQuote == true);
          this.selectedCustRowsForAward = [];//this.ProductLineQuoteList.filter(m => m.IsMasterQuote == false && m.IsAwarded == true).map(n => n.QuoteID); // [];//this.CountyCustomerList.filter(n => n.QuoteCustomerID!= null && n.QuoteID == this.QuoteID).map(m => m.CustomerID);;
        },
          err => {
            console.log('Customer Quote data fetch failed');
          });
        notify('Award value has been saved successfully.', 'success', 2000);
        this.GetQuoteCustomerData(this.QuoteID, 0);
      }
    }, err => {
      notify('Exception occured.', 'error', 2000);
    });
  }
  CloseAwardPopup() {
    $('#QuoteStatusDropDown input').css("border", "none");
    $('#AwardValue input').css("border", "none")
    this.EditAwardBidValue = null;
    this.EditAwardValue = null;
    this.EditAwardedAmount = null;
    this.EditQuoteStatus = null;
    this.AwardedMarginValue = null;
    this.EditAwardDate = new Date;
    this.EditCRMNotes = "";
    $('#CRMNote textarea').val('');
    this.AwardedInfoPopupVisible = false;
  }
  CalculateAwardMargin() {
    console.log($('#AwardValue input').val());
    console.log(this.TotalCost);
    console.log(this.TotalFreight);
    console.log(this.AwardedMarginValue);
    if ($('#AwardValue input').val()) {
      var _awardValue = +$('#AwardValue input').val();
      var y = this.TotalCost + this.TotalFreight;
      var x = _awardValue - y;
      var z = x / _awardValue;
      var result = z * 100;
      console.log(result);
      this.AwardedMarginValue = result; //$('#').val(_awardMargin);
    }
    else
      this.AwardedMarginValue = 0.00;
    if (this.EditQuoteStatus == null && $('#AwardValue input').val() > 0) {
      $('#QuoteStatusDropDown input').css("border", "1px solid red");
    }
    else {
      this.AwardedMarginValue = 0.00;
      $('#QuoteStatusDropDown input').css("border", "none")
      $('#AwardValue input').css("border", "none")
    }
  }


  onRowAwardClick(evt: any): void {
    console.log(evt.key.QuoteID);
    this.selectedAwardQuote = evt.key.QuoteID;
    evt.component.selectRows([evt.key.QuoteID], false);
  }

  AwardCustomer() {
    if (this.selectedAwardQuote > 0) {
      this.AwardLoadingVisible = true;
      this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
      var AwardQuote = {
        QuoteID: this.selectedAwardQuote,
        Awarded: true,
        AwardedDate: $('#today').val(),
        User: this.userProfile.sub
      }
      this.projectService.AwardQuote(AwardQuote).subscribe(data => {
        if (data) {
          this.QuoteCustomerPopupVisible = false;
          this.AwardLoadingVisible = false;
          notify('Quote has been awarded successfully.', 'success', 2000);
          //this.GetProjectDivisions();
        }
      }, err => {
        this.AwardLoadingVisible = false;
      });
    } else {
      notify('Please select a customer to award.', 'error', 2000);
    }
  }

  CloseQuoteCustomerPopup() {
    this.IsQtCstBtnDisabled = true;
    this.QuoteCustomerPopupVisible = false;
  }

  OpenCustomerPopUpForAward() {
    this.selectedAwardQuote = 0;
    this.IsQtCstBtnDisabled = true;
    this.projectService.GetCustomerByProductLine(this.QuoteCustomerInfo.ProductLineID, this.ProjectID, this.DivisionID).subscribe(data => {
      this.ProductLineQuoteList = data;
      this.ProductLineQuoteListDataSource = this.ProductLineQuoteList.filter(m => m.IsMasterQuote == false);
      this.IsAwardQuoteDataFetched = true;
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

  QuoteCustomerSelectionChangedHandler(e) {
    this.IsQtCstBtnDisabled = false;
    if (e.selectedRowKeys.length > 0)
      this.AwardQuote = e.selectedRowKeys[0].QuoteID;
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
  }

  SelectUpdatedBy(e) {
    this.AuthorisedBy = e.value;
    console.log(e.value);
  }
  SelectUpdatedBy1(e) {
    this.EstimatedBy = e.value;
    console.log(e.value);
  }
  ExportGridData(e) {
    this.QuoteNum = e;
    console.log(this.QuoteNum);
    var _ProductLine = JSON.parse(localStorage.getItem('sbr_ProductLine')) != null && localStorage.getItem('sbr_ProductLine') != "null" ? JSON.parse(localStorage.getItem('sbr_ProductLine')) : null;
    var _Division = JSON.parse(localStorage.getItem('sbr_Division')) != null && localStorage.getItem('sbr_Division') != "null" ? JSON.parse(localStorage.getItem('sbr_Division')) : null;
    var _ContractType = JSON.parse(localStorage.getItem('sbr_ContractType')) != null && localStorage.getItem('sbr_ContractType') != "null" ? JSON.parse(localStorage.getItem('sbr_ContractType')) : null;
    var _ProjectNum = JSON.parse(localStorage.getItem('sbr_ProjectNumber')) != null && localStorage.getItem('sbr_ProjectNumber') != "null" ? JSON.parse(localStorage.getItem('sbr_ProjectNumber')) : null;
    var _QuoteBeginDate = JSON.parse(localStorage.getItem('sbr_QuoteBeginDate')) != null && localStorage.getItem('sbr_QuoteBeginDate') != "null" ? JSON.parse(localStorage.getItem('sbr_QuoteBeginDate')) : null;
    var _QuoteEndDate = JSON.parse(localStorage.getItem('sbr_QuoteEndDate')) != null && localStorage.getItem('sbr_QuoteEndDate') != "null" ? JSON.parse(localStorage.getItem('sbr_QuoteEndDate')) : null;
    var _BusinessManager = JSON.parse(localStorage.getItem('sbr_BusinessManager')) != null && localStorage.getItem('sbr_BusinessManager') != "null" ? JSON.parse(localStorage.getItem('sbr_BusinessManager')) : null;
    var _QuoteNumber = JSON.parse(localStorage.getItem('sbr_QuoteNumber')) != null && localStorage.getItem('sbr_QuoteNumber') != "null" ? JSON.parse(localStorage.getItem('sbr_QuoteNumber')) : null;
    var _Status = JSON.parse(localStorage.getItem('sbr_Status')) != null ? JSON.parse(localStorage.getItem('sbr_Status')) : null;
    var _ControlNumber = JSON.parse(localStorage.getItem('sbr_ControlNumber')) != null && localStorage.getItem('sbr_ControlNumber') != "null" ? JSON.parse(localStorage.getItem('sbr_ControlNumber')) : null;

    var _searchparams = {
      ProductLineID: _ProductLine,
      DivisionID: _Division,
      ContractTypeID: _ContractType,
      ProjectNumber: _ProjectNum,
      QuoteBeginDate: _QuoteBeginDate,
      QuoteEndDate: _QuoteEndDate,
      BusinessManager: _BusinessManager,
      QuoteNumber: this.QuoteNum,
      Status: _Status,
      ControlNumber: _ControlNumber

    }
    /* var searchparams = {
      ProductLineID: $('#hidProductlineID').val(),
      DivisionID: $('#hidDivisionID').val(),
      QuoteBeginDate: $('#hidStartDate').val(),
      BusinessManager:$('#BusinessManager').val(),
      QuoteEndDate: $('#hidEndDate').val(),
      ContractTypeID: $('#hidContractTypeID').val()
    } */


    this.metaService.ExportSysproBudgetReport(_searchparams).subscribe(data => {
      if (data) {
        window.open(data, "_blank");
      } else {
        notify('Failed to export Syspro Budget report.', 'error', 2000);
      }

    },
      err => {
        console.log('Syspro Budget Report Data Fetch Failed..');
      });
  }
  OpenCustomerPopUpForLostJob(e) {


    this.IsQtCstBtnLostDisabled = true;
    this.QuoteCustomerPopupLostVisible = true;
    this.IsQtCstBtnLostDisabled = true;
    this.DivisionID = this.QuoteCustomerInfo.DivisionID;
    this.CustomerID = this.QuoteCustomerInfo.CustomerID;
    this.ProjectCountyID = this.QuoteCustomerInfo.CountyID;
    this.ProjectNumber = this.QuoteCustomerInfo.ProjectNumber;
    this.ControlNumber = this.QuoteCustomerInfo.ControlNumber;
    this.Highway = this.QuoteCustomerInfo.Highway;
    this.ProjectCountyName = this.QuoteCustomerInfo.CountyName;
    this.ProductLineName = this.QuoteCustomerInfo.ProductLineName;
    this.Version = +this.QuoteCustomerInfo.Version;
    this.CustomerOfficeID = this.QuoteCustomerInfo.CustomerOfficeID;
    this.IsProjectLocked = this.QuoteCustomerInfo.IsProjectLocked;
    this.IsAwarded = this.QuoteCustomerInfo.Awarded;
    this.IsMasterQuoteAwarded = this.QuoteCustomerInfo.IsMasterQuoteAwarded;
    this.state = this.QuoteCustomerInfo.StateID;
    this.QuoteNumber = this.QuoteCustomerInfo.QuoteNumber;
    this.IsItemTab = true;
    this.ProjectID = this.QuoteCustomerInfo.ProjectID;
    this.ProductLineID = this.QuoteCustomerInfo.ProductLineID;
    //this.LostCustomer=this.LostCustomer;
    //this.ReasonLost=e.key.lostReason;

    console.log("this is tets:" + this.QuoteCustomerInfo);
    this.projectService.GetLostCustomers(this.QuoteCustomerInfo.QuoteID).subscribe(data => {
      this.GetallLostCustomer = data;
      this.LostCustomer = this.GetallLostCustomer.LostCustomer;
      $('#lostReason textarea').val(this.GetallLostCustomer.ReasonLost);
      $('#addItemsInputField1').val(this.GetallLostCustomer.CustomerName);

      this.ReasonLost = this.GetallLostCustomer.ReasonLost;

      console.log('data read sundeep')
    },
      err => {
        console.log('Customer Quote data fetch failed');
      });
    this.IsQtCstBtnDisabled = true;
  }

  CloseCustomerPopUpForLostJob() {
    this.EditlostReason = "";
    $('#lostReason').val('');
    $('#lostReasonCust input').val(''),
      $('#lostReason textarea').val(''),
      this.QuoteCustomerPopupLostVisible = false;
    console.log("This is Test");

  }

  UpdateLostJob() {
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    console.log($('#lostReasonCust input').val());
    if (this.LostCustomer > 0 && $('#lostReason textarea').val()) {
      var LostJobQuote = {
        QuoteID: this.QuoteID,//e.QuoteID,  

        LostCustomer: this.LostCustomer,
        ReasonLost: $('#lostReason textarea').val(),
        Active: true,
        CreatedBy: this.userProfile.sub,
        CreatedDate: $('#today').val(),
      }
      this.projectService.LostJobUpdate(LostJobQuote).subscribe(data => {
        if (data) {
          console.log("sample");
          notify('Lost Job details has been saved successfully.', 'success', 2000);
          this.GetQuoteCustomerData(this.QuoteID, 0);
          this.QuoteCustomerPopupLostVisible = false;
          //location.reload();
         
          console.log("sample-----------");
        }
      }, err => {
        notify('Exception occured.', 'error', 2000);
      });
    } else {
      notify('Customer and Reason are required fields', 'error', 2000);
    }

  }
  Searchcust(e) {
    if (e.length == 3 || e.length > 3) {
      console.log($('#lostReasonCust').val());
      this.FilteredCustomerList = this.CustomerList;
    }
  }


  GetAllCustomers1() {
    this.CustomerList = [];
    this.FilteredCustomerList = [];
    var SearchParam = '';
    SearchParam = $('#addItemsInputField1').val().toString();
    if (SearchParam.length > 2) {
      this.projectService.GetCustomers(SearchParam).subscribe(data => {
        this.CustomerList = data;
        this.FilteredCustomerList = this.CustomerList;
        console.log(data);
      }, err => {
        console.log('Get Customers data failed..');
      });
    } else {
      this.CustomerList = [];
      this.FilteredCustomerList = [];
    }
  }

  SelectCust(e) {
    console.log(e);
    this.LostCustomer = e.CustomerID;
    $('#addItemsInputField1').val(e.Name);
    this.flag = false;
    this.CustomerList = [];
    this.FilteredCustomerList = [];
  }

  CloseMatAjax1(e) {
    if (e.target.classList.contains('serachItems')) {
      this.flag = true;
    }
    else {
      this.flag = false;
      this.CustomerList = [];
      this.FilteredCustomerList = [];
    }

  }
}




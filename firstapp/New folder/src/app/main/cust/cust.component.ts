import { Component, OnInit, NgModule, ViewChild } from '@angular/core';
import { DxDataGridComponent } from "devextreme-angular";
import { DxSelectBoxModule, DxTextBoxModule, DxTemplateModule, DxAutocompleteModule, DxTabPanelModule } from 'devextreme-angular';
import { MetadataService } from "../../services/metadata/metadata.service";
import { Customer, CustomerDivisionMapping, CustOfficePrdLineMapping, customercontact, GetCustomerDivisions, CustomerDivisionMappingSP, CustomerType, Country, CustomerOffices, CustomerOfficeContacts, ContactType, CustomerEmailHistory, CustomerEmail } from "../../../models/customers";
import notify from 'devextreme/ui/notify';
import { ProductLines } from '../../../models/ProductLines';
import { States, County, EmailProposalContacts } from '../../../models/Project';
import { UserService } from '../../services/user/user.service';
import { Division } from '../../../models/division';
import { User } from '../../../models/User';
import { Role, Permissions, UserPermissions } from '../../../models/Role';
import { AuthenticationService } from "../../services/auth/authentication.service";
import { ProjectService } from '../../services/project/project.service';

import { DxDataGridModule } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import 'rxjs/add/operator/toPromise';
import { Http, HttpModule } from '@angular/http';
import { EndPointsConfig } from "../../../models/endpointsconfig";
import DataSource from 'devextreme/data/data_source';
import ArrayStore from 'devextreme/data/array_store';
import 'devextreme/integration/jquery';
@Component({
  selector: 'app-cust',
  templateUrl: './cust.component.html',
  styleUrls: ['./cust.component.css']
})
export class custComponent implements OnInit {
  EmailIds: string = "";
  CCIds: string = "";
  SelectedUnlockedQuoteIds: string = "";
  UnlockedQuotesList: CustomerEmail[] = [];
  MasterQuoteCount: number = 0
  CustomerQuoteCount: number = 0;
  UnlockedQuoteCount: number = 0;
  LockedQuoteCount: number = 0;
  UserPermissionsList: UserPermissions;
  @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
  private EmailHistoryList: CustomerEmailHistory[] = [];
  private EmailList: CustomerEmail[] = [];
  private Emails: CustomerEmail[] = [];
  PrimaryContactDropdown: boolean = false;
  myPrimaryContact: boolean = false;
  private CustomerCountryCountList: Country[] = [];
  EmailPopupVisible: boolean = false;
  SendMailbtn: boolean = false;
  CorporateOffice: boolean = false;
  CustomerID: number;
  IsEmailTab: boolean = false;
  IsUnlockedQuoteTab: boolean = false;
  ProjectID: number;
  QuoteID: number;
  EmailSubject: string;
  EmailBody: string;
  IsHistoryTab: boolean = false;
  ContactID: number;
  MapCustomerID: number;
  CustomerOfficeID: number;
  CustomerOfficeContactMapID: number;
  private CustomersList: Customer[] = [];
  private customercontactList: customercontact[] = [];
  private CustomerOfficesList: CustomerOffices[] = [];
  private CustomerOfficeContactsList: CustomerOfficeContacts[] = [];
  CustProductLineByStaffDrodownList: CustomerOfficeContacts[] = [];
  private CustomerDivisionMappingList: CustomerDivisionMapping[] = [];
  private CustomerToDivisionMappingList: CustomerDivisionMapping[] = [];
  GetMappedDivisions: GetCustomerDivisions[] = [];
  PostMappedDivisions: CustomerDivisionMappingSP[] = [];
  DivisionMapList: Division[] = [];
  OfficeStaffs: customercontact[] = [];
  private ProductLinesList: ProductLines[] = [];
  cust: Customer[] = [];
  Name: string;
  CustName: string;
  StateIDs: string;
  Status: any;
  CountyIDs: number;
  DivisionIDs: string = " ";
  selDivisionList: any;
  CustDvs: string = "";
  CustofficeDvs: string = "";
  loadingVisible = false;
  IsPopupDisabled: boolean = false;
  IsCancelBtnDisabled: boolean = false;
  saveSuccess: boolean = false;
  message: string;
  CustDivisionListDataSource: any;
  CustOfficeContactListDataSource: any;
  EmailListDataSource: any;
  EmailTabSelectedIndex: number;
  custReportLoading: boolean = false;
  CustomerContactPopupVisible: boolean = false;
  CustomerOfficePopupVisible: boolean = false;
  CustomerOfficeContactsPopupVisible: boolean = false;
  @ViewChild("CustDivisionListGrid") itmGrid: DxDataGridComponent;
  @ViewChild(DxDataGridComponent) dxDataGrid: DxDataGridComponent;
  @ViewChild("CustOfficeListGrid") officeGrid: DxDataGridComponent;
  IsDisabled: boolean = true;
  IsLockAllDisabled: boolean = true;
  IscustDisabled: boolean = true;
  isprimarycontact: boolean = true;
  Customersearchdata: any;
  ContactType: string;
  QuoteEmailsByComma: string = "";
  CustDivisionByComma: string = "";
  CustProductLineByComma: string = "";
  CustProductLineByCommaForContact: string = "";
  PrimaryContact: boolean;
  CustomerdataSource: any = {};
  private CustomerState: States[] = [];
  private ContactTypeList: ContactType[] = [];
  private CustomerTypeList: CustomerType[] = [];
  private CustomerCounty: County[] = [];
  private selectedRows: number[];
  CustDivisionMapID: number;
  CustomersLoading: boolean = false;
  checkBoxesMode: any;
  CustomerToDivisionPopupVisible: boolean = false;
  CustOfficePrimaryContact: number = 0;
  private SearchState: string;
  private SearchCustomerType: string;
  private SearchCounty: number = 0;
  userProfile: any;
  pagelength: number = 10;
  ProjectEmailsExists: boolean = false;
  SelectedQuoteIds: string = "";
  IsEmailSaveDisabled: boolean = true;
  selectedQuoteRows: number[];
  CustomerContactDataSource: any;
  CountyByStateDataSource: any;
  CustomerOfficePrdLineMapPopupVisible: boolean = false;
  CustomerOfficeProductLineList: CustOfficePrdLineMapping[] = [];
  ProductLineByNotExistingContactList: CustOfficePrdLineMapping[] = [];
  CustomerMappingPrdt: CustOfficePrdLineMapping[] = [];
  ProductLineID: number = 0;
  DivisionID: number = 0;
  GetProdLinesByDiv: ProductLines[] = [];
  GetProdLinesByOffice: ProductLines[] = [];
  UnMappedProductLines: ProductLines[] = [];
  GetDivisionList: CustomerDivisionMapping[] = [];
  MapCustOfficeID: number;
  MapContactID: number;
  IsPrimaryContact: boolean = false;
  IsSpecifier: boolean = false;
  pattern: any = /^\(\d{3}\)\ \d{3}-\d{4}$/i;
  rules: Object;
  QuoteEmailList: any = [];
  emails: any = [];
  UnMappedPrdLineByDivision: DataSource;
  UnMappedPrdLineByDivisionForContact: DataSource;
  UnMappedPrdLineForContact: DataSource;
  EmailTabsDataSource: any[] = [
    {
      "id": 1,
      "text": "Quote Status",
    },
    {
      "id": 2,
      "text": "Mailing List",
    },
    {
      "id": 3,
      "text": "Mailing History"
    }];
  onToolbarPreparing(e) {
    var toolbarItems = e.toolbarOptions.items;

    // Modifies an existing item
    toolbarItems.forEach((item) => {
      if (item.name == "addRowButton") {
        item.options.location = "before";
        item.options.text = "Add Customer";
        item.options.hint = "Add Customer";
        item.options.icon = "";
        item.showText = "always";
      }
    });

    e.toolbarOptions.items.unshift({
      location: 'after',
      widget: 'dxButton',
      options: {
        hint: 'Export',
        icon: 'export',
        onClick: () => {
          var metaSer: MetadataService;
          this.metaService.ExportCustomerReport().subscribe(data => {
            if (data) {
              window.open(data, "_blank");
            } else {
              notify('Failed to export Customer Report Data.', 'error', 2000);
            }
          },
            err => {
              console.log('Customer Report Data Fetch Failed..');
            });
        }
      },
    });
  }
  onRowExpanding(e) {
    e.component.collapseAll(-1);
  }
  onToolbarPreparingContact(e) {
    var toolbarItems = e.toolbarOptions.items;
    // Modifies an existing item
    toolbarItems.forEach((item) => {
      if (item.name == "addRowButton") {
        item.options.text = "Add Staff";
        item.options.hint = "Add Staff";
        item.options.icon = "";
        item.showText = "always";
      }
    });
  }
  onToolbarPreparingOffice(e) {
    var toolbarItems = e.toolbarOptions.items;
    // Modifies an existing item
    toolbarItems.forEach((item) => {
      if (item.name == "addRowButton") {
        item.options.text = "Add Customer Office";
        item.options.hint = "Add Customer Office";
        item.options.icon = "";
        item.showText = "always";
      }
    });
  }
  constructor(public http: Http, private metaService: MetadataService, private userService: UserService, public auth: AuthenticationService, private projectService: ProjectService) {
    this.UserPermissionsList = JSON.parse(localStorage.getItem('rolespermissionslist'));
    //this.userProfile = this.auth.useProfile;
    this.checkBoxesMode = "always";
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    this.rules = { 'X': /[02-9]/ };
    /**Customer Displaydata */
    //this.getMyCustomers();
    this.CustomerdataSource.store = new CustomStore({
      load: function (loadOptions: any) {
        this.pagelength = loadOptions.take;
        console.log(loadOptions);
        var params = '?';
        var customerName = "";
        if($('#CustName').val().toString().indexOf('_') == -1)
        customerName = $('#CustName').val().toString().replace("&","%26");
        params += 'skip=' + loadOptions.skip || 0;
        params += '&take=' + loadOptions.take || 12;
        params += '&Name=' + customerName;
        //params += '&Name=' + $('#CustName').val();
        params += '&State=' + $('#hidStateID').val();
        params += '&CountyID=' + $('#hidCountyID').val();
        params += '&CustomerTypeID=' + $('#hidCustomerType').val();

        if (loadOptions.sort) {
          params += '&orderby=' + loadOptions.sort[0].selector;
          if (loadOptions.sort[0].desc) {
            params += ' desc';
          }
        }
        return http.get(EndPointsConfig.HostName + EndPointsConfig.CustomersEndPoint.replace('/', '') + params)
          .toPromise()
          .then(response => {
            var json = response.json();
            return {
              data: json.items,
              totalCount: json.totalCount
            }
          })
          .catch(error => { throw 'Data Loading Error' });
      }, remove(key) {
        console.log(key);
        return http.delete(EndPointsConfig.HostName + EndPointsConfig.CustomersEndPoint + key.CustomerID)
          .toPromise()
          .then(response => {
            console.log(response);
            console.log(response.text());
            var msg = response.text().replace('[', '').replace(']', '').replace('"', '');
            if (msg.length > 0)
              notify(msg, 'error', 6000);
            else
              notify('Company deleted successfully.', 'success', 3000);
            return null;
          })
          .catch(error => { throw 'Data Loading Error' });
      },
      insert(value: Customer) {
        console.log(value);
        this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
        value.CreatedBy = this.userProfile.sub;
        return http.post(EndPointsConfig.HostName + EndPointsConfig.CustomersEndPoint, value)
          .toPromise()
          .then(response => {
            //var json = response.json();
            var msg = response.text().replace('"', '').replace('"', '');
            console.log(msg);
            if (msg == "NO")
              notify("This Company Name already exists. Please enter different Name.", 'error', 6000);
            else
              notify('Company updated successfully.', 'success', 3000);
            return null;
          })
          .catch(error => { throw 'Data Loading Error' });
      }, update(key, value: Customer) {
        if (value.Name)
          key.Name = value.Name; 
        if(value.ShortName)
          key.ShortName = value.ShortName; 
        else if(value.ShortName == "")
            key.ShortName = null;
        else
            key.ShortName = key.ShortName;

        if(value.ExternalReferenceNo)
            key.ExternalReferenceNo = value.ExternalReferenceNo; 
        else if(value.ExternalReferenceNo == "")
              key.ExternalReferenceNo = null;
        else
              key.ExternalReferenceNo = key.ExternalReferenceNo;
          
        // if(value.ExternalReferenceNo)
        //   if(value.ExternalReferenceNo.length == 0)
        //     key.ExternalReferenceNo = null;
        // else if (value.ExternalReferenceNo)
        //   key.ExternalReferenceNo = value.ExternalReferenceNo;
        if (value.CustomerTypeID)
          key.CustomerTypeID = value.CustomerTypeID;

        this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
        key.LastModifiedBy = this.userProfile.sub;
        console.log(key);
        return http.put(EndPointsConfig.HostName + EndPointsConfig.CustomersEndPoint + key.CustomerID, key)
          .toPromise()
          .then(response => {
            //var json = response.json();
            var msg = response.text().replace('"', '').replace('"', '');
            console.log(msg);
            if (msg == "NO")
              notify("This Company Name already exists. Please enter different Name.", 'error', 6000);
            else
              notify('Company saved successfully.', 'success', 3000);
            return null;
          })
          .catch(error => { throw 'Data Loading Error' });
      }
    });
    this.getFilteredCunties = this.getFilteredCunties.bind(this);
    this.getFilteredProductLines = this.getFilteredProductLines.bind(this);
    //Get ContactType
    this.metaService.GetContactTypes().subscribe(data => {
      this.ContactTypeList = data;
    },
      err => {
        console.log('Customer Customer Type Data Fetch Failed..');
      });
    //Get CustomerType
    this.metaService.GetCustomerType().subscribe(data => {
      this.CustomerTypeList = data;
    },
      err => {
        console.log('Customer Customer Type Data Fetch Failed..');
      });
    //Get All contacts
    this.metaService.GetAllContacts().subscribe(data => {
      this.customercontactList = data;

    },
      err => {
        notify('Customer Contacts data fetch failed.', 'Error', 2000);
      });
    //Get Product Lines
    this.metaService.GetProductLines().subscribe(data => {
      this.ProductLinesList = data;
    },
      err => {
        notify('Product Lines data fetch failed.', 'Error', 2000);
      });
    //Get Country
    this.metaService.GetCountry().subscribe(data => {
      this.CustomerCountryCountList = data;
      this.CustomerCountryCountList.sort(function (a, b) { return (a.Name > b.Name) ? 1 : ((b.Name > a.Name) ? -1 : 0); });
    },
      err => {
        console.log('Customer county Data Fetch Failed..');
      });

    // //Get states and counties
    this.metaService.GetStates().subscribe(data => {
      this.CustomerState = data;
    },
      err => {
        console.log('Customer state Data Fetch Failed..');
      });
    this.metaService.GetCounty().subscribe(data => {
      this.CustomerCounty = data;
    },
      err => {
        console.log('Customer county Data Fetch Failed..');
      });

  }

  getFilteredCunties(options) {
    return {
      store: this.CustomerCounty,
      filter: options.data ? ["StateID", "=", options.data.StateID] : null
    };
  }

  setStateValue(rowData: any, value: any): void {
    rowData.CountyID = null;
    (<any>this).defaultSetCellValue(rowData, value);
  }
  setdivisionValue(rowData: any, value: any): void {
    rowData.ProductLineID = null;
    (<any>this).defaultSetCellValue(rowData, value);
  }
  ngOnInit() {

  }
  /** Start Contact */
  getMyCustomers() {
    this.metaService.GetAllCustomers().subscribe(data => {
      this.CustomersList = data;
    },
      err => {
        console.log("Customers data fetch failed.");
      });
  }
  /** Add Contact */
  AddNewCustomer(e) {
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    this.metaService.PostCustomer(e.data.CustomerTypeID, e.data.Name, e.data.ShortName, e.data.ExternalReferenceNo, true, this.userProfile.sub, new Date(Date.now())).subscribe(data => {
      this.CustomersList = data;
      this.getMyCustomers();
      notify('Customer saved successfully.', 'success', 2000);
    }, err => {
      this.getMyCustomers();
      notify('Failed to add Customer.', 'Error', 5000);
    });
  }
  /** Edit Contact */
  EditCustomer(e) {
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    this.metaService.PutCustomer(e.key.CustomerID, e.key.CustomerTypeID, e.key.Name, e.key.ShortName, e.key.ExternalReferenceNo, e.key.Active, e.key.CreatedBy, e.key.CreatedDate, this.userProfile.sub, new Date(Date.now())).subscribe(data => {
      this.getMyCustomers();
      notify('Customer updated successfully.', 'success', 2000);
    }, err => {
      this.getMyCustomers();
      notify('Failed to update Customer.', 'Error', 5000);
    });
  }
  /** Delete Contact */
  DeleteCustomes(e: any) {
    this.metaService.DeleteCustomes(e.data.CustomerID).subscribe(data => {
      if (data.length > 0) {
        console.log(data);
        notify(data, 'error', 6000);
        this.getMyCustomers();
      }
      else {
        this.dataGrid.instance.refresh();
        notify('Customer deleted successfully.', 'success', 2000);
      }
    }, err => {
      this.getMyCustomers();
      notify('Failed to delete Customer.', 'Error', 2000);
    });
  }
  /** End Contact */


  /** Start Customer to Division Mapping */
  /* Customer to Division Mapping */
  openDivisionCustomerModal(e) {
    this.DivisionID = null;
    this.CustomerToDivisionPopupVisible = true;
    this.MapCustomerID = e.key.CustomerID;
    this.GetCustomerToDivMapping(e.key.CustomerID);
    this.GetAvailableCustDivDropdown(e.key.CustomerID);
  }
  CreateDivCustMapping() {
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    if (this.DivisionID != null) {
      var map = {
        CustomerID: this.MapCustomerID,
        DivisionIDList: this.CustDivisionByComma,
        CreatedBy: this.userProfile.sub
      };
      $('#DivisionID').css("border", "1px solid #dddddd");
      this.metaService.CreatecustDivMapping(map).subscribe(data => {
        this.GetCustomerToDivMapping(this.MapCustomerID);
        this.GetAvailableCustDivDropdown(this.MapCustomerID);
        this.DivisionID = null;
        notify('Division has been mapped with Customer.', 'success', 5000);
      },
        err => {
          console.log('Division data fetch failed');
        });
    } else {
      $('#DivisionID').css("border", "1px solid red");
      notify('Please select Division(s).', 'Error', 5000);
    }
  }
  CloseCustToDivPopup() {
    this.CustomerToDivisionPopupVisible = false;
    this.DivisionID = null;
    $('#DivisionID').css("border", "1px solid #dddddd");
  }
  GetCustomerToDivMapping(CustomerID) {
    this.metaService.GetCustomertoDivMapping(CustomerID).subscribe(data => {
      this.CustomerDivisionMappingList = data;
    },
      err => {
        console.log('Customer To Division Mapped data fetch failed');
      });
  }
  GetAvailableCustDivDropdown(CustomerID) {
    this.metaService.GetCustDivMapping(CustomerID).subscribe(data => {
      this.CustDivisionByComma == "";
      this.DivisionMapList = data;
      this.DivisionMapList.sort(function (a, b) { return (a.Name > b.Name) ? 1 : ((b.Name > a.Name) ? -1 : 0); });
      this.CustDivisionByComma == "";
      this.QuoteEmailList = [];
      this.DivisionMapList = data;
      if (this.DivisionMapList.length > 0) {
        var emails = this.DivisionMapList[0].Name.split(';');
        emails.forEach(element => {
          this.QuoteEmailList.push(element);
          if (this.CustDivisionByComma == "")
            this.CustDivisionByComma = element;
          else
            this.CustDivisionByComma = this.CustDivisionByComma + ";" + element;
        });
      }

    },
      err => {
        notify('Customer Divisions Data Fetch Failed.', 'Error', 5000);
      });
  }
  GetCustDivisionBycommaList(e) {
    this.CustDivisionByComma = "";
    e.value.forEach(element => {
      if (this.CustDivisionByComma == "")
        this.CustDivisionByComma = element;
      else
        this.CustDivisionByComma = this.CustDivisionByComma + "," + element;
    });
    if (this.CustDivisionByComma == "")
      this.IsDisabled = true;
    else
      this.IsDisabled = false;
  }
  DeleteCusttoDivMap(e) {
    this.metaService.DeleteDivCustMapping(e.key.CustDivisionMapID).subscribe(data => {
      if (data == "OK") {
        notify('Customer to Division mapping has been deleted successfully.', 'success', 2000);
      } else {
        notify(data, 'error', 6000);
      }
      this.GetCustomerToDivMapping(this.MapCustomerID);
      this.GetAvailableCustDivDropdown(this.MapCustomerID);
    },
      err => {
        notify('Exception occured while deleting.', 'error', 6000);
      });
  }
  /** End  Customer to Division Mapping*/

  /** Start Staff */
  /** Open Customer Customer Popup */
  openCustomerContactModal(e) {
    this.CustomerID = e.key.CustomerID;
    this.CustomerContactPopupVisible = true;
    this.dxDataGrid.instance.refresh();
    this.IsDisabled = true;
    this.LoadAllContact();

  }
  LoadAllContact() {
    this.metaService.GetCustContacts(this.CustomerID).subscribe(data => {
      this.customercontactList = data;
    },
      err => {
        notify('Staff data fetch failed.', 'Error', 5000);
      });
  }
  /** Add Staff */
  AddNewCustomerContact(e) {
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    this.metaService.PostCustomerContacts(this.CustomerID, e.data.FirstName, e.data.LastName, e.data.ContactType, e.data.Position, e.data.Email, e.data.Cell, e.data.OfficePhone, e.data.OtherPhone, e.data.Fax,
      true, this.userProfile.sub, new Date(Date.now())).subscribe(data => {
        if (data) {
          console.log(data);
          notify('Staff information saved successfully.', 'success', 2000);
          this.LoadAllContact();
        }
        else {
          this.LoadAllContact();
          notify('This Email already exists for this Customer. Please enter different Email.', 'error', 6000);
        }
      }, err => {
        notify('Failed to save Staff.', 'Error', 5000);
      });
  }
  /** Edit Staff */
  EditCustomercontact(e) {
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    this.metaService.PutCustomerContact(e.key.ContactID, this.CustomerID, e.key.FirstName, e.key.LastName, e.key.ContactType, e.key.Position, e.key.Email, e.key.Cell, e.key.OfficePhone, e.key.OtherPhone, e.key.Fax,
      e.key.Active, e.key.CreatedBy, e.key.CreatedDate, this.userProfile.sub, new Date(Date.now())).subscribe(data => {
        if (data) {
          notify('Staff information updated successfully.', 'success', 2000);
          this.LoadAllContact();
        }
        else {
          this.LoadAllContact();
          notify('Email address already exists.', 'error', 6000);
        }
      }, err => {
        this.LoadAllContact();
        notify('Failed to update Staff.', 'Error', 5000);
      });
  }
  logEvent(e: any) {
    console.log(e);
  }
  /** Delete Staff */
  DeleteCustomerContacts(e: any) {
    this.metaService.DeleteCustomerContacts(e.data.ContactID).subscribe(data => {
      // if (data.length > 0) {
      //   notify(data, 'error', 6000);
      //   this.LoadAllContact();
      // }
      // else {
      this.LoadAllContact();
      notify('Staff information deleted successfully.', 'success', 2000);
      //}
    }, err => {
      this.LoadAllContact();
      notify('Failed to delete Staff.', 'Error', 2000);
    });
  }
  AfterCustomerContactDelete() {
    console.log("DELETE SUCCESS");
  }
  CloseCustcontactPopup() {
    this.CustomerContactPopupVisible = false;
  }
  /** End  Staff */

  /** Start Office */
  /** Open Customer Office Popup */
  CustomerOfficeModal(e) {
    this.CustomerID = e.key.CustomerID;
    this.CustomerOfficePopupVisible = true;
    this.dxDataGrid.instance.refresh();
    this.IsDisabled = true;
    this.LoadCustomerOffice();
  }
  LoadCustomerOffice() {
    this.metaService.GetAllCustomerOffices().subscribe(data => {
      this.CustomerOfficesList = data.filter(m => m.CustomerID === this.CustomerID);
    },
      err => {
        notify('Customer Office data fetch failed.', 'Error', 5000);
      });
  }
  addnewCustomerOfc(e) {
    this.CustomerID = e.data.CustomerID;
    this.CorporateOffice = e.data.CustomerOffice.CorporateOffice;
    e.data.CountryID = "CAN";
  }
  NewRowAddStart(e) {
    this.CustomerOfficeContactMapID = e.data.CustomerOfficeContactMapID;
  }
  InitNewCustomerOffice(e) {
    e.data.CountryID = this.CustomerCountryCountList[2].CountryID;

  }
  initNewRow(e) {
    e.data.CorporateOffice = false;
  }

  OnCustomerOfficeEditStart(e) {
    if (e.parentType == "dataRow" && e.dataField == "CountyID") {
      e.editorOptions.allowClearing = true;
    }
  }
  /** Add Office */
  AddNewCustomerOffice(e) {
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    this.CustomerOfficePopupVisible = true;
    this.CorporateOffice = e.data.CorporateOffice;
    this.metaService.PostCustomerOffice(this.CustomerID, this.CorporateOffice, e.data.Address, e.data.Address1, e.data.City, e.data.StateID, e.data.CountryID, e.data.CountyID, e.data.ZIPCode, e.data.Fax, e.data.OfficePhone, e.data.Cell, e.data.OfficeExternalReferenceNo,
      true, this.userProfile.sub, new Date(Date.now())).subscribe(data => {
        this.dataGrid.instance.refresh();
        //this.dataGrid.instance.collapseAll(-1);
        notify('Customer office saved successfully.', 'success', 2000);
      }, err => {
        this.getMyCustomers();
        notify('Failed to save Customer office.', 'Error', 5000);
      });

  }
  /** Edit Customer Office*/
  EditCustomerOffice(e) {
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    this.CustomerID = e.key.CustomerID;
    this.metaService.PutCustomerOffice(e.key.CustomerOfficeID, this.CustomerID, e.key.CorporateOffice, e.key.Address, e.key.Address1, e.key.City, e.key.StateID, e.key.CountryID, e.key.CountyID, e.key.ZIPCode, e.key.Fax, e.key.OfficePhone, e.key.Cell, e.key.OfficeExternalReferenceNo,
      true, e.key.CreatedBy, e.key.CreatedDate, this.userProfile.sub, new Date(Date.now())).subscribe(data => {
        this.CustomerOfficesList = data;
        this.dataGrid.instance.refresh();
        notify('Customer Office updated successfully.', 'success', 2000);
      }, err => {
        this.dataGrid.instance.refresh();
        notify('Failed to update Customer Office.', 'Error', 5000);
      });
  }
  /** Delete Office */
  DeleteCustomerOffice(e: any) {
    this.metaService.DeleteCustomerOffice(e.data.CustomerOfficeID).subscribe(data => {
      if (data.length > 0) {
        notify(data, 'error', 6000);
        this.dataGrid.instance.refresh();
      }
      else {
        this.dataGrid.instance.refresh();
        notify('Customer Office deleted successfully.', 'success', 2000);
      }
    }, err => {
      notify('Failed to delete Customer Office.', 'Error', 5000);
    });
  }
  syncTreeViewSelection() {
    console.log();
  }
  CloseCustOfficePopup() {
    $('#searchStaff').css("border", "1px solid #dddddd");
    $('#ProductLineID').css("border", "1px solid #dddddd");
    this.CustomerOfficeContactsPopupVisible = false;
    this.IsPrimaryContact = false;
    this.IsSpecifier = false;
    this.ContactID = 0;
    this.ProductLineID = 0;
  }
  /** End Office */

  /** Start Office Staff */
  /** Open COffice Staff Mapping Popup */
  openCustomerOfficecontactMappingModal(e) {
    this.GetCustomerPrdMapping(e.key.CustomerOfficeID);
    this.CustomerOfficeContactsPopupVisible = true;
    this.CustomerOfficeID = e.key.CustomerOfficeID;
    this.CustomerID = e.key.CustomerID;
    this.IsDisabled = true;
    this.GetMappedOfficeContacts();
    this.GetAvailableCustContactDropdown(e.key.CustomerOfficeID);
    this.GetMappedDivisionsByCust(e);
  }
  /** Get Mapped Office Staff */
  GetMappedOfficeContacts() {
    this.metaService.GetCustomerOfficeContactsByID(this.CustomerOfficeID).subscribe(data => {
      this.CustomerOfficeContactsList = data;
    },
      err => {
        notify('Customer Office Contacts data fetch failed.', 'Error', 5000);
      });
  }
  GetCustProductLineByNotExistingContact(e) {
    console.log(e);
    this.ProductLineID = 0;
    this.ContactID = e.value;
    this.GetProductLineByNotExistingCustomerList();
  }

  GetProductLineByNotExistingCustomerList() {
    this.metaService.GetProductLineByNotExistingContact(this.CustomerOfficeID, this.ContactID).subscribe(data => {
      this.ProductLineByNotExistingContactList = data;
      this.ProductLineByNotExistingContactList.sort(function (a, b) { return (a.ProductLineName > b.ProductLineName) ? 1 : ((b.ProductLineName > a.ProductLineName) ? -1 : 0); });
      this.UnMappedPrdLineForContact = new DataSource({
        store: new ArrayStore({
          data: this.ProductLineByNotExistingContactList,
          key: "ProductLineID",
        }),
        group: "DivisionName"
      });
    },
      err => {
        console.log('Product Line data fetch failed');
      });
  }
  /** Get Available Office Staff DropDown*/
  GetAvailableCustContactDropdown(CustomerOfficeID) {
    this.metaService.GetOfficeContactMapping(CustomerOfficeID).subscribe(data => {
      this.OfficeStaffs = data;
      this.OfficeStaffs.sort(function (a, b) { return (a.Name > b.Name) ? 1 : ((b.Name > a.Name) ? -1 : 0); });
    },
      err => {
        notify('Customer Divisions Data Fetch Failed.', 'Error', 5000);
      });
  }
  /** Add Office Staff */
  CreateCustomerOfficeContact() {
    if (this.ContactID != null && this.ProductLineID != null) {
      this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
      $('#searchStaff').css("border", "1px solid #dddddd");
      $('#ProductLineID').css("border", "1px solid #dddddd");
      this.metaService.PostCustomerOfficeContacts(this.CustomerOfficeID, this.ContactID, this.IsPrimaryContact, this.IsSpecifier, this.ProductLineID,
        true, this.userProfile.sub, new Date(Date.now()), this.CustProductLineByCommaForContact).subscribe(data => {
          if (data) {
            notify('Office Staff added successfully.', 'success', 2000);
            this.GetMappedOfficeContacts();
            this.GetProductLineByNotExistingCustomerList();
            this.ProductLineID = null
          }
          else {
            this.GetMappedOfficeContacts();
            notify('Product Line is already mapped to this Staff.', 'error', 6000);
          }
        }, err => {
          this.GetMappedOfficeContacts();
          notify('Please select Product Line.', 'Error', 6000);
        });
    }
    else {
      $('#ProductLineID').css("border", "1px solid red");
      $('#searchStaff').css("border", "1px solid red");
      notify('Please select Office Staff And Product Line.', 'Error', 6000);
    }
  }

  /** Edit Office Staff */
  EditCustomerOfficecontact(e) {
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    this.metaService.PutCustomerOfficeContacts(e.key.CustomerOfficeContactMapID, this.CustomerOfficeID, e.key.ContactID, e.key.PrimaryContact, e.key.Specifier, e.key.ProductLineID,
      true, e.key.CreatedBy, e.key.CreatedDate, this.userProfile.sub, new Date(Date.now())).subscribe(data => {
        if (data) {
          notify('Customer Office Staff updated successfully.', 'success', 2000);
          this.GetMappedOfficeContacts();
        }
        else {
          this.GetMappedOfficeContacts();
          notify('This ProductLine already Mapped to this Staff. Please select different one.', 'error', 6000);
        }
      }, err => {
        this.GetMappedOfficeContacts();
        notify('Failed to save Office Staff.', 'Error', 2000);
      });
  }
  /** Delete Office Staff */
  CustomerOfficeContactDelete(e: any) {
    this.metaService.DeleteCustomerOfficeContacts(e.data.CustomerOfficeContactMapID).subscribe(data => {
      notify('Customer Office Staff deleted successfully.', 'success', 2000);
    }, err => {
      notify('Failed to delete Customer Office Staff.', 'Error', 5000);
    });
  }
  // GetCustProductLineByStaffDrodown(CustomerOfficeID){
  //   this.metaService.GetCustProductLineByStaffDrodown(CustomerOfficeID).subscribe(data => {
  //     this.CustProductLineByStaffDrodownList = data;
  //   },
  //     err => {
  //       notify('Customer Divisions Data Fetch Failed.', 'Error', 5000);
  //     }); 
  // }
  /** End Office Staff */


  /** Start office Prod Line Mapping */
  /* Cust office Prod Line Mapping */
  openCustomerOfficePrdLineMappingModal(e) {
    this.ProductLineID = 0;
    this.DivisionID = null;
    this.MapCustOfficeID = e.key.CustomerOfficeID;
    this.GetCustmappedDivisions(e.key.CustomerID);
    this.GetUnmappedProdLines(e.key.CustomerOfficeID);
    this.GetCustomerPrdMapping(e.key.CustomerOfficeID);
    this.CustomerOfficePrdLineMapPopupVisible = true;
  }

  GetCustomerPrdMapping(CustomerOfficeID) {
    this.metaService.GetCustomerPrdLineMapping(CustomerOfficeID).subscribe(data => {
      this.CustomerOfficeProductLineList = data;
      this.CustomerMappingPrdt = this.CustomerOfficeProductLineList.filter(m => m.CustomerOfficeID === this.CustomerOfficeID);
      this.UnMappedPrdLineByDivisionForContact = new DataSource({
        store: new ArrayStore({
          data: this.CustomerMappingPrdt,
          key: "ProductLineID",
        }),
        group: "DivisionName"
      });
    },
      err => {
        console.log('Product Line data fetch failed');
      });
  }
  // GetCustProductLineBycommaListForContact(e) {
  //   //this.QuoteEmailsByComma = this.QuoteEmailsByComma + ";" + e.value;
  //   this.CustProductLineByCommaForContact = "";
  //   e.value.forEach(element => {
  //     if (this.CustProductLineByCommaForContact == "")
  //       this.CustProductLineByCommaForContact = element;
  //     else
  //       this.CustProductLineByCommaForContact = this.CustProductLineByCommaForContact + "," + element;
  //   });
  //   if (this.CustProductLineByCommaForContact == "")
  //     this.IsDisabled = true;
  //   else
  //     this.IsDisabled = false;
  // }
  CloseCustOfficePrdLinePopup() {
    this.CustomerOfficePrdLineMapPopupVisible = false;
    $('#ProductLineID').css("border", "1px solid #dddddd");
  }

  GetUnmappedProdLines(CustomerOfficeID) {
    this.metaService.GetUnMappedCustomerPrdLines(CustomerOfficeID).subscribe(data => {
      this.CustProductLineByComma == "";
      this.UnMappedProductLines = data;
      this.GetProdLinesByDiv = this.UnMappedProductLines;
      this.GetProdLinesByDiv.sort(function (a, b) { return (a.Name > b.Name) ? 1 : ((b.Name > a.Name) ? -1 : 0); });
      this.UnMappedProductLines = data;
      if (this.UnMappedProductLines.length > 0) {
        var emails = this.UnMappedProductLines[0].Name.split(';');
        emails.forEach(element => {
          this.QuoteEmailList.push(element);
          if (this.CustProductLineByComma == "")
            this.CustProductLineByComma = element;
          else
            this.CustProductLineByComma = this.CustProductLineByComma + ";" + element;
        });
      }
      this.UnMappedPrdLineByDivision = new DataSource({
        store: new ArrayStore({
          data: this.GetProdLinesByDiv,
          key: "ProductLineID",
        }),
        group: "DivisionName"
      });
      //this.UnMappedPrdLineByDivision.sort(function (a, b) { return (a.Name > b.Name) ? 1 : ((b.Name > a.Name) ? -1 : 0); });


    },
      err => {
        console.log('Email data fetch failed');
      });
  }
  CreateCustPrdLineMapping() {
    if (this.ProductLineID != null) {
      var map = {
        CustomerOfficeID: this.MapCustOfficeID,
        ProductLineIDList: this.CustProductLineByComma,
        CreatedBy: this.userProfile.sub
      };
      $('#ProductLineID').css("border", "1px solid #dddddd");
      this.metaService.CreateCustomerPrdLineMapping(map).subscribe(data => {
        this.GetCustomerPrdMapping(this.MapCustOfficeID);
        this.GetUnmappedProdLines(this.MapCustOfficeID);
        this.ProductLineID = null;
        notify('Product Line has been mapped with Customer office.', 'success', 5000);
      },
        err => {
          console.log('Email data fetch failed');
        });
    } else {
      $('#ProductLineID').css("border", "1px solid red");
      notify('Please select product line(s).', 'Error', 5000);
    }
  }
  GetCustProductLineBycommaList(e) {
    this.CustProductLineByComma = "";
    e.value.forEach(element => {
      if (this.CustProductLineByComma == "")
        this.CustProductLineByComma = element;
      else
        this.CustProductLineByComma = this.CustProductLineByComma + "," + element;
    });
    if (this.CustProductLineByComma == "")
      this.IsDisabled = true;
    else
      this.IsDisabled = false;
  }
  DivisionChangeEvent(e) {
    this.GetProdLinesByDiv = this.UnMappedProductLines.filter(m => m.DivisionID === e.value);
    this.GetProdLinesByDiv.sort(function (a, b) { return (a.Name > b.Name) ? 1 : ((b.Name > a.Name) ? -1 : 0); });
  }
  GetCustmappedDivisions(CustomerID) {
    this.metaService.GetCustomerDivMapping(CustomerID).subscribe(data => {
      this.CustomerDivisionMappingList = data;
      this.GetDivisionList = this.CustomerDivisionMappingList.filter(m => m.CustomerID === CustomerID);
      this.GetDivisionList.sort(function (a, b) { return (a.DivisionName > b.DivisionName) ? 1 : ((b.DivisionName > a.DivisionName) ? -1 : 0); });
    },
      err => {
        notify('Customer Divisions Data Fetch Failed.', 'Error', 5000);
      });
  }

  DeleteCustPrdLineMap(e) {
    this.metaService.DeleteCustomerPrdLineMapping(e.key.CustOfficePrdLineMappingID).subscribe(data => {
      if (data == "OK") {
        notify('Customer Office product line mapping has been deleted successfully.', 'success', 2000);
      } else {
        notify(data, 'error', 6000);
      }
      this.GetCustomerPrdMapping(this.MapCustOfficeID);
      this.GetUnmappedProdLines(this.MapCustOfficeID);
    },
      err => {
        notify('Exception occured while deleting.', 'error', 6000);
      });
  }
  /** End office Prod Line Mapping */


  /** Start Email */
  GetMappedEmails(e) {
    this.CustomerOfficeID = e.data.CustomerOfficeID;
    this.ContactID = e.data.ContactID;
  }
  openCustomerOfficeEmail(e) {
    this.IsDisabled = true;
    this.EmailTabSelectedIndex = 0;
    this.IsEmailTab = false;
    this.IsHistoryTab = false;
    this.IsUnlockedQuoteTab = true;
    this.CustomerOfficeID = e;
    //GET EMAIL 
    this.GetMailingList();
  }

  GetMailingList() {
    this.QuoteEmailsByComma = "";
    this.QuoteEmailList = [];
    this.metaService.GetEmail(this.CustomerOfficeID).subscribe(data => {
      this.MasterQuoteCount = data.filter(m => m.IsMasterQuote === true).length;
      this.CustomerQuoteCount = data.filter(m => m.IsMasterQuote === false).length;
      //this.LockedQuoteCount = data.filter(m=>m.Locked === true).map(n => n.QuoteID).length;
      this.UnlockedQuoteCount = data.filter(m => m.Locked === false && m.IsMasterQuote === false && m.Processed == false).map(n => n.QuoteID).length;
      this.UnlockedQuotesList = data.filter(m => m.Locked === false  && m.IsMasterQuote === false && m.Processed == false);
      
      this.EmailList = data;
      this.EmailList = data.filter(m => m.Locked === true && m.IsMasterQuote === false && m.RequestID == null);
      this.LockedQuoteCount = this.EmailList.length;
      this.EmailHistoryList = data.filter(e => e.RequestID != null).sort(function (a, b) { return (a.RequestID < b.RequestID) ? 1 : ((b.RequestID < a.RequestID) ? -1 : 0); });
      //this.EmailTabSelectedIndex = 0;
      if (this.EmailList.length > 0) {
        this.ProjectEmailsExists = true;
        var emails = this.EmailList[0].ToEmails.split(';');
        emails.forEach(element => {
          if (element != "")
            this.QuoteEmailList.push(element);
          if (this.QuoteEmailsByComma == "")
            this.QuoteEmailsByComma = element;
          else
            this.QuoteEmailsByComma = this.QuoteEmailsByComma + ";" + element;
        });
        this.EmailSubject = this.EmailList[0].EmailSubject;
        this.EmailBody = this.EmailList[0].EmailBody;
        /*this.EmailList.forEach(element => {
          element.RequestedBy="";
          element.RequestedDate=null;
          element.ProcessedDate=null;
          element.ErrorMessage=null;
          element.Error=false;
          element.Processed=false;
          element.RequestID=0;
          element.LastProcessedDate=null;
          element.EmailTo="";
          //element.ToEmails="";

          this.UnlockedQuotesList.push(element);
        });
        this.UnlockedQuotesList = this.remove_duplicates(this.UnlockedQuotesList);*/
      }
      else
        this.ProjectEmailsExists = false;
      this.EmailPopupVisible = true;
    },
      err => {
        console.log('Email data fetch failed');
      });
  }
  /** Close Email */
  CloseSendEmailPopup() {
    this.EmailPopupVisible = false;
    this.IsEmailTab = false;
    this.IsHistoryTab = false;
    this.IsUnlockedQuoteTab = true;
    this.SelectedQuoteIds = null;
    this.QuoteEmailsByComma = "";
    this.QuoteEmailList = [];
  }
  GetEmailList(e) {
    this.QuoteEmailsByComma = "";
    e.value.forEach(element => {
      if (this.QuoteEmailsByComma == "")
        this.QuoteEmailsByComma = element;
      else
        this.QuoteEmailsByComma = this.QuoteEmailsByComma + ";" + element;
    });
  }
  onCellPrepared(e) {
    console.log(e);
    if (e.rowType === "data" && e.column.command === 'select' && e.data.CustomerContactName == null) {
      e.cellElement.find('.dx-select-checkbox').dxCheckBox("instance").option("disabled", true);
      e.cellElement.off();
    }
  }


  GridSelectQuoteChangedHandler(Quote) {
    if (Quote.length == 0)
      this.IsDisabled = true;
    else
      this.IsDisabled = false;
    this.SelectedQuoteIds = "";
    for (var index: number = 0; index < Quote.length; index++) {
      console.log(Quote[index].CustomerContactName)
      // if (Quote[index].CustomerContactName != "" && Quote[index].CustomerContactName != null) {
      this.SelectedQuoteIds += Quote[index].QuoteID + ",";
      // }
      // else
      //   notify('No Primary Contact.', 'Error', 2000);
    }
    console.log(this.SelectedQuoteIds)
  }
  SaveEamilReqByCustomer() {
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    var testEmail = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
    var ccMail;
    var IsValidCCEmail = true;
    if (this.CCIds.length > 0) {
      ccMail = this.CCIds.toString().replace(/\s/g, '').split(";");
      for (var i = 0; i < ccMail.length; i++) {
        if (!testEmail.test(ccMail[i].toString()))
          IsValidCCEmail = false;
      }
    }
    if (IsValidCCEmail) {
      this.SendEmail();
    }
    else if (!IsValidCCEmail) {
      $('#CustomerLevEmailCC').css("border", "1px solid red");
    }
  }
  getEmailSubject(e)
  {
    var subject = e.target.value;
    $('#CustContactEmailSubject').val(subject);
  }
  getEmailBody(e)
  {
    var subject = e.target.value;
    $('#CustContactEmailBody').val(subject);
  }
  SendEmail() {
    this.IsPopupDisabled = true;
    var Email = {
      QuoteIds: this.SelectedQuoteIds,
      RequestedBy: this.userProfile.sub,
      EmailSubject: $('#CustContactEmailSubject').val(),
      EmailBody: $('#CustContactEmailBody').val(),
      CustomerOfficeID: this.CustomerOfficeID,
      ContactID: this.ContactID,
      EmailTo: this.QuoteEmailsByComma, //this.EmailIds,
      CCTo: this.CCIds
    }
    this.metaService.PostEmail(Email).subscribe(data => {
      this.SelectedQuoteIds = "";
      if (data) {
        notify('Email request has been placed successfully.', 'success', 2000);
        this.IsPopupDisabled = true;
        this.IsDisabled = true;
        this.QuoteEmailsByComma = "";
        this.QuoteEmailList = [];
      }
      else {
        this.GetMappedOfficeContacts();
        notify('No Primary Contact.', 'error', 6000);
      }

      this.GetMailingList();
      this.IsEmailTab = true;
      this.IsHistoryTab = false;
      this.IsUnlockedQuoteTab = false;
      this.EmailIds = "";
      this.CCIds = "";
    },
      err => {
        this.IsEmailTab = true;
        this.IsHistoryTab = false;
        this.IsUnlockedQuoteTab = false;
        console.log('email sent failed');
      });
  }

  TabSelectionChanged2(e) {
    if (e.addedItems[0].id == 1) {
      this.EmailTabSelectedIndex = 0;
      this.IsEmailTab = false;
      this.IsHistoryTab = false;
      this.IsUnlockedQuoteTab = true;
    }
    else if (e.addedItems[0].id == 2) {
      this.EmailTabSelectedIndex = 1;
      this.IsEmailTab = true;
      this.IsHistoryTab = false;
      this.IsUnlockedQuoteTab = false;
    }
    else {
      this.EmailTabSelectedIndex = 2;
      this.IsEmailTab = false;
      this.IsHistoryTab = true;
      this.IsUnlockedQuoteTab = false;
    }
  }
  /** End Email */

  //GET FILTERED Customers(Search)
  GetFilterCustomers() {
    var ds = {
      requireTotalCount: true,
      searchExpr: undefined,
      searchOperation: "contains",
      searchValue: null,
      skip: 0,
      sort: null,
      take: this.pagelength,
      userData: {},
      SearchState: this.SearchState,
      SearchCustomerType: this.SearchCustomerType
    }
    this.dataGrid.instance.refresh();
  }
  /**Clear Search Parameters */
  custClearParameters() {
    this.SearchState = null;
    $('#hidStateID').val('');
    this.SearchCounty = null;
    $('#hidCountyID').val('');
    this.SearchCustomerType = null;
    $('#hidCustomerType').val('');
    this.CustName = null;
    this.selDivisionList = null;
    this.CountyIDs = null;
    this.Status = null;
    this.StateIDs = null;
    var ds = {
      requireTotalCount: true,
      searchExpr: undefined,
      searchOperation: "contains",
      searchValue: null,
      skip: 0,
      sort: null,
      take: this.pagelength,
      userData: {},
    }
    this.dataGrid.instance.refresh();
  }
  GetMappedDivisionsByCust(e) {
    this.metaService.GetCustomerDivMapping(e.key.CustomerID).subscribe(data => {
      this.CustomerToDivisionMappingList = data;
      this.CustDivisionListDataSource = {
        store: {
          type: "array",
          data: this.CustomerToDivisionMappingList,
          key: "DivisionID"
        }
      }
      this.CustomerToDivisionMappingList = this.CustomerToDivisionMappingList.filter(m => m.CustomerID === e.key.CustomerID)
      this.CustomerContactDataSource = this.customercontactList.filter(m => m.CustomerID === this.CustomerID)
      this.CustomerContactDataSource.sort(function (a, b) { return (a.FirstName > b.FirstName) ? 1 : ((b.FirstName > a.FirstName) ? -1 : 0); });
    },
      err => {
        notify('Customer Divisions Data Fetch Failed.', 'Error', 5000);
      });
  }
  getFilteredProductLines(options) {
    return {
      store: this.ProductLinesList,
      filter: options.data ? ["DivisionID", "=", options.data.DivisionID] : null
    };
  }
  AddNewCustomerOfficeContact(e) {
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    this.metaService.PostCustomerOfficeContacts(this.CustomerOfficeID, e.data.ContactID, e.data.PrimaryContact, e.data.Specifier, e.data.ProductLineID,
      true, this.userProfile.sub, new Date(Date.now()), "").subscribe(data => {
        if (data) {
          notify('Customer Office Staff added successfully.', 'success', 2000);
          this.GetMappedOfficeContacts();
        }
        else {
          this.GetMappedOfficeContacts();
          notify('This ProductLine already Mapped to this Staff. Please select different one.', 'error', 6000);
        }
      }, err => {
        this.GetMappedOfficeContacts();
        notify('Failed to add Office Staff.', 'Error', 2000);
      });
  }
  Countyselectedvalue(e) {
    $('#hidCountyID').val(e.value);
  }

  Stateselectedvalue(e) {
    this.SearchState = e.value;
    $('#hidStateID').val(e.value);
    this.CountyByStateDataSource = this.CustomerCounty.filter(e => e.StateID == this.SearchState);
  }
  CustomerTypeselectedvalue(e) {
    this.SearchCustomerType = e.value;
    $('#hidCustomerType').val(e.value);
  }
  onCellPreparedforPrimary(e: any) {
    if (e.rowType === "data" && e.column.command === 'select' && e.data.CustomerContactName == '') {
      e.cellElement.find('.dx-select-checkbox').dxCheckBox("instance").option("disabled", true);
      e.cellElement.off();
    }
  }

  UnlockedQuotesSelectionChangedHandler(Quote) {
    this.SelectedUnlockedQuoteIds = "";
    for (var index: number = 0; index < Quote.length; index++) {
      this.SelectedUnlockedQuoteIds += Quote[index].QuoteID + ",";
    }
    if (this.SelectedUnlockedQuoteIds.length > 0)
    {
      this.IsLockAllDisabled = false;
      this.IsDisabled = true;
    }
    else
    {
      this.IsLockAllDisabled = true;
      this.IsDisabled = false;
    }
      
    console.log(this.SelectedUnlockedQuoteIds);
  }

  LockUnlockedBatchQuotes() {
      this.IsPopupDisabled = true;
      this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
      var UnlockedQuotes = {
        ProjectID: 0,
        User: this.userProfile.sub,
        QuoteIds: this.SelectedUnlockedQuoteIds
      }
      this.projectService.LockAllUnlockedQuote(UnlockedQuotes).subscribe(data => {
        notify('All quotes locked successfully', 'success', 2000);
        this.SelectedUnlockedQuoteIds = "";
        this.IsDisabled = false;
        this.IsUnlockedQuoteTab = true;
        this.IsPopupDisabled = false;
        this.IsDisabled = true;
        this.GetMailingList();
      },
        err => {
          console.log('Quote Locked failed');
        });
  }
}

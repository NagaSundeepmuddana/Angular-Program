import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { EndPointsConfig } from "../../../models/endpointsconfig";
import { PrimcomService } from "../utilities/primcom.service";
import { Customer, CustomerDivisionMapping, CustOfficePrdLineMapping, customercontact, GetCustomerDivisions, CustomerEmail, CustomerEmailHistory, CustomerDivisionMappingSP, Country, CustomerOffices, ContactType, CustomerType, CustomerOfficeContacts } from "../../../models/customers";
import { Observable } from "rxjs/Observable";
import { Division } from "../../../models/division";
import { LettingDateReportData } from "../../../models/lettingdatereportdata";
import { ProjectCostingReportData } from '../../../models/projectcostingreportdata';
import { Project, States, County, ProjectItem } from '../../../models/project';
import { Notes, NotesDivisionMapping, GetNoteDivisions, NoestoProductLineMapping, NotesDivisionMappingSP } from '../../../models/Notes';
import { TermsAndCondition, TermsAndConditionsDivisionMapping } from '../../../models/TermsAndConditions';
import { Freight } from '../../../models/Freight';
import { salesRepresentative } from "../../../models/salesRepresentative";
import { ProjectCategories, ProjectSubCategories } from '../../../models/projectcatagories';
import { ProductLines, ProductlineDivisions } from '../../../models/ProductLines';
import { Items, UOM,AssemblyItems } from '../../../models/Items';
import { Assembly, AssemblyItem, Item } from '../../../models/Assembly';
import { Contract } from '../../../models/Contract';
import { Phase } from '../../../models/Phase';
import { ProcessRunControl, ProcessRunControlDataByPrcsID } from '../../../models/ProcessRunControl';
import { Notification } from '../../../models/Notification';
import { AwardedQuoteReport } from '../../../models/AwardedQuoteReport';
import { SysproBudgetReport } from '../../../models/SysproBudgetReport';
import { QuoteReport } from '../../../models/QuoteReport';
import { QuotesbyContactReport } from '../../../models/QuotesbyContactReport';
import { QuotesbyVendorReport } from '../../../models/QuotesbyVendorReport';
import { ChangeOrderReport } from '../../../models/ChangeOrderReport';
import { ContactsReport } from '../../../models/ContactsReport';
import { SpecifiedEntitiesReport } from '../../../models/SpecifiedEntitiesReport';
import { ProductAsmblitemReport } from '../../../models/ProductAsmblitemReport';
import { ProductlineItemsReport } from '../../../models/ProductlineItemsReport';
import { DashboardQuickStats, QuoteByMonth, AwardByMonth, QuotesByContract, RevenueByDivision, QuotesByState, DivisionsByState } from '../../../models/Dashboard';

@Injectable()
export class MetadataService {
  public CustomersList: Customer[] = [];
  public DivisionList: Division[] = [];
  StatesList: States[];
  CountyList: County[];
  constructor(private http: Http, private pcom: PrimcomService) {
    //Get Customers Data

  }
  /**======================================================* Start Divisions *=================================================================== */
  public GetAllDivisions() {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.DivisionsEndPoint, this.pcom.getOptions()).map(res => res.json() as Division[]);
  }

  public GetDivisions(parm: string) {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.DivisionsEndPoint + parm, this.pcom.getOptions()).map(res => res.json() as Division[]);
  }
  public PostDivision(Name: string, Description: string, ExternalReferenceNo: string, SubAccount: string, Active: boolean, CreatedBy: string, CreatedDate: Date, LastModifiedBy: string, LastModifiedDate: Date) {
    return this.http.post(EndPointsConfig.HostName + EndPointsConfig.DivisionsEndPoint, { Name: Name, Description: Description, ExternalReferenceNo: ExternalReferenceNo, Active: Active, SubAccount: SubAccount, CreatedBy: CreatedBy, CreatedDate: CreatedDate, LastModifiedBy: LastModifiedBy, LastModifiedDate: LastModifiedDate }).map(res => res.json() as Division[])
  }
  public PutDivision(DivisionID: number, Name: string, Description: string, ExternalReferenceNo: string, SubAccount: string, Active: boolean, CreatedBy: string, CreatedDate: Date, LastModifiedBy: string, LastModifiedDate: Date) {
    return this.http.put(EndPointsConfig.HostName + EndPointsConfig.DivisionsEndPoint + DivisionID, { DivisionID: DivisionID, Name: Name, Description: Description, ExternalReferenceNo: ExternalReferenceNo, Active: Active, SubAccount: SubAccount, LastModifiedBy: LastModifiedBy, LastModifiedDate: LastModifiedDate }).map(res => res.json() as Division[])
  }
  public DeleteDivision(parm: number) {
    return this.http.delete(EndPointsConfig.HostName + EndPointsConfig.DivisionsEndPoint + parm, this.pcom.getOptions()).map(res => res.json() as Division[]);
  }
  public GetFilteredDivisions(divName: string, Description: string, SubAccount: string, Status: boolean) {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.DivisionsEndPoint + "?divName=" + divName + "&Description=" + Description + "&SubAccount=" + SubAccount + "&status=" + Status, this.pcom.getOptions()).map(res => res.json() as Division[]);
  }
  /** End Divisions */
  /** =======================================================* Start Customers *======================================================================= */
  public GetAllCustomers() {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.CustomersEndPoint, this.pcom.getOptions()).map(res => res.json() as Customer[]);
  }
  public GetCustomers(parm: string) {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.CustomersEndPoint + parm, this.pcom.getOptions()).map(res => res.json() as Customer[]);
  }
  public PostCustomer(CustomerTypeID: number, Name: string, ShortName: string, ExternalReferenceNo: string, Active: boolean, CreatedBy: string, CreatedDate: Date) {
    return this.http.post(EndPointsConfig.HostName + EndPointsConfig.CustomersEndPoint, { CustomerTypeID: CustomerTypeID, Name: Name, ShortName: ShortName, ExternalReferenceNo: ExternalReferenceNo, Active: Active, CreatedBy: CreatedBy, CreatedDate: CreatedDate }).map(res => res.json() as Customer[])
  }
  public PutCustomer(CustomerID: number, CustomerTypeID: string, Name: string, ShortName: string, ExternalReferenceNo: string, Active: boolean, CreatedBy: string, CreatedDate: Date, LastModifiedBy: string, LastModifiedDate: Date) {
    return this.http.put(EndPointsConfig.HostName + EndPointsConfig.CustomersEndPoint + CustomerID, { CustomerID: CustomerID, CustomerTypeID: CustomerTypeID, Name: Name, ShortName: ShortName, ExternalReferenceNo: ExternalReferenceNo, Active: Active, CreatedBy: CreatedBy, CreatedDate: CreatedDate, LastModifiedBy: LastModifiedBy, LastModifiedDate: LastModifiedDate }).map(res => res.json() as Customer[])
  }
  public GetFilteredCustomers(CustName: string, County: number, State: string, Status: boolean) {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.CustomersEndPoint + "?CountyID=" + County + "&Name=" + CustName + "&State=" + State + "&status=" + Status, this.pcom.getOptions()).map(res => res.json() as Customer[]);
  }
  public GetCustomerContacts(parm: number) {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.CustomerContactEndpoint + parm, this.pcom.getOptions()).map(res => res.json() as customercontact[]);
  }
  public PostCustomerContacts(CustomerID: number, FirstName: string, LastName: string, ContactType: string,Position:string, Email: string, Cell: string, OfficePhone: string, OtherPhone: string, Fax: string, Active: boolean, CreatedBy: string, CreatedDate: Date) {
    return this.http.post(EndPointsConfig.HostName + EndPointsConfig.CustomerContactEndpoint, { CustomerID: CustomerID, FirstName: FirstName, LastName: LastName, ContactType: ContactType,Position:Position, Email: Email, Cell: Cell, OfficePhone: OfficePhone, OtherPhone: OtherPhone, Fax: Fax, Active: Active, CreatedBy: CreatedBy, CreatedDate: CreatedDate }).map(res => res.json() as customercontact[])
  }
  public PutCustomerContact(ContactID: number, CustomerID: number, FirstName: string, LastName: string, ContactType: string, Position:string, Email: string, Cell: string, OfficePhone: string, OtherPhone: string, Fax: string, Active: boolean, CreatedBy: string, CreatedDate: Date, LastModifiedBy: string, LastModifiedDate: Date) {
    return this.http.put(EndPointsConfig.HostName + EndPointsConfig.CustomerContactEndpoint + ContactID, { ContactID: ContactID, CustomerID: CustomerID, FirstName: FirstName, LastName: LastName, ContactType: ContactType,Position: Position, Email: Email, Cell: Cell, OfficePhone: OfficePhone, OtherPhone: OtherPhone, Fax: Fax, Active: Active, CreatedBy: CreatedBy, CreatedDate: CreatedDate, LastModifiedBy: LastModifiedBy, LastModifiedDate: LastModifiedDate }).map(res => res.json() as customercontact[])
  }
  public GetAllContacts() {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.CustomerContactEndpoint, this.pcom.getOptions()).map(res => res.json() as customercontact[]);
  }
  public GetCustContacts(CustomerID: number) {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.CustomerContactEndpoint + CustomerID, this.pcom.getOptions()).map(res => res.json() as customercontact[]);
  }
  public DeleteCustomerContacts(parm: number) {
    return this.http.delete(EndPointsConfig.HostName + EndPointsConfig.CustomerContactEndpoint + parm, this.pcom.getOptions()).map(res => res.json() as customercontact[]);
  }
  public DeleteCustomes(parm: number) {
    return this.http.delete(EndPointsConfig.HostName + EndPointsConfig.CustomersEndPoint + parm, this.pcom.getOptions()).map(res => res.json() as Customer[]);
  }
  public GetCustomerDivMapping(CustomerID: number) {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.CustomerDivEndPoint + CustomerID, this.pcom.getOptions()).map(res => res.json() as CustomerDivisionMapping[]);
  }
  public PutCustomerMappedDivisions(CustomerID: number, DivisionID: string, Active: boolean, CreatedBy: string, CreatedDate: Date, LastModifiedBy: string, LastModifiedDate: Date) {
    return this.http.put(EndPointsConfig.HostName + EndPointsConfig.CustomerDivEndPoint + CustomerID, { CustomerID: CustomerID, DivisionID: DivisionID, Active: true, CreatedBy: CreatedBy, CreatedDate: CreatedDate, LastModifiedBy: LastModifiedBy, LastModifiedDate: LastModifiedDate }).map(res => res.json() as CustomerDivisionMapping[])
  }
  public GetAllCustomerOffices() {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.CustomerOfficesEndpoint, this.pcom.getOptions()).map(res => res.json() as CustomerOffices[]);
  }
  public PostCustomerOffice(CustomerID: number, CorporateOffice: boolean, Address: string, Address1: string, City: string, StateID: string, CountryID: string, CountyID: number, ZIPCode: string, Fax: string, OfficePhone: string, Cell: string, ExternalReferenceNo: string, Active: boolean, CreatedBy: string, CreatedDate: Date) {
    return this.http.post(EndPointsConfig.HostName + EndPointsConfig.CustomerOfficesEndpoint, { CustomerID: CustomerID, CorporateOffice: CorporateOffice, Address: Address, Address1: Address1, City: City, StateID: StateID, CountryID: CountryID, CountyID: CountyID, ZIPCode: ZIPCode, Fax: Fax, OfficePhone: OfficePhone, Cell: Cell, ExternalReferenceNo: ExternalReferenceNo, Active: Active, CreatedBy: CreatedBy, CreatedDate: CreatedDate }).map(res => res.json() as CustomerOffices[])
  }
  public PutCustomerOffice(CustomerOfficeID: number, CustomerID: number, CorporateOffice: boolean, Address: string, Address1: string, City: string, StateID: string, CountryID: string, CountyID: number, ZIPCode: string, Fax: string, OfficePhone: string, Cell: string, ExternalReferenceNo: string, Active: boolean, CreatedBy: string, CreatedDate: Date, LastModifiedBy: string, LastModifiedDate: Date) {
    return this.http.put(EndPointsConfig.HostName + EndPointsConfig.CustomerOfficesEndpoint + CustomerOfficeID, { CustomerOfficeID, CustomerID: CustomerID, CorporateOffice: CorporateOffice, Address: Address, Address1: Address1, City: City, StateID: StateID, CountryID: CountryID, CountyID: CountyID, ZIPCode: ZIPCode, Fax: Fax, OfficePhone: OfficePhone, Cell: Cell, ExternalReferenceNo: ExternalReferenceNo, Active: Active, CreatedBy: CreatedBy, CreatedDate: CreatedDate, LastModifiedBy: LastModifiedBy, LastModifiedDate: LastModifiedDate }).map(res => res.json() as CustomerOffices[])
  }
  public DeleteCustomerOffice(parm: number) {
    return this.http.delete(EndPointsConfig.HostName + EndPointsConfig.CustomerOfficesEndpoint + parm, this.pcom.getOptions()).map(res => res.json() as CustomerOffices[]);
  }
  public GetCustomerOfficeContactsByID(parm: number) {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.CustomerOfficeContactEndpoint + parm, this.pcom.getOptions()).map(res => res.json() as CustomerOfficeContacts[]);
  }
  // public PostCustomerOfficeContact( CustomerOfficeID:number,ContactID:number, ContactType:string, PrimaryContact:string, Active:boolean, CreatedBy:string, CreatedDate:Date){
  //   return this.http.post(EndPointsConfig.HostName+EndPointsConfig.CustomerOfficeContactEndpoint,{ CustomerOfficeID : CustomerOfficeID, ContactID:ContactID,ContactType : ContactType,PrimaryContact : PrimaryContact, Active : Active, CreatedBy : CreatedBy, CreatedDate : CreatedDate}).map(res => res.json() as CustomerOfficeContacts[])
  // }
  public PutCustomerOfficeContact(CustomerOfficeID: number, ContactID: string, PrimaryContact: boolean, Active: boolean, CreatedBy: string, LastModifiedBy: string) {
    return this.http.put(EndPointsConfig.HostName + EndPointsConfig.CustomerOfficeContactEndpoint + CustomerOfficeID, { CustomerOfficeID: CustomerOfficeID, ContactID: ContactID, PrimaryContact: PrimaryContact, Active: Active, CreatedBy: CreatedBy, LastModifiedBy: LastModifiedBy }).map(res => res.json() as CustomerOfficeContacts[])
  }
  public PutCustomerOfficePrimaryContact(CustomerOfficeID: number, ContactID: number, LastModifiedBy: string) {
    return this.http.put(EndPointsConfig.HostName + EndPointsConfig.ContactTypeEndPoint + CustomerOfficeID, { CustomerOfficeID: CustomerOfficeID, ContactID: ContactID, LastModifiedBy: LastModifiedBy }).map(res => res.json() as CustomerOfficeContacts[])
  }
  public DeleteCustomerOfficeContact(parm: number) {
    return this.http.delete(EndPointsConfig.HostName + EndPointsConfig.CustomersEndPoint + parm, this.pcom.getOptions()).map(res => res.json() as CustomerOfficeContacts[]);
  }
  public GetContactTypes() {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.ContactTypeEndPoint, this.pcom.getOptions()).map(res => res.json() as ContactType[]);
  }
  public GetCustomerType() {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.CustomerTypeEndPoint, this.pcom.getOptions()).map(res => res.json() as CustomerType[]);
  }
  public GetCountry() {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.CountryEndPoint, this.pcom.getOptions()).map(res => res.json() as Country[]);
  }
  public GetUOM() {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.UOMEndPoint, this.pcom.getOptions()).map(res => res.json() as UOM[]);
  }
  public PostCustomerOfficeContacts(CustomerOfficeID: number, ContactID: number, PrimaryContact: boolean, Specifier: boolean, ProductLineID: number, Active: boolean, CreatedBy: string, CreatedDate: Date, ProductLines) {
    return this.http.post(EndPointsConfig.HostName + EndPointsConfig.CustomerOfficeContactEndpoint, { CustomerOfficeID: CustomerOfficeID, ContactID: ContactID, PrimaryContact: PrimaryContact, Specifier: Specifier, ProductLineID: ProductLineID, Active: Active, CreatedBy: CreatedBy, CreatedDate: CreatedDate, ProductLines: ProductLines }).map(res => res.json() as string)
  }

  public PutCustomerOfficeContacts(CustomerOfficeContactMapID: number, CustomerOfficeID: number, ContactID: number, PrimaryContact: boolean, Specifier: boolean, ProductLineID: number, Active: boolean, CreatedBy: string, CreatedDate: Date, LastModifiedBy: string, LastModifiedDate: Date) {
    return this.http.put(EndPointsConfig.HostName + EndPointsConfig.CustomerOfficeContactEndpoint + CustomerOfficeContactMapID, { CustomerOfficeContactMapID: CustomerOfficeContactMapID, CustomerOfficeID: CustomerOfficeID, ContactID: ContactID, PrimaryContact: PrimaryContact, Specifier: Specifier, ProductLineID: ProductLineID, Active: Active, CreatedBy: CreatedBy, CreatedDate: CreatedDate, LastModifiedBy: LastModifiedBy, LastModifiedDate: LastModifiedDate }).map(res => res.json() as CustomerOfficeContacts[])
  }
  public DeleteCustomerOfficeContacts(parm: number) {
    return this.http.delete(EndPointsConfig.HostName + EndPointsConfig.CustomerOfficeContactEndpoint + parm, this.pcom.getOptions()).map(res => res.json() as CustomerOfficeContacts[]);
  }
  public GetEmailHistory(parm: number) {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.EmailHistoryEndPoint + parm, this.pcom.getOptions()).map(res => res.json() as CustomerEmailHistory[]);
  }
  public GetEmail(CustomerOfficeID: number) {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.EmailEndPoint + CustomerOfficeID, this.pcom.getOptions()).map(res => res.json() as CustomerEmail[]);
  }
  public PostEmail(Email: any): Observable<CustomerEmail> {
    return this.http.post(EndPointsConfig.HostName + EndPointsConfig.EmailEndPoint, this.pcom.generateBody(Email), this.pcom.getOptions()).map(res => res.json() as CustomerEmail);
  }
  public GetProductLineByNotExistingContact(CustomerOfficeID: number,ContactID:number) {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.CustOfficePrdLineDropdownEndPoint + "?CustomerOfficeID=" + CustomerOfficeID + "&ContactID=" + ContactID, this.pcom.getOptions()).map(res => res.json() as CustOfficePrdLineMapping[]);
  }
  public GetCustomerPrdLineMapping(CustomerOfficeID: number) {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.CustOfficePrdLineMappingEndPoint + "?CustomerOfficeID=" + CustomerOfficeID, this.pcom.getOptions()).map(res => res.json() as CustOfficePrdLineMapping[]);
  }
  public GetUnMappedCustomerPrdLines(CustomerOfficeID: number) {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.CustOfficePrdLineMappingEndPoint + CustomerOfficeID, this.pcom.getOptions()).map(res => res.json() as ProductLines[]);
  }
  public DeleteCustomerPrdLineMapping(CustOfficePrdLineMappingID: number) {
    return this.http.delete(EndPointsConfig.HostName + EndPointsConfig.CustOfficePrdLineMappingEndPoint + CustOfficePrdLineMappingID, this.pcom.getOptions()).map(res => res.json() as string);
  }
  public CreateCustomerPrdLineMapping(CustOfficePrdLineMapping: any) {
    return this.http.post(EndPointsConfig.HostName + EndPointsConfig.CustOfficePrdLineMappingEndPoint, this.pcom.generateBody(CustOfficePrdLineMapping), this.pcom.getOptions()).map(res => res.json() as string);
  }
  public CreatecustDivMapping(CustomerDivisionMapping: any) {
    return this.http.post(EndPointsConfig.HostName + EndPointsConfig.CustomerDivEndPoint, this.pcom.generateBody(CustomerDivisionMapping), this.pcom.getOptions()).map(res => res.json() as string);
  }
  public GetCustomertoDivMapping(CustomerID: number) {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.CustomerDivEndPoint + CustomerID, this.pcom.getOptions()).map(res => res.json() as CustomerDivisionMapping[]);
  }
  public GetCustDivMapping(CustomerID: number) {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.CustomersEndPoint + CustomerID, this.pcom.getOptions()).map(res => res.json() as Division[]);
  }
  public DeleteDivCustMapping(CustDivisionMapID: number) {
    return this.http.delete(EndPointsConfig.HostName + EndPointsConfig.CustomerDivEndPoint + CustDivisionMapID, this.pcom.getOptions()).map(res => res.json() as string);
  }
  public ExportCustomerReport() {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.CustomerExportEndPoint, this.pcom.getOptions()).map(res => res.json() as string)
  }
  public GetOfficeContactMapping(CustomerOfficeID: number) {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.CustomerOfficeContactEndpoint + "?CustomerOfficeID=" + CustomerOfficeID, this.pcom.getOptions()).map(res => res.json() as customercontact[]);
  }
  /** End Customers */
  /** =========================================================* Start Notes *=============================================================*/
  public GetFilteredNotes(NoteName: string, Description: string, Status: boolean) {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.NotesEndPoint + "?Name=" + NoteName + "&Notes=" + Description + "&status=" + Status, this.pcom.getOptions()).map(res => res.json() as Notes[]);
  }
  public GetAllNotes() {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.NotesEndPoint, this.pcom.getOptions()).map(res => res.json() as Notes[]);
  }
  public GetNoteDivisions() {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.NotesEndPoint, this.pcom.getOptions()).map(res => res.json() as NotesDivisionMapping[]);
  }
  public PostNote(Name: string, Notes: string, DefaultNote: string, Active: boolean, CreatedBy: string, CreatedDate: Date) {
    return this.http.post(EndPointsConfig.HostName + EndPointsConfig.NotesEndPoint, { Name: Name, Notes: Notes, DefaultNote: DefaultNote, Active: Active, CreatedBy: CreatedBy, CreatedDate: CreatedDate }).map(res => res.json() as Notes[])
  }
  public PutNote(NotesID: number, Name: string, Notes: string, DefaultNote: string, Active: boolean, CreatedBy: string, CreatedDate: Date, LastModifiedBy: string, LastModifiedDate: Date) {
    return this.http.put(EndPointsConfig.HostName + EndPointsConfig.NotesEndPoint + NotesID, { NotesID: NotesID, Name: Name, Notes: Notes, DefaultNote: DefaultNote, Active: Active, CreatedBy: CreatedBy, CreatedDate: CreatedDate, LastModifiedBy: LastModifiedBy, LastModifiedDate: LastModifiedDate }).map(res => res.json() as Notes[])
  }
  public DeleteNotes(parm: number) {
    return this.http.delete(EndPointsConfig.HostName + EndPointsConfig.NotesEndPoint + parm, this.pcom.getOptions()).map(res => res.json() as Notes[]);
  }

  public GetNotesDivMapping(i: number, NotesID: number) {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.NotesDivEndPoint + i + "?NotesID=" + NotesID, this.pcom.getOptions()).map(res => res.json() as NotesDivisionMapping[]);
  }
  public PutNotesMappedDivisions(NotesID: number, DivisionID: string, Active: boolean, CreatedBy: string, CreatedDate: Date, LastModifiedBy: string, LastModifiedDate: Date) {
    return this.http.put(EndPointsConfig.HostName + EndPointsConfig.NotesDivEndPoint + NotesID, { NotesID: NotesID, DivisionID: DivisionID, Active: true, CreatedBy: CreatedBy, CreatedDate: CreatedDate, LastModifiedBy: LastModifiedBy, LastModifiedDate: LastModifiedDate }).map(res => res.json() as NotesDivisionMapping[])
  }
  public GetNotestoDivMapping(NotesID: number) {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.NotesDivEndPoint + NotesID, this.pcom.getOptions()).map(res => res.json() as NotesDivisionMapping[]);
  }
  public GetUnMappedNotePrdLines(NotesID: number) {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.NotesNoteProductLineEndPoint + NotesID, this.pcom.getOptions()).map(res => res.json() as ProductLines[]);
  }
  public DeleteNotePrdLineMapping(NotesDivisionMapID: number) {
    return this.http.delete(EndPointsConfig.HostName + EndPointsConfig.NotesNoteProductLineEndPoint + NotesDivisionMapID, this.pcom.getOptions()).map(res => res.json() as string);
  }
  public CreateNotePrdLineMapping(NoestoProductLineMapping: any) {
    return this.http.post(EndPointsConfig.HostName + EndPointsConfig.NotesNoteProductLineEndPoint, this.pcom.generateBody(NoestoProductLineMapping), this.pcom.getOptions()).map(res => res.json() as string);
  }
  public GetNotestoprdLineMapping(NotesID: number) {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.NotesNoteProductLineEndPoint + "?NotesID=" + NotesID, this.pcom.getOptions()).map(res => res.json() as NoestoProductLineMapping[]);
  }
  //  public GetNotesDivMapping(NotesID:number) {
  //   return this.http.get(EndPointsConfig.HostName+EndPointsConfig.NotesDivEndPoint + NotesID, this.pcom.getOptions()).map(res => res.json() as NotesDivisionMapping[]);
  // }
  public PostNotesMappedDivisions(NotesID: number, DivisionIDs: string, Active: boolean, CreatedBy: string) {
    return this.http.post(EndPointsConfig.HostName + EndPointsConfig.NotesDivEndPoint, { NotesID: NotesID, DivisionIDs: DivisionIDs, Active: Active, CreatedBy: CreatedBy }).map(res => res.json() as NotesDivisionMappingSP[])
  }
  public GetNotesProductLineMapping(NotesID: number) {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.NotesNoteProductLineEndPoint + NotesID, this.pcom.getOptions()).map(res => res.json() as NoestoProductLineMapping[]);
  }
  public PutNotesMappedProductLines(NotesID: number, DivisionID: number, ProductLineID: string, Active: boolean, CreatedBy: string, CreatedDate: Date, LastModifiedBy: string, LastModifiedDate: Date) {
    return this.http.put(EndPointsConfig.HostName + EndPointsConfig.NotesNoteProductLineEndPoint + NotesID, { NotesID: NotesID, DivisionID: DivisionID, ProductLineID: ProductLineID, Active: true, CreatedBy: CreatedBy, CreatedDate: CreatedDate, LastModifiedBy: LastModifiedBy, LastModifiedDate: LastModifiedDate }).map(res => res.json() as NoestoProductLineMapping[])
  }
  public GetContractType() {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.ContractTypeEndPoint, this.pcom.getOptions()).map(res => res.json() as Contract[]);
  }

  public GetCategories() {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.ProjectCategories, this.pcom.getOptions()).map(res => res.json() as ProjectCategories[]);
  }

  public GetStates(): Observable<States[]> {
    if (this.StatesList && this.StatesList.length > 0) {
      return Observable.of(this.StatesList);
    } else {
      return this.http.get(EndPointsConfig.HostName + EndPointsConfig.ProjectStates, this.pcom.getOptions()).map(res => res.json() as States[]);
    }
  }

  public GetCounty(): Observable<County[]> {
    if (this.CountyList && this.CountyList.length > 0) {
      return Observable.of(this.CountyList);
    } else {
      return this.http.get(EndPointsConfig.HostName + EndPointsConfig.ProjectCounty, this.pcom.getOptions()).map(res => res.json() as County[]);
    }
  }

  public GetNoteDivisionMapping(i: number, NotesID: number) {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.NotesDivEndPoint + i + "?NotesID=" + NotesID, this.pcom.getOptions()).map(res => res.json() as GetNoteDivisions[]);

  }
  public PutNotesDivision(NotesDivisionMapID: number, NotesID: number, DivisionIDs: string, Active: boolean, CreatedBy: string, CreatedDate: Date, ) {
    return this.http.put(EndPointsConfig.HostName + EndPointsConfig.NotesDivEndPoint + NotesDivisionMapID, { NotesDivisionMapID, NotesID: NotesID, DivisionIDs: DivisionIDs, Active: Active, CreatedBy: CreatedBy, CreatedDate: CreatedDate }).map(res => res.json() as NotesDivisionMapping[])
  }
  public DeleteNotesDivision(parm: number) {
    return this.http.delete(EndPointsConfig.HostName + EndPointsConfig.NotesDivEndPoint + parm, this.pcom.getOptions()).map(res => res.json() as NotesDivisionMapping[]);
  }

  public GetProductLineByDivId(NotesID: number, DivisionID: number) {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.NotesNoteProductLineEndPoint + NotesID + "?DivisionID=" + DivisionID, this.pcom.getOptions()).map(res => res.json() as NoestoProductLineMapping[]);
  }
  public GetProductLineByDivIds(DivID: number) {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.NotesNoteProductLineEndPoint + DivID, this.pcom.getOptions()).map(res => res.json() as NoestoProductLineMapping[]);
  }

  /** End Notes */
  /** ========================================================* Start Terms And Conditions *=====================================================*/
  public GetFilteredTerms(TermName: string, Description: string, Status: boolean) {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.TermsAndConditionsEndPoint + "?Name=" + TermName + "&TermsAndConditions=" + Description + "&status=" + Status, this.pcom.getOptions()).map(res => res.json() as TermsAndCondition[]);
  }
  public GetTermsAndConditions() {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.TermsAndConditionsDivEndPoint, this.pcom.getOptions()).map(res => res.json() as TermsAndCondition[]);
  }
  public PostTermsAndConditions(Name: string, TermsAndConditions: string, DefaultTermsAndConditions: string, Active: boolean, CreatedBy: string, CreatedDate: Date) {
    return this.http.post(EndPointsConfig.HostName + EndPointsConfig.TermsAndConditionsEndPoint, { Name: Name, TermsAndConditions: TermsAndConditions, DefaultTermsAndConditions: DefaultTermsAndConditions, Active: Active, CreatedBy: CreatedBy, CreatedDate: CreatedDate }).map(res => res.json() as TermsAndCondition[])
  }
  public PutTermsAndConditions(TermsAndConditionsID: number, Name: string, TermsAndConditions: string, DefaultTermsAndConditions: string, Active: boolean, CreatedBy: string, CreatedDate: Date, LastModifiedBy: string, LastModifiedDate: Date) {
    return this.http.put(EndPointsConfig.HostName + EndPointsConfig.TermsAndConditionsEndPoint + TermsAndConditionsID, { TermsAndConditionsID: TermsAndConditionsID, Name: Name, TermsAndConditions: TermsAndConditions, DefaultTermsAndConditions: DefaultTermsAndConditions, Active: Active, CreatedBy: CreatedBy, CreatedDate: CreatedDate, LastModifiedBy: LastModifiedBy, LastModifiedDate: LastModifiedDate }).map(res => res.json() as TermsAndCondition[])
  }
  public DeleteTermsandConditions(parm: number) {
    return this.http.delete(EndPointsConfig.HostName + EndPointsConfig.TermsAndConditionsEndPoint + parm, this.pcom.getOptions()).map(res => res.json() as TermsAndCondition[]);
  }

  public GetTnCDivMapping(i: number, TermsAndConditionsID: number) {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.TermsAndConditionsDivEndPoint + i + "?TermsAndConditionsID=" + TermsAndConditionsID, this.pcom.getOptions()).map(res => res.json() as TermsAndConditionsDivisionMapping[]);
  }
  public PutTacMappedDivisions(TermsAndConditionsID: number, DivisionID: string, Active: boolean, CreatedBy: string, CreatedDate: Date, LastModifiedBy: string, LastModifiedDate: Date) {
    return this.http.put(EndPointsConfig.HostName + EndPointsConfig.TermsAndConditionsDivEndPoint + TermsAndConditionsID, { TermsAndConditionsID: TermsAndConditionsID, DivisionID: DivisionID, Active: true, CreatedBy: CreatedBy, CreatedDate: CreatedDate, LastModifiedBy: LastModifiedBy, LastModifiedDate: LastModifiedDate }).map(res => res.json() as TermsAndConditionsDivisionMapping[])
  }
  public GetTermstoDivMapping(TermsAndConditionsID: number) {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.TermsAndConditionsDivEndPoint + TermsAndConditionsID, this.pcom.getOptions()).map(res => res.json() as TermsAndConditionsDivisionMapping[]);
  }
  public CreateTermDivMapping(NotesDivisionMapping: any) {
    return this.http.post(EndPointsConfig.HostName + EndPointsConfig.TermsAndConditionsDivEndPoint, this.pcom.generateBody(NotesDivisionMapping), this.pcom.getOptions()).map(res => res.json() as string);
  }
  public DeleteDivTermMapping(TermsAndConditionsDivisionMapID: number) {
    return this.http.delete(EndPointsConfig.HostName + EndPointsConfig.TermsAndConditionsDivEndPoint + TermsAndConditionsDivisionMapID, this.pcom.getOptions()).map(res => res.json() as string);
  }
  public GetTermDivMapping(TermsAndConditionsID: number) {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.TermsAndConditionsEndPoint + TermsAndConditionsID, this.pcom.getOptions()).map(res => res.json() as Division[]);
  }
  // public PutTaCDivision(TermsAndConditionsDivisionMapID:number,TermsAndConditionsID:number,DivisionIDs:string,Active:boolean, CreatedBy:string, CreatedDate:Date,){
  //   return this.http.put(EndPointsConfig.HostName+EndPointsConfig.TermsAndConditionsDivEndPoint + TermsAndConditionsDivisionMapID,{TermsAndConditionsDivisionMapID,TermsAndConditionsID:TermsAndConditionsID,DivisionIDs : DivisionIDs,Active : Active, CreatedBy : CreatedBy, CreatedDate : CreatedDate}).map(res => res.json() as TermsAndConditionsDivisionMapping[])
  // }
  // public DeleteTacDivision(parm:number) {
  //   return this.http.delete(EndPointsConfig.HostName+EndPointsConfig.TermsAndConditionsDivEndPoint + parm, this.pcom.getOptions()).map(res => res.json() as TermsAndConditionsDivisionMapping[]);
  //  }
  /** End Terms And Conditions */
  /**=================================================* Start Freight *=================================================================================== */
  public GetFreight() {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.FreightEndPoint, this.pcom.getOptions()).map(res => res.json() as Freight[]);
  }
  public PostFreight(County: number, FreightRate: any, Active: boolean, CreatedBy: string, CreatedDate: Date) {
    return this.http.post(EndPointsConfig.HostName + EndPointsConfig.FreightEndPoint, { CountyID: County, FreightRate: FreightRate, Active: Active, CreatedBy: CreatedBy, CreatedDate: CreatedDate }).map(res => res.json() as Freight[])
  }
  public PutFreight(FreightSetupID: number, County: number, FreightRate: any, Active: boolean, CreatedBy: string, CreatedDate: Date, LastModifiedBy: string, LastModifiedDate: Date) {
    return this.http.put(EndPointsConfig.HostName + EndPointsConfig.FreightEndPoint + FreightSetupID, { FreightSetupID: FreightSetupID, CountyID: County, FreightRate: FreightRate, Active: Active, CreatedBy: CreatedBy, CreatedDate: CreatedDate, LastModifiedBy: LastModifiedBy, LastModifiedDate: LastModifiedDate }).map(res => res.json() as Freight[])
  }
  public DeleteFreight(parm: number) {
    return this.http.delete(EndPointsConfig.HostName + EndPointsConfig.FreightEndPoint + parm, this.pcom.getOptions()).map(res => res.json() as Freight[]);
  }

  /** End Freight */
  /** =================================================* Start SalesRep *============================================================================*/
  public GetsalesRepresentative() {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.salesRepresentativeEndPoint, this.pcom.getOptions()).map(res => res.json() as salesRepresentative[]);
  }
  public PostsalesRepresentative(CountyID: number, FirstName: string, LastName: string, Address: string, Address1: string, ZIPCode: string, PrimaryPhone: string, OtherPhone: string, OfficePhone: string, Fax: string, City: string, Country: string, CommPct: any, Active: boolean, CreatedBy: string, CreatedDate: Date) {
    return this.http.post(EndPointsConfig.HostName + EndPointsConfig.salesRepresentativeEndPoint, { CountyID: CountyID, FirstName: FirstName, LastName: LastName, Address: Address, Address1: Address1, ZIPCode: ZIPCode, PrimaryPhone: PrimaryPhone, OfficePhone: OfficePhone, OtherPhone: OtherPhone, Fax: Fax, City: City, Country: Country, CommPct: CommPct, Active: Active, CreatedBy: CreatedBy, CreatedDate: CreatedDate }).map(res => res.json() as salesRepresentative[])
  }
  public PutSalesRepresentative(SalesRepID: number, CountyID: number, FirstName: string, LastName: string, Address: string, Address1: string, ZIPCode: string, PrimaryPhone: string, OtherPhone: string, OfficePhone: string, Fax: string, City: string, Country: string, CommPct: any, Active: boolean, CreatedBy: string, CreatedDate: Date, LastModifiedBy: string, LastModifiedDate: Date) {
    return this.http.put(EndPointsConfig.HostName + EndPointsConfig.salesRepresentativeEndPoint + SalesRepID, { SalesRepID: SalesRepID, CountyID: CountyID, FirstName: FirstName, LastName: LastName, Address: Address, Address1: Address1, ZIPCode: ZIPCode, PrimaryPhone: PrimaryPhone, OfficePhone: OfficePhone, OtherPhone: OtherPhone, Fax: Fax, City: City, Country: Country, CommPct: CommPct, Active: Active, CreatedBy: CreatedBy, CreatedDate: CreatedDate, LastModifiedBy: LastModifiedBy, LastModifiedDate: LastModifiedDate }).map(res => res.json() as salesRepresentative[])
  }
  public DeleteSalesRepresentative(parm: number) {
    return this.http.delete(EndPointsConfig.HostName + EndPointsConfig.salesRepresentativeEndPoint + parm, this.pcom.getOptions()).map(res => res.json() as salesRepresentative[]);
  }

  /** End SalesRep */
  /** =======================================================* Start ProductLines *=====================================================================*/
  public GetFilteredProductLines(ProductLineName: string, AlternateName: string, Status: boolean) {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.ProductLinesEndPoint + "?Name=" + ProductLineName + "&AltName=" + AlternateName + "&status=" + Status, this.pcom.getOptions()).map(res => res.json() as ProductLines[]);
  }
  public GetProductLines() {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.ProductLinesEndPoint, this.pcom.getOptions()).map(res => res.json() as ProductLines[]);
  }
  public GetProductLinesByOrder(parm: string) {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.ProductLinesEndPoint + parm, this.pcom.getOptions()).map(res => res.json() as ProductLines[]);
  }
  public PostProductLine(DivisionID: number, Name: string, AltName: string, ExternalSystemRefNo: string, Active: boolean, CreatedBy: string, CreatedDate: Date) {
    return this.http.post(EndPointsConfig.HostName + EndPointsConfig.ProductLinesEndPoint, { DivisionID: DivisionID, Name: Name, AltName: AltName, Active: Active, ExternalSystemRefNo: ExternalSystemRefNo, CreatedBy: CreatedBy, CreatedDate: CreatedDate }).map(res => res.json() as ProductLines[])
  }
  public PutProductLines(ProductLineID: number, DivisionID: number, Name: string, AltName: string, ExternalSystemRefNo: string, Active: boolean, CreatedBy: string, CreatedDate: Date, LastModifiedBy: string, LastModifiedDate: Date) {
    return this.http.put(EndPointsConfig.HostName + EndPointsConfig.ProductLinesEndPoint + ProductLineID, { ProductLineID: ProductLineID, DivisionID: DivisionID, Name: Name, AltName: AltName, Active: Active, ExternalSystemRefNo: ExternalSystemRefNo, CreatedBy: CreatedBy, CreatedDate: CreatedDate, LastModifiedBy: LastModifiedBy, LastModifiedDate: LastModifiedDate }).map(res => res.json() as ProductLines[])
  }
  public DeleteProductLines(parm: number) {
    return this.http.delete(EndPointsConfig.HostName + EndPointsConfig.ProductLinesEndPoint + parm, this.pcom.getOptions()).map(res => res.json() as ProductLines[]);
  }
  public GetProductLineDivisionMapping(ProductLineID: number) {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.ProductLineDivEndPoint + ProductLineID, this.pcom.getOptions()).map(res => res.json() as ProductlineDivisions[]);
  }
  public PostProductLineDivisions(ProductLineID: number, DivisionIDs: string, Active: boolean, CreatedBy: string, CreatedDate: Date, ) {
    return this.http.post(EndPointsConfig.HostName + EndPointsConfig.ProductLineDivEndPoint, { ProductLineID: ProductLineID, DivisionIDs: DivisionIDs, Active: Active, CreatedBy: CreatedBy, CreatedDate: CreatedDate }).map(res => res.json() as ProductlineDivisions[])
  }
  public DeleteProductLineDivision(parm: number) {
    return this.http.delete(EndPointsConfig.HostName + EndPointsConfig.ProductLineDivEndPoint + parm, this.pcom.getOptions()).map(res => res.json() as ProductlineDivisions[]);
  }

  /** End ProductLines */
  /** ======================================================* Start Items *===========================================================================*/
  public GetFilteredItems(ProductLine: string, ItemCode: string, Description: string, status: boolean) {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.ItemsEndPoint + "?ID=" + ProductLine + "&ItemCode=" + ItemCode + "&Description=" + Description + "&status=" + status, this.pcom.getOptions()).map(res => res.json() as Items[]);
  }
  public GetItems() {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.ItemSearchEndPoint, this.pcom.getOptions()).map(res => res.json() as Items[]);
  }
  public PostItem(Type: string, ProductLineID: number, ItemCode: string, AltCode: string, Description: string, UOMID: number, ExternalSystemRefNo: string, ApproxQuantity: string, Weight: string, UnitPrice: string, ListPrice: string, Amount: string, Active: boolean, CreatedBy: string, CreatedDate: Date) {
    return this.http.post(EndPointsConfig.HostName + EndPointsConfig.ItemsEndPoint, { Type: Type, ProductLineID: ProductLineID, ItemCode: ItemCode, AltCode: AltCode, Description: Description, UOMID: UOMID, ExternalSystemRefNo: ExternalSystemRefNo, ApproxQuantity: ApproxQuantity, Weight: Weight, UnitPrice: UnitPrice, ListPrice: ListPrice, Amount: Amount, Active: Active, CreatedBy: CreatedBy, CreatedDate: CreatedDate }).map(res => res.json() as Items[])
  }
  public PutItem(ItemID: number, ProductLineID: number, ItemCode: string, AltCode: string, Description: string, UOMID: number, ExternalSystemRefNo: string, ApproxQuantity: string, Weight: string, UnitPrice: string, ListPrice: string, Amount: string, Active: boolean, CreatedBy: string, CreatedDate: Date, LastModifiedBy: string, LastModifiedDate: Date) {
    return this.http.put(EndPointsConfig.HostName + EndPointsConfig.ItemsEndPoint + ItemID, { ItemID: ItemID, ProductLineID: ProductLineID, ItemCode: ItemCode, AltCode: AltCode, Description: Description, UOMID: UOMID, ExternalSystemRefNo: ExternalSystemRefNo, ApproxQuantity: ApproxQuantity, Weight: Weight, UnitPrice: UnitPrice, ListPrice: ListPrice, Amount: Amount, Active: Active, CreatedBy: CreatedBy, CreatedDate: CreatedDate, LastModifiedBy: LastModifiedBy, LastModifiedDate: LastModifiedDate }).map(res => res.json() as Items[])
  }
  public DeleteItem(parm: number) {
    return this.http.delete(EndPointsConfig.HostName + EndPointsConfig.ItemsEndPoint + parm, this.pcom.getOptions()).map(res => res.json() as Items[]);
  }
  public GetAllItems(param: string) {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.ItemsEndPoint.replace('/', '') + param, this.pcom.getOptions()).map(res => res.json() as any);
  }
  public GetProductLinesByDivId(DivID: number) {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.ProductLinesEndPoint + DivID, this.pcom.getOptions()).map(res => res.json() as ProductLines[]);
  }
  /** End Items */
  /** ====================================================* Start Assemblies *============================================================================*/
  public GetAssemblies() {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.AssemblyEndPoint, this.pcom.getOptions()).map(res => res.json() as Assembly[]);
  }
  public GetAssemblieItems(parm: number) {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.AssemblyParts + parm, this.pcom.getOptions()).map(res => res.json() as AssemblyItem[]);
  }
  public GetAssemblyItems(parm: number) {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.AssemblyParts + parm, this.pcom.getOptions()).map(res => res.json() as AssemblyItems[]);
  }
  public PostAssembly(DivisionID: number, Name: string, AssemblyNo: string, AltDescription: string, ExternalSystemRefNo: string, Active: boolean, CreatedBy: string, CreatedDate: Date) {
    return this.http.post(EndPointsConfig.HostName + EndPointsConfig.AssemblyEndPoint, { DivisionID: DivisionID, Name: Name, AssemblyNo: AssemblyNo, AltDescription: AltDescription, ExternalSystemRefNo: ExternalSystemRefNo, Active: Active, CreatedBy: CreatedBy, CreatedDate: CreatedDate }).map(res => res.json() as Assembly[])
  }
  public PutAssembly(DivisionID: number, AssemblyID: number, Name: string, AssemblyNo: string, AltDescription: string, ExternalSystemRefNo: string, Active: boolean, CreatedBy: string, CreatedDate: Date, LastModifiedBy: string, LastModifiedDate: Date) {
    return this.http.put(EndPointsConfig.HostName + EndPointsConfig.AssemblyEndPoint + AssemblyID, { DivisionID: DivisionID, AssemblyID: AssemblyID, Name: Name, AssemblyNo: AssemblyNo, AltDescription: AltDescription, ExternalSystemRefNo: ExternalSystemRefNo, Active: Active, CreatedBy: CreatedBy, CreatedDate: CreatedDate, LastModifiedBy: LastModifiedBy, LastModifiedDate: LastModifiedDate }).map(res => res.json() as Assembly[])
  }
  public PutAssemblyItems(AssemblyID: number, ItemID: string, Quantity: number, Active: boolean, CreatedBy: string, CreatedDate: Date, LastModifiedBy: string, LastModifiedDate: Date) {
    return this.http.put(EndPointsConfig.HostName + EndPointsConfig.AssemblyParts + AssemblyID, { AssemblyID: AssemblyID, ItemID: ItemID, Quantity: Quantity, Active: true, CreatedBy: CreatedBy, CreatedDate: CreatedDate, LastModifiedBy: LastModifiedBy, LastModifiedDate: LastModifiedDate }).map(res => res.json() as AssemblyItem[])
  }
  public SaveItems(AssemblyItemID:number,ItemID: number,Quantity: number,Active: boolean, CreatedBy: string, CreatedDate: Date, LastModifiedBy: string, LastModifiedDate: Date) {
    return this.http.post(EndPointsConfig.HostName + EndPointsConfig.AssemblyParts, {AssemblyItemID:AssemblyItemID, ItemID: ItemID,Quantity: Quantity,  Active: true, CreatedBy: CreatedBy, CreatedDate: CreatedDate, LastModifiedBy: LastModifiedBy, LastModifiedDate: LastModifiedDate }).map(res => res.json() as AssemblyItems[])
  }
  public PostAssemblyItems(AssemblyID: number, ItemID: string, Quantity: number, Active: boolean, CreatedBy: string, CreatedDate: Date) {
    return this.http.post(EndPointsConfig.HostName + EndPointsConfig.AssemblyParts, { AssemblyID: AssemblyID, ItemID: ItemID, Quantity: Quantity, Active: true, CreatedBy: CreatedBy, CreatedDate: CreatedDate }).map(res => res.json() as AssemblyItem[])
  }
  public DeleteAssembliesItems(parm: number) {
    return this.http.delete(EndPointsConfig.HostName + EndPointsConfig.AssemblyParts + parm, this.pcom.getOptions()).map(res => res.json() as AssemblyItem[])
  }
  public DeleteAssemblyItems(parm: number, AssemblyItemID: number) {
    return this.http.delete(EndPointsConfig.HostName + EndPointsConfig.AssemblyParts + parm + "?AssemblyItemID="+AssemblyItemID, this.pcom.getOptions()).map(res => res.json() as AssemblyItems[])
  }
  public DeleteAssemblies(parm: number) {
    return this.http.delete(EndPointsConfig.HostName + EndPointsConfig.AssemblyEndPoint + parm, this.pcom.getOptions()).map(res => res.json() as Assembly[]);
  }
  GetItemsBySearchParam(IsItemOrAssembly: string, AssemblyID: number, ProductLineID: number, SearchParam: string): Observable<Item[]> {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.ItemSearchEndPoint + "?IsItemOrAssembly=" + IsItemOrAssembly + "&AssemblyID=" + AssemblyID + "&ProductLineID=" + ProductLineID + "&SearchParam=" + SearchParam, this.pcom.getOptions()).map(res => res.json() as Item[]);
  }
  GetItemsSearchParam(IsItemOrAssembly: string, ProductLineID: number, SearchParam: string): Observable<AssemblyItems[]> {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.ItemSearchEndPoint + "?IsItemOrAssembly=" + IsItemOrAssembly + "&ProductLineID=" + ProductLineID + "&SearchParam=" + SearchParam, this.pcom.getOptions()).map(res => res.json() as AssemblyItems[]);
  }
  UpdateItemQty(AssemblyItem: any): Observable<AssemblyItem> {
    return this.http.put(EndPointsConfig.HostName + EndPointsConfig.AssemblyParts + AssemblyItem.AssemblyID, this.pcom.generateBody(AssemblyItem), this.pcom.getOptions()).map(res => res.json() as AssemblyItem);
  }
  UpdateAsblyItemQty(AssemblyItem: any): Observable<AssemblyItems> {
    return this.http.put(EndPointsConfig.HostName + EndPointsConfig.AssemblyParts + AssemblyItem.ItemID, this.pcom.generateBody(AssemblyItem), this.pcom.getOptions()).map(res => res.json() as AssemblyItems);
  }

  /** End Assemblies */

  /**==============================================================* Start Report *========================================================================== */
  public GetLDRReportData(FromDate: string, ToDate: string, TxDot: string, CustomerID: number, DevisioLst: string) {
    return this.http.post(EndPointsConfig.HostName + EndPointsConfig.LDREndPoint, { FromDate: FromDate, ToDate: ToDate, TxDOT: TxDot, CustomerID: CustomerID, DivisionList: DevisioLst.toString() }).map(res => res.json() as LettingDateReportData[])
  }

  public GetPCRReportData(FromDate: string, ToDate: string, ProjectID: number, DevisioLst: string) {
    return this.http.post(EndPointsConfig.HostName + EndPointsConfig.PCREndPoint, { FromDate: FromDate, ToDate: ToDate, ProjectID: ProjectID, DivisionList: DevisioLst.toString() }).map(res => res.json() as ProjectCostingReportData[])
  }

  public GetSubCategories(parm: string) {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.ProjectSubCategories + parm, this.pcom.getOptions()).map(res => res.json() as ProjectSubCategories[]);
  }

  /**==============================================================* Phase *================================ */
  public GetPhase() {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.PhaseEndPoint, this.pcom.getOptions()).map(res => res.json() as Phase[]);
  }
  /***==================================================================ProcessRunControl============================================================= */
  public GetProcessRunControl() {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.ProcessRunControlEndPoint, this.pcom.getOptions()).map(res => res.json() as ProcessRunControl[]);
  }
  public GetProcessDataByRunCtrlID(parm: string) {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.ProcessRunControlEndPoint + parm, this.pcom.getOptions()).map(res => res.json() as ProcessRunControlDataByPrcsID[]);
  }
  /***=============================================== Notifications ===============================================***/
  public GetNotifications() {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.NotificationEndPoint, this.pcom.getOptions()).map(res => res.json() as Notification[]);
  }
  /***=============================================== Awarded Quote Report ===============================================***/
  public GetAllAwardedQuoteReportList() {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.AwardedQuoteReportEndPoint, this.pcom.getOptions()).map(res => res.json() as AwardedQuoteReport[]);
  }

  public ExportAwardedQuoteReport(QuoteRpt: any): Observable<string> {
    return this.http.post(EndPointsConfig.HostName + EndPointsConfig.AwardedQuoteReportEndPoint, this.pcom.generateBody(QuoteRpt), this.pcom.getOptions()).map(res => res.json() as string)
  }
  public PDFAwardedReport(QuoteRpt: any): Observable<string> {
    return this.http.post(EndPointsConfig.HostName + EndPointsConfig.PDFAwardedReportEndPoint, this.pcom.generateBody(QuoteRpt), this.pcom.getOptions()).map(res => res.json() as string)
  }
    /***=============================================== Syspro Budget Report ===============================================***/
    public GetSysproBudgetReport() {
      return this.http.get(EndPointsConfig.HostName + EndPointsConfig.SysproBudgetReportEndPoint, this.pcom.getOptions()).map(res => res.json() as SysproBudgetReport[]);
    }
    public ExportSysproBudgetReport(QuoteRpt: any): Observable<string> {
      console.log(QuoteRpt)
      return this.http.post(EndPointsConfig.HostName + EndPointsConfig.SysproBudgetReportEndPoint, this.pcom.generateBody(QuoteRpt), this.pcom.getOptions()).map(res => res.json() as string)
    }
    public PDFSysproBudgetReport(QuoteRpt: any): Observable<string> {
      return this.http.post(EndPointsConfig.HostName + EndPointsConfig.PDFSysproBudgetReportEndPoint, this.pcom.generateBody(QuoteRpt), this.pcom.getOptions()).map(res => res.json() as string)
    }
  /***=============================================== Quote Report ===============================================***/
  public GetAllQuoteReport() {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.QuoteReportEndPoint, this.pcom.getOptions()).map(res => res.json() as QuoteReport[]);
  }
  public ExportQuoteReport(QuoteRpt: any): Observable<string> {
    return this.http.post(EndPointsConfig.HostName + EndPointsConfig.QuoteReportEndPoint, this.pcom.generateBody(QuoteRpt), this.pcom.getOptions()).map(res => res.json() as string)
  }
  public PDFQuoteReport(QuoteRpt: any): Observable<string> {
    return this.http.post(EndPointsConfig.HostName + EndPointsConfig.PDFQuotesReportEndPoint, this.pcom.generateBody(QuoteRpt), this.pcom.getOptions()).map(res => res.json() as string)
  }
  /***=============================================== Quotes by Contact Report ===============================================***/
  public GetAllQuotesbyContactReport() {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.QuotesbyContactReportEndPoint, this.pcom.getOptions()).map(res => res.json() as QuotesbyContactReport[]);
  }
  public ExportQuotesbyContactReport(QuoteRpt: any): Observable<string> {
    return this.http.post(EndPointsConfig.HostName + EndPointsConfig.QuotesbyContactReportEndPoint, this.pcom.generateBody(QuoteRpt), this.pcom.getOptions()).map(res => res.json() as string)
  }
  public PDFQuotesbyContactReport(QuoteRpt: any): Observable<string> {
    return this.http.post(EndPointsConfig.HostName + EndPointsConfig.PDFQuotesbyContactReportEndPoint, this.pcom.generateBody(QuoteRpt), this.pcom.getOptions()).map(res => res.json() as string)
  }
  /***=============================================== Quotes by Contact Report ===============================================***/
  public GetAllQuotesbyVendorReport() {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.QuotesbyVendorReportEndPoint, this.pcom.getOptions()).map(res => res.json() as QuotesbyVendorReport[]);
  }
  public ExportQuotesbyVendorReport(QuoteRpt: any): Observable<string> {
    return this.http.post(EndPointsConfig.HostName + EndPointsConfig.QuotesbyVendorReportEndPoint, this.pcom.generateBody(QuoteRpt), this.pcom.getOptions()).map(res => res.json() as string)
  }
  public PDFQuotesbyVendorReport(QuoteRpt: any): Observable<string> {
    return this.http.post(EndPointsConfig.HostName + EndPointsConfig.PDFQuotesbyVendorReportEndPoint, this.pcom.generateBody(QuoteRpt), this.pcom.getOptions()).map(res => res.json() as string)
  }
  /***=============================================== Change Orders Report ===============================================***/
  public GetAllChangeOrderReportList() {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.ChangeOrderReportEndPoint, this.pcom.getOptions()).map(res => res.json() as ChangeOrderReport[]);
  }
  public ExportChangeOrderReport(QuoteRpt: any): Observable<string> {
    return this.http.post(EndPointsConfig.HostName + EndPointsConfig.ChangeOrderReportEndPoint, this.pcom.generateBody(QuoteRpt), this.pcom.getOptions()).map(res => res.json() as string)
  }
  public PDFChangeOrderReport(QuoteRpt: any): Observable<string> {
    return this.http.post(EndPointsConfig.HostName + EndPointsConfig.PDFChangeOrderReportEndPoint, this.pcom.generateBody(QuoteRpt), this.pcom.getOptions()).map(res => res.json() as string)
  }

  /***=============================================== ContactsReport ===============================================***/
  public GetAllContactsReportList() {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.ContactsReportEndPoint, this.pcom.getOptions()).map(res => res.json() as ContactsReport[]);
  }
  public ExportContactReport(QuoteRpt: any): Observable<string> {
    return this.http.post(EndPointsConfig.HostName + EndPointsConfig.ContactsReportEndPoint, this.pcom.generateBody(QuoteRpt), this.pcom.getOptions()).map(res => res.json() as string)
  }
  public PDFContactReport(QuoteRpt: any): Observable<string> {
    return this.http.post(EndPointsConfig.HostName + EndPointsConfig.PDFContactReportEndPoint, this.pcom.generateBody(QuoteRpt), this.pcom.getOptions()).map(res => res.json() as string)
  }
  /***=============================================== Specified Entities Report ===============================================***/
  public GetAllSpecifiedEntitiesReportList() {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.SpecifiedEntitiesReportEndPoint, this.pcom.getOptions()).map(res => res.json() as SpecifiedEntitiesReport[]);
  }
  public ExportSpeciedEntitiesReport(QuoteRpt: any): Observable<string> {
    return this.http.post(EndPointsConfig.HostName + EndPointsConfig.SpecifiedEntitiesReportEndPoint, this.pcom.generateBody(QuoteRpt), this.pcom.getOptions()).map(res => res.json() as string)
  }
  public PDFSpecifiedEntitiesReport(QuoteRpt: any): Observable<string> {
    return this.http.post(EndPointsConfig.HostName + EndPointsConfig.PDFSpecifiedEntitiesReportEndPoint, this.pcom.generateBody(QuoteRpt), this.pcom.getOptions()).map(res => res.json() as string)
  }
  /***=============================================== Product Assembly line Items Reports ===============================================***/
  public GetAllProductAsmblitemReportList() {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.ProductAssemblylineItemsReportsEndPoint, this.pcom.getOptions()).map(res => res.json() as ProductAsmblitemReport[]);
  }
  public ExportProductAssemblyitemReport(QuoteRpt: any): Observable<string> {
    return this.http.post(EndPointsConfig.HostName + EndPointsConfig.ProductAssemblylineItemsReportsEndPoint, this.pcom.generateBody(QuoteRpt), this.pcom.getOptions()).map(res => res.json() as string)
  }
  /***=============================================== Product Assembly line Items Reports ===============================================***/
  public GetAllProductlineItemsReportList() {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.ProductlineItemsReportsEndPoint, this.pcom.getOptions()).map(res => res.json() as ProductlineItemsReport[]);
  }
  public ExportProductitemReport(QuoteRpt: any): Observable<string> {
    return this.http.post(EndPointsConfig.HostName + EndPointsConfig.ProductlineItemsReportsEndPoint, this.pcom.generateBody(QuoteRpt), this.pcom.getOptions()).map(res => res.json() as string)
  }
  public PDFProductlineitemReport(QuoteRpt: any): Observable<string> {
    return this.http.post(EndPointsConfig.HostName + EndPointsConfig.PDFProductlineitemReportEndPoint, this.pcom.generateBody(QuoteRpt), this.pcom.getOptions()).map(res => res.json() as string)
  }
  /***=============================================== Dashboard ===============================================***/
  public GetQuickStats() {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.DashboardQuickStatEndPoint, this.pcom.getOptions()).map(res => res.json() as DashboardQuickStats[]);
  }
  // public GetActiveQuotesByMonth() {
  //   return this.http.get(EndPointsConfig.HostName + EndPointsConfig.DashboardQuoteByMonth, this.pcom.getOptions()).map(res => res.json() as QuoteByMonth[]);
  // }
  public GetActiveQuotesByMonth(param: any) {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.DashboardQuoteByMonth + "?month=" + param.Month + "&year=" + param.Year + "&quarter=" + param.Quarter + "&type=" + param.Type, this.pcom.getOptions()).map(res => res.json() as QuoteByMonth[]);
  }
  public GetActiveAwardByPeriod(param: any) {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.DashboardAwardByMonth + "?month=" + param.Month + "&year=" + param.Year + "&quarter=" + param.Quarter + "&type=" + param.Type, this.pcom.getOptions()).map(res => res.json() as AwardByMonth[]);
  }
  public GetActiveQuotesByContract(param: any) {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.DashboardQuoteByContract + "?month=" + param.Month + "&year=" + param.Year + "&quarter=" + param.Quarter + "&type=" + param.Type, this.pcom.getOptions()).map(res => res.json() as QuotesByContract[]);
  }
  public GetActiveQuotesByState(param: any) {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.DashboardQuoteByContract + "?month=" + param.Month + "&year=" + param.Year + "&quarter=" + param.Quarter + "&type=" + param.Type, this.pcom.getOptions()).map(res => res.json() as QuotesByState[]);
  }
  public GetRevenueByDivision() {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.DashboardRevenueByDivision, this.pcom.getOptions()).map(res => res.json() as RevenueByDivision[]);
  }
  public GetDivisionsByState(Entity: any) {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.DashboardDivisionsByState + "?LettingFromDate=" + Entity.LettingFromDate + "&LettingToDate=" + Entity.LettingToDate, this.pcom.getOptions()).map(res => res.json() as DivisionsByState[]);
  }
  // **********=================quote by control no================********
  public PDFQuoteReportbycontrolno(QuoteRpt: any): Observable<string> {
    return this.http.post(EndPointsConfig.HostName + EndPointsConfig.PDFQuotesReportbyControlNumberControllerEndPoint, this.pcom.generateBody(QuoteRpt), this.pcom.getOptions()).map(res => res.json() as string)
  }
   public GetAllQuoteReportbycontrolno() {
     return this.http.get(EndPointsConfig.HostName + EndPointsConfig.QuotesReportbyControlNumberEndPoint, this.pcom.getOptions()).map(res => res.json() as QuoteReport[]);
   }
}

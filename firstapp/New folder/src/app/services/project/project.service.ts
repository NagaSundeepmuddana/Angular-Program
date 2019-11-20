import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { EndPointsConfig } from "../../../models/endpointsconfig";
import { PrimcomService } from "../utilities/primcom.service";
import { Customer, CustomerOfficeContacts } from "../../../models/customers";
import { Observable } from "rxjs/Observable";
import { Division } from "../../../models/division";
import { LettingDateReportData } from "../../../models/lettingdatereportdata";
import { ProjectCostingReportData } from '../../../models/projectcostingreportdata';
import { Project, States, County, Item, ItemAssemblySearchResult, AssemblyList, ProjectItem, ProjectAssembly, ProjectDivisions, CustomerQuotes, QuoteCustomerInfo, ReplicateMQuote, CustomerDivisions, CountyCustomer, DivisionsItems, DivisionNotes, DivisionTermsNConditions, AssociateTermsNConditions, EmailProposalContacts, ProjectComments, ReOrderProjectItems, ProductLineQuote, QuoteSearch } from '../../../models/project';
import { Notes } from '../../../models/Notes';
import { TermsAndCondition } from '../../../models/TermsAndConditions';
import { Freight } from '../../../models/Freight';
import { salesRepresentative } from "../../../models/salesRepresentative";
import { ProjectCategories, ProjectSubCategories } from '../../../models/projectcatagories';
import { customercontact } from "../../../models/customers";
import { ProductLines, ProductLineItems, ProductLineNotes, AssociateNotes } from '../../../models/ProductLines';
import { Items } from '../../../models/Items';
import { Assembly, AssemblyItem } from '../../../models/Assembly';
import { EmailHistory } from '../../../models/EmailHistory';
import { LockHistory, QuoteLockHistory } from '../../../models/ProjectLock';
import { QuotesItems, QuotesNotes, QuotesTerms, Quote,Lostjob,Customersearch, ItemQuotesearch,QuoteItemUpdate, BatchQuotes ,ReOrderQuotesNotes,GetallLostCustomer} from '../../../models/Quotes';
import { ProjectStaging, ProjectStagingItems } from '../../../models/Staging';

@Injectable()
export class ProjectService {
  ProjectList: Project[];
  ProjectItemList: ProjectItem[];
  ProjectAssemblyList: ProjectAssembly[];
  ProjectDivisionList: ProjectDivisions[];
  public CustomersList: Customer[] = [];
  public DivisionList: Division[] = [];
  public AssociateNotesList: AssociateNotes[] = [];
  public ProductLineNotesList: ProductLineNotes[] = [];
  public DivisionsItemsList: DivisionsItems[] = [];
  public DivisionNotesList: DivisionNotes[] = [];
  public DivisionTermsNConditionsList: DivisionTermsNConditions[] = [];
  public AssociateTermsNConditionsList: AssociateTermsNConditions[] = [];
  public QuoteCustomerInfo: QuoteCustomerInfo;
  public GetallLostCustomer: GetallLostCustomer;
  QuotesItemsList: QuotesItems[] = [];
  QuotesNotesList: QuotesNotes[] = [];
  QuotesTermsList: QuotesTerms[] = [];
  public StagingProjectList: ProjectStaging[] = [];
  public ProjectStagingItemsList: ProjectStagingItems[] = [];
  constructor(private http: Http, private pcom: PrimcomService) {
    //Get Customers Data
  }

  GetAllProjects(): Observable<Project[]> {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.ProjectsEndPoint, this.pcom.getOptions()).map(res => res.json() as Project[]);
  }

  GetProjectById(parm: number): Observable<Project> {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.ProjectsEndPoint + parm, this.pcom.getOptions()).map(res => res.json() as Project);
  }

  AddProject(project: any): Observable<Project> {
    return this.http.post(EndPointsConfig.HostName + EndPointsConfig.ProjectsEndPoint, this.pcom.generateBody(project), this.pcom.getOptions()).map(res => res.json() as Project);
  }

  UpdateProject(project: any): Observable<Project> {
    console.log(project);
    return this.http.put(EndPointsConfig.HostName + EndPointsConfig.ProjectsEndPoint + project.ProjectID, this.pcom.generateBody(project), this.pcom.getOptions()).map(res => res.json() as Project);
  }

  DeleteProject(parm: number) {
    return this.http.delete(EndPointsConfig.HostName + EndPointsConfig.ProjectsEndPoint + parm, this.pcom.getOptions()).map(res => res.json() as string);
  }

  GetFilteredProjects(ContractTypeID: any, ProjectName: string, ProjectNumber: string, ControlNumber: string, FromDate: string, ToDate: string, Status: boolean, State: string, County: any) {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.ProjectsEndPoint + "?contracttype=" + ContractTypeID + "&projectname=" + ProjectName + "&ControlNumber=" + ControlNumber + "&ProjectNumber=" + ProjectNumber + "&LettingFromDt=" + FromDate + "&LettingToDt=" + ToDate + "&status=" + Status + "&State=" + State + "&County=" + County, this.pcom.getOptions()).map(res => res.json() as Project[]);
  }

  AddProjectComments(Comments: any): Observable<ProjectComments> {
    return this.http.post(EndPointsConfig.HostName + EndPointsConfig.CommentsEndPoint, this.pcom.generateBody(Comments), this.pcom.getOptions()).map(res => res.json() as ProjectComments);
  }

  GetProjectComments(parm: number): Observable<ProjectComments[]> {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.CommentsEndPoint + parm, this.pcom.getOptions()).map(res => res.json() as ProjectComments[]);
  }

  GetProjectItems(parm: number): Observable<ProjectItem[]> {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.ProjectItems + parm, this.pcom.getOptions()).map(res => res.json() as ProjectItem[]);
  }

  GetProjectItemsByDivOrPLID(PID: number, DID: number, PLID: number): Observable<ProjectItem[]> {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.ProjectItems + PID + "?DivisionID=" + DID + "&ProductLineID=" + PLID, this.pcom.getOptions()).map(res => res.json() as ProjectItem[]);
  }

  UpdateProjectItems(ProjectItems: any): Observable<ProjectItem> {
    return this.http.put(EndPointsConfig.HostName + EndPointsConfig.ProjectItems + ProjectItems.ProjectID, this.pcom.generateBody(ProjectItems), this.pcom.getOptions()).map(res => res.json() as ProjectItem);
  }

  AddProjectItem(ProjectItems: any): Observable<ProjectItem> {
    return this.http.post(EndPointsConfig.HostName + EndPointsConfig.ProjectItems, this.pcom.generateBody(ProjectItems), this.pcom.getOptions()).map(res => res.json() as ProjectItem);
  }

  AddProjectItemByassembly(ProjectAssembly: any): Observable<AssemblyItem> {
    return this.http.put(EndPointsConfig.HostName + EndPointsConfig.ProjectAssembly + ProjectAssembly.AssemblyID, this.pcom.generateBody(ProjectAssembly), this.pcom.getOptions()).map(res => res.json() as AssemblyItem);
  }

  DeleteProjectItem(ProjectID: number, ItemID: number, user: string) {
    return this.http.delete(EndPointsConfig.HostName + EndPointsConfig.ProjectItems + ProjectID + "?ItemID=" + ItemID + "&user=" + user, this.pcom.getOptions()).map(res => res.json() as ProjectItem);
  }

  GetProjectAssembly(parm: number): Observable<ProjectAssembly[]> {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.ProjectAssembly + parm, this.pcom.getOptions()).map(res => res.json() as ProjectAssembly[]);
  }

  PutProjectAssembly(ProjectID: number, AssemblyID: string, Active: boolean, CreatedBy: string, CreatedDate: Date, LastModifiedBy: string, LastModifiedDate: Date) {
    return this.http.put(EndPointsConfig.HostName + EndPointsConfig.ProjectAssembly + ProjectID, { ProjectID: ProjectID, AssemblyID: AssemblyID, Active: true, CreatedBy: "Basanta", CreatedDate: CreatedDate, LastModifiedBy: "Basanta", LastModifiedDate: LastModifiedDate }).map(res => res.json() as ProjectAssembly[])
  }

  public GetAllAssemblies() {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.AssemblyEndPoint, this.pcom.getOptions()).map(res => res.json() as Assembly[]);
  }

  GetProjectDivisions(parm: number): Observable<ProjectDivisions[]> {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.ProjectDivisions + parm, this.pcom.getOptions()).map(res => res.json() as ProjectDivisions[]);
  }

  public GetCustomerByDivision(CustomerID: number, DivisionID: number) {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.CustomerDivEndPoint + CustomerID + "?DivisionID=" + DivisionID, this.pcom.getOptions()).map(res => res.json() as CustomerDivisions[]);
  }

  public GetCustomerByProductLine(ProductLineID: number, ProjectID: number, DivisionID: number) {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.ProductLineQuotesEndPoint + ProductLineID + "?ProjectID=" + ProjectID + "&DivisionID=" + DivisionID, this.pcom.getOptions()).map(res => res.json() as ProductLineQuote[]);
  }

  public GetCustomerByProjectCounty(pCountyID: number, ProductLineID: number, ProjectID: number, DivisionID: number) {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.CountyCustomerEndPoint + pCountyID + "?ProductLineID=" + ProductLineID + "&ProjectID=" + ProjectID + "&DivisionID=" + DivisionID, this.pcom.getOptions()).map(res => res.json() as CountyCustomer[]);
  }

  PutDivisionCustomerMap(DivisionID: number, CustomerID: string, Active: boolean, CreatedBy: string, CreatedDate: Date, LastModifiedBy: string, LastModifiedDate: Date) {
    return this.http.put(EndPointsConfig.HostName + EndPointsConfig.CustomerDivEndPoint + DivisionID, { DivisionID: DivisionID, CustomerID: CustomerID, Active: true, CreatedBy: "Basanta", CreatedDate: new Date(Date.now()), LastModifiedBy: "Basanta", LastModifiedDate: new Date(Date.now()) }).map(res => res.json() as ProjectItem[])
  }

  public GetCustomerOfficeContactsById(parm: number) {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.CustomerOfficeContactEndpoint + parm, this.pcom.getOptions()).map(res => res.json() as CustomerOfficeContacts[]);
  }

  ReplicateMasterQuote(QuoteID: number, CustomerOfcID: string, User: string, ProductLine: number, ProjectID: number) {
    return this.http.put(EndPointsConfig.HostName + EndPointsConfig.QuoteCustomerInfo + QuoteID, { QuoteID: QuoteID, CustomerOfcID: CustomerOfcID, User: User, ProductLine: ProductLine, ProjectID: ProjectID }).map(res => res.json() as ReplicateMQuote[])
  }

  public GetEmailHistory(ProjectID: number, QuoteID: number) {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.EmailHistoryEndPoint + ProjectID + "?QuoteID=" + QuoteID, this.pcom.getOptions()).map(res => res.json() as EmailHistory[]);
  }

  public GetEmailProposalContacts(ProjectID: number, QuoteID: number) {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.EmailHistoryEndPoint + "?ProjectID=" + ProjectID + "&QuoteID=" + QuoteID, this.pcom.getOptions()).map(res => res.json() as EmailProposalContacts[]);
  }
  // public GetEmailProposalContacts(ProjectID: number) {
  //   return this.http.get(EndPointsConfig.HostName + EndPointsConfig.EmailHistoryEndPoint + "?ProjectID=" + ProjectID, this.pcom.getOptions()).map(res => res.json() as EmailProposalContacts[]);
  // }

  public PostEmail(Email: any): Observable<string> {
    return this.http.post(EndPointsConfig.HostName + EndPointsConfig.EmailHistoryEndPoint, this.pcom.generateBody(Email), this.pcom.getOptions()).map(res => res.json() as string);
  }

  public SendEmailProjectLevel(Email: any): Observable<EmailHistory> {
    return this.http.post(EndPointsConfig.HostName + EndPointsConfig.ProjectEmailProposal, this.pcom.generateBody(Email), this.pcom.getOptions()).map(res => res.json() as EmailHistory);
  }


  // PostEmail(ProjectID:number, QID: number, RequestedBy: any):Observable<EmailHistory>{
  //   return this.http.post(EndPointsConfig.HostName+EndPointsConfig.EmailHistoryEndPoint, {ProjectID: ProjectID, QuoteID: QID, RequestedBy: RequestedBy  }).map(res => res.json() as EmailHistory)
  // }

  GetQuoteCustomer(QuoteID: number, Version: number): Observable<QuoteCustomerInfo> {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.QuoteCustomerInfo + QuoteID + "?Version=" + Version, this.pcom.getOptions()).map(res => res.json() as QuoteCustomerInfo);
  }

  DeleteQuoteCustomer(parm: number, user: string) {
    return this.http.delete(EndPointsConfig.HostName + EndPointsConfig.ProjectDivisions + parm + "?user=" + user, this.pcom.getOptions()).map(res => res.json() as CustomerQuotes);
  }

  GetItemsByDivision(parm: number): Observable<DivisionsItems[]> {
    if (this.DivisionsItemsList.length > 0) {
      return Observable.of(this.DivisionsItemsList);
    } else {
      return this.http.get(EndPointsConfig.HostName + EndPointsConfig.DivisionItemsEndPoint + parm, this.pcom.getOptions()).map(res => res.json() as DivisionsItems[]);
    }
  }

  GetItemsByProductLine(PLId: number): Observable<ProductLineItems[]> {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.ProductLinesItems + PLId, this.pcom.getOptions()).map(res => res.json() as ProductLineItems[]);
  }

  GetItemsBySearchParam(IsItemOrAssembly: string, ProjectID: number, QuoteID: number, ProductLineID: number, DivisionID: number, SearchParam: string): Observable<ItemAssemblySearchResult[]> {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.ItemAssemblyEndPoint + "?IsItemOrAssembly=" + IsItemOrAssembly + "&ProjectID=" + ProjectID + "&QuoteID=" + QuoteID + "&ProductLineID=" + ProductLineID + "&DivisionID=" + DivisionID + "&SearchParam=" + SearchParam, this.pcom.getOptions()).map(res => res.json() as ItemAssemblySearchResult[]);
  }

  GetAssemblyBySearchParam(IsItemOrAssembly: string, ProjectID: number, QuoteID: number, ProductLineID: number, SearchParam: string): Observable<AssemblyList[]> {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.ItemAssemblyEndPoint + "?IsItemOrAssembly=" + IsItemOrAssembly + "&ProjectID=" + ProjectID + "&QuoteID=" + QuoteID + "&ProductLineID=" + ProductLineID + "&SearchParam=" + SearchParam, this.pcom.getOptions()).map(res => res.json() as AssemblyList[]);
  }

  public GetAssembliesBySearchParam(AltDescription: string, AssemblyNo: string, Description: string, Name: string, status: boolean): Observable<AssemblyList[]> {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.AssemblyEndPoint + "?AltDescription=" + AltDescription + "&AssemblyNo=" + AssemblyNo + "&Name=" + Name + "&status=" + status, this.pcom.getOptions()).map(res => res.json() as AssemblyList[]);
  }

  GetNotesByDivision(parm: number): Observable<DivisionNotes[]> {
    if (this.DivisionNotesList.length > 0) {
      return Observable.of(this.DivisionNotesList);
    } else {
      return this.http.get(EndPointsConfig.HostName + EndPointsConfig.DivisionNoteEndPoint + parm, this.pcom.getOptions()).map(res => res.json() as DivisionNotes[]);
    }
  }

  GetNotesByProductLine(ProductLineID: number, QuoteID: number): Observable<ProductLineNotes[]> {
    if (this.ProductLineNotesList.length > 0) {
      return Observable.of(this.ProductLineNotesList);
    } else {
      return this.http.get(EndPointsConfig.HostName + EndPointsConfig.ProductLineNotes + ProductLineID + "?QuoteID=" + QuoteID, this.pcom.getOptions()).map(res => res.json() as ProductLineNotes[]);
    }
  }

  GetNotesForAssociate(QuoteID: number): Observable<AssociateNotes[]> {
    if (this.ProductLineNotesList.length > 0) {
      return Observable.of(this.ProductLineNotesList);
    } else {
      return this.http.get(EndPointsConfig.HostName + EndPointsConfig.ProductLineNotes + QuoteID, this.pcom.getOptions()).map(res => res.json() as AssociateNotes[]);
    }
  }

  AssociateQuoteNotes(QuotesNotes: any): Observable<QuotesNotes> {
    return this.http.post(EndPointsConfig.HostName + EndPointsConfig.QuoteNotesEndPoint, this.pcom.generateBody(QuotesNotes), this.pcom.getOptions()).map(res => res.json() as QuotesNotes);
  }

  AddCustomeQuoteNotes(QuotesNotes: any): Observable<QuotesNotes> {
    return this.http.put(EndPointsConfig.HostName + EndPointsConfig.QuoteNotesEndPoint + 0, this.pcom.generateBody(QuotesNotes), this.pcom.getOptions()).map(res => res.json() as QuotesNotes);
  }

  GetTermsByDivision(parm: number): Observable<DivisionTermsNConditions[]> {
    if (this.DivisionTermsNConditionsList.length > 0) {
      return Observable.of(this.DivisionTermsNConditionsList);
    } else {
      return this.http.get(EndPointsConfig.HostName + EndPointsConfig.DivisionTermsNConditionEndPoint + parm, this.pcom.getOptions()).map(res => res.json() as DivisionTermsNConditions[]);
    }
  }

  GetAssociateTerms(DivID: number, QuoteID: number): Observable<AssociateTermsNConditions[]> {
    if (this.AssociateTermsNConditionsList.length > 0) {
      return Observable.of(this.AssociateTermsNConditionsList);
    } else {
      return this.http.get(EndPointsConfig.HostName + EndPointsConfig.DivisionTermsNConditionEndPoint + DivID + "?QuoteID=" + QuoteID, this.pcom.getOptions()).map(res => res.json() as AssociateTermsNConditions[]);
    }
  }

  GetItemsByQuote(QuoteID: number, Version: number): Observable<QuotesItems[]> {
    // if (this.QuotesItemsList.length > 0) {
    //   return Observable.of(this.QuotesItemsList);
    // } else {
      return this.http.get(EndPointsConfig.HostName + EndPointsConfig.QuoteItemsEndPoint + QuoteID + "?Version=" + Version, this.pcom.getOptions()).map(res => res.json() as QuotesItems[]);
    //}
  }

  PutQuoteItems(QuoteID: number, ItemsID: string, Active: boolean, CreatedBy: string, CreatedDate: Date, LastModifiedBy: string, LastModifiedDate: Date) {
    return this.http.post(EndPointsConfig.HostName + EndPointsConfig.QuoteItemsEndPoint, { QuoteID: QuoteID, ItemID: ItemsID, Active: true, CreatedBy: "Basanta", CreatedDate: CreatedDate, LastModifiedBy: "Basanta", LastModifiedDate: LastModifiedDate }).map(res => res.json() as QuotesItems)
  }

  AddQuoteItems(QuoteItems: any): Observable<string> {
    return this.http.post(EndPointsConfig.HostName + EndPointsConfig.QuoteItemsEndPoint, this.pcom.generateBody(QuoteItems), this.pcom.getOptions()).map(res => res.json() as string);
  }

  UpdateQuoteItems(QuoteItems: any): Observable<string> {
    return this.http.put(EndPointsConfig.HostName + EndPointsConfig.QuoteItemsEndPoint + QuoteItems.QuoteItemsID, this.pcom.generateBody(QuoteItems), this.pcom.getOptions()).map(res => res.json() as string);
  }

  DeleteQuoteItems(parm: number, user: string): Observable<string> {
    return this.http.delete(EndPointsConfig.HostName + EndPointsConfig.QuoteItemsEndPoint + parm + "?user=" + user, this.pcom.getOptions()).map(res => res.json() as string);
  }


  GetNotesByQuote(QuoteID: number, Version: number): Observable<QuotesNotes[]> {
    if (this.QuotesNotesList.length > 0) {
      return Observable.of(this.QuotesNotesList);
    } else {
      return this.http.get(EndPointsConfig.HostName + EndPointsConfig.QuoteNotesEndPoint + QuoteID + "?Version=" + Version, this.pcom.getOptions()).map(res => res.json() as QuotesNotes[]);
    }
  }

  AddNotes(notes: any): Observable<string> {
    return this.http.post(EndPointsConfig.HostName + EndPointsConfig.QuoteNotesEndPoint, this.pcom.generateBody(notes), this.pcom.getOptions()).map(res => res.json() as string);
  }

  UpdateNote(Note: any): Observable<string> {
    return this.http.put(EndPointsConfig.HostName + EndPointsConfig.QuoteNotesEndPoint + Note.QuoteNoteID, this.pcom.generateBody(Note), this.pcom.getOptions()).map(res => res.json() as string);
  }

  DeleteNote(parm: number) : Observable<string> {
    return this.http.delete(EndPointsConfig.HostName + EndPointsConfig.QuoteNotesEndPoint + parm, this.pcom.getOptions()).map(res => res.json() as string);
  }

  GetTermsByQuote(QuoteID: number, Version: number): Observable<QuotesTerms[]> {
    if (this.QuotesTermsList.length > 0) {
      return Observable.of(this.QuotesTermsList);
    } else {
      return this.http.get(EndPointsConfig.HostName + EndPointsConfig.QuoteTermsEndPoint + QuoteID + "?Version=" + Version, this.pcom.getOptions()).map(res => res.json() as QuotesTerms[]);
    }
  }

  SaveQuoteTerms(QuotesTerms: any): Observable<string> {
    return this.http.post(EndPointsConfig.HostName + EndPointsConfig.QuoteTermsEndPoint, this.pcom.generateBody(QuotesTerms), this.pcom.getOptions()).map(res => res.json() as string);
  }

  DeleteQuoteTerms(QuotesTermsID: number): Observable<string> {
    return this.http.delete(EndPointsConfig.HostName + EndPointsConfig.QuoteTermsEndPoint + QuotesTermsID, this.pcom.getOptions()).map(res => res.json() as string);
  }

  //Remove this Method. We are not using Put Method
  PutProjectLock(project: any): Observable<Project> {
    return this.http.put(EndPointsConfig.HostName + EndPointsConfig.ProjectLockEndPoint + project.ProjectID, this.pcom.generateBody(project), this.pcom.getOptions()).map(res => res.json() as Project);
  }

  PostProjectLockHistory(Lock: any): Observable<LockHistory> {
    return this.http.post(EndPointsConfig.HostName + EndPointsConfig.ProjectLockEndPoint, this.pcom.generateBody(Lock), this.pcom.getOptions()).map(res => res.json() as LockHistory);
  }

  UpdatePrimeContractor(Prj: any): Observable<Project> {
    return this.http.put(EndPointsConfig.HostName + EndPointsConfig.ProjectPrimeContractorEndPoint + Prj.ProjectID, this.pcom.generateBody(Prj), this.pcom.getOptions()).map(res => res.json() as Project);
  }

  UpdateQuotePrimeContractor(Quote: any): Observable<QuoteCustomerInfo> {
    return this.http.put(EndPointsConfig.HostName + EndPointsConfig.QuotePrimeContractorEndPoint + Quote.QuoteID, this.pcom.generateBody(Quote), this.pcom.getOptions()).map(res => res.json() as QuoteCustomerInfo);
  }

  // UpdateQuote(QuoteID:number, PhaseID: number, User: string):Observable<Quote>{
  //   return this.http.put(EndPointsConfig.HostName + EndPointsConfig.QuoteEndPoint +QuoteID,{QuoteID: QuoteID, PhaseID: PhaseID, User: User }).map(res => res.json() as Quote);
  // }

  UpdateQuote(Quote: any): Observable<Quote> {
    return this.http.post(EndPointsConfig.HostName + EndPointsConfig.QuoteEndPoint, this.pcom.generateBody(Quote), this.pcom.getOptions()).map(res => res.json() as Quote);
  }

  AwardQuote(AwardQuote: any): Observable<Quote> {
    return this.http.put(EndPointsConfig.HostName + EndPointsConfig.ProductLineQuotesEndPoint + AwardQuote.QuoteID, this.pcom.generateBody(AwardQuote), this.pcom.getOptions()).map(res => res.json() as Quote);
  }
  AwardValueUpdate(AwardQuote: any): Observable<Quote> {
    return this.http.put(EndPointsConfig.HostName + EndPointsConfig.AwardQuoteEndPoint + AwardQuote.QuoteID, this.pcom.generateBody(AwardQuote), this.pcom.getOptions()).map(res => res.json() as Quote);
  }

  LockUnLockQuote(QLock: any): Observable<string> {
    return this.http.put(EndPointsConfig.HostName + EndPointsConfig.QuoteEndPoint + QLock.QuoteID, this.pcom.generateBody(QLock), this.pcom.getOptions()).map(res => res.json() as string);
  }

  BatchLockUnLockQuote(QLock: any): Observable<string> {
    return this.http.put(EndPointsConfig.HostName + EndPointsConfig.QuoteEndPoint + QLock.ProjectID, this.pcom.generateBody(QLock), this.pcom.getOptions()).map(res => res.json() as string);
  }

  LockAllUnlockedQuote(UnlockedQuotes: any): Observable<BatchQuotes> {
    console.log(UnlockedQuotes);
    return this.http.post(EndPointsConfig.HostName + EndPointsConfig.LockAllUnlockedQuotes, this.pcom.generateBody(UnlockedQuotes), this.pcom.getOptions()).map(res => res.json() as BatchQuotes);
  }

  GeneratePDF(PDFProposal: any): Observable<string> {
    return this.http.post(EndPointsConfig.HostName + EndPointsConfig.PDFEndPoint, this.pcom.generateBody(PDFProposal), this.pcom.getOptions()).map(res => res.json() as string);
  }

  GeneratePDFAndEmailToMe(PDFProposal: any): Observable<string> {
    return this.http.post(EndPointsConfig.HostName + EndPointsConfig.SendProposalEmailRequestEndPoint, this.pcom.generateBody(PDFProposal), this.pcom.getOptions()).map(res => res.json() as string);
  }

  GetQuoteVersions(QuoteID: number): Observable<Quote[]> {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.QuoteEndPoint + QuoteID, this.pcom.getOptions()).map(res => res.json() as Quote[]);
  }
  GetQuoteItemForUpdate(QuoteItemsID: number): Observable<QuoteItemUpdate> {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.QuoteItemsUpdateEndPoint + QuoteItemsID, this.pcom.getOptions()).map(res => res.json() as QuoteItemUpdate);
  }

  GetAllStagingProjects(): Observable<ProjectStaging[]> {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.ProjectStagingEndPoint, this.pcom.getOptions()).map(res => res.json() as ProjectStaging[]);
  }

  GetStagingProjectItems(parm: number): Observable<ProjectStagingItems[]> {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.ProjectStagingEndPoint + parm, this.pcom.getOptions()).map(res => res.json() as ProjectStagingItems[]);
  }
  ApprroveStagedProjects(ApproveStagedProject: any): Observable<ProjectStagingItems[]> {
    return this.http.post(EndPointsConfig.HostName + EndPointsConfig.ProjectStagingEndPoint, this.pcom.generateBody(ApproveStagedProject), this.pcom.getOptions()).map(res => res.json() as ProjectStagingItems[]);
  }
  ReOrderItems(ReOrderProjectItems: any): Observable<ReOrderProjectItems[]> {
    return this.http.post(EndPointsConfig.HostName + EndPointsConfig.ReOrderProjectAndQuote, this.pcom.generateBody(ReOrderProjectItems), this.pcom.getOptions()).map(res => res.json() as ReOrderProjectItems[]);
  }
  public GetQuoteLockStatus(parm: number): Observable<QuoteCustomerInfo> {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.QuoteLockStatus + parm, this.pcom.getOptions()).map(res => res.json() as QuoteCustomerInfo);
  }
  GetFilteredQuotes(QuoteNumber: string,Customer:string, ProjectName: string, division: string,State:string,County:string, FromDate: string, ToDate: string, SearchQuoteByMailingList: string) {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.QuotesSearchEndPoint + "?quotenumber=" + QuoteNumber+ "&Customer=" + Customer  + "&projectname=" + ProjectName + "&Division=" + division +"&State=" + State +"&County=" + County +  "&FromDt=" + FromDate + "&ToDt=" + ToDate + "&Mailing=" + SearchQuoteByMailingList, this.pcom.getOptions()).map(res => res.json() as QuoteSearch[]);
  }
  ReOrderNotes(ReOrderQuotesNotes: any): Observable<ReOrderQuotesNotes[]> {
    return this.http.post(EndPointsConfig.HostName + EndPointsConfig.DefaultReOrderNotes, this.pcom.generateBody(ReOrderQuotesNotes), this.pcom.getOptions()).map(res => res.json() as ReOrderQuotesNotes[]);
  }
  LostJobUpdate(LostJobQuote: any): Observable<Lostjob> {
    return this.http.put(EndPointsConfig.HostName + EndPointsConfig.LostJobQuoteEndPoint + LostJobQuote.QuoteID, this.pcom.generateBody(LostJobQuote), this.pcom.getOptions()).map(res => res.json() as Lostjob);
  }   
  /*  public GetCustomers(parm: string) Observable<Customersearch[]>{
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.CustomerSearchEndPoint + parm, this.pcom.getOptions()).map(res => res.json() as Customersearch[]);
  } */
  GetCustomers(parm: string): Observable<Customersearch[]> {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.CustomerSearchEndPoint + "?Name="+parm, this.pcom.getOptions()).map(res => res.json() as Customersearch[]);
  }
  GetCustomers1(parm: string): Observable<ItemQuotesearch[]> {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.ItemSearchByquotehistEndPoint + "?Name="+parm, this.pcom.getOptions()).map(res => res.json() as ItemQuotesearch[]);
  }
  
  GetLostCustomers(QuoteID: number): Observable<GetallLostCustomer> {
    return this.http.get(EndPointsConfig.HostName + EndPointsConfig.LostCustomerEndPoint + QuoteID , this.pcom.getOptions()).map(res => res.json() as GetallLostCustomer);
  }

  /* AddTripreport(Trip: any): Observable<string> {
    return this.http.put(EndPointsConfig.HostName + EndPointsConfig.TripReportEndPoint, this.pcom.generateBody(Trip), this.pcom.getOptions()).map(res => res.json() as string);
  }
 */
  AddTripreport(Trip: any): Observable<string> {
   // return this.http.put(EndPointsConfig.HostName + EndPointsConfig.TripReportEndPoint, this.pcom.generateBody(Trip), this.pcom.getOptions()).map(res => res.json() as string);
    return this.http.post(EndPointsConfig.HostName + EndPointsConfig.TripReportEndPoint, this.pcom.generateBody(Trip), this.pcom.getOptions()).map(res => res.json() as string);
  }
  AddprojectMessage(Project: any): Observable<string> {
       return this.http.post(EndPointsConfig.HostName + EndPointsConfig.MessageChannelEndPoint, this.pcom.generateBody(Project), this.pcom.getOptions()).map(res => res.json() as string);
   }
}

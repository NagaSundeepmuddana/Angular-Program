export class Project {
    ProjectID: number;
    ContractTypeID: number;
    ContractName: string;
    StateID: string;
    StateName: string;
    CountyID: number;
    CountyName: string;
    Locked: boolean;
    ProjectName: string;
    ProjectNumber: string;
    Highway: string;
    Length?: number;
    ControlNumber: string;
    DBEGoal?: number;
    LettingDate: Date;
    Type: string;
    WorkingDays?: number;
    Architect: string;
    ExternalSystemRefNo: string;
    Version: number;
    PVersion: number;
    PhoneNo: string;
    TimeForCompletion?: number;
    Guaranty?: any;
    EstimatedCost?: any;
    BidsReceivedUntil?: Date;
    BidsWillBeOpened?: Date;
    DeliverBidsTo: string;
    PSEContact: string;
    Active: boolean;
    CreatedBy: string;
    PCreatedBy: string;
    CreatedDate: Date; //Date;
    LastModifiedBy: string;
    LastModifiedDate?: Date;// Date;
    BusinessManager: string;
    BMEmail: string;
    UnlockedBy: string;
    UnlockedDate: Date;
    QuoteCustomerCount: number;
    PItemsCount: number;
    PrimeContractor: string;
}

export class ProjCategory {
    CategoryID: number;
    CategoryName: string;
    Active: boolean;
    CreatedBy: string;
    CreatedDate: string;
    LastModifiedBy: string;
    LastModifiedDate: string
}
export class ProjSubCategory {
    SubCategoryID: number;
    CategoryID: number;
    SubCategoryName: string;
    Active: boolean;
    CreatedBy: string;
    CreatedDate: string;
    LastModifiedBy: string;
    LastModifiedDate: string
}

export class Division {
    ID: number;
    ProjectID: number;
    ProjectName: string;
    ProjectItem: ProjectItem[];
    Name: string;
    Description: string;
    SubAccount: string;
    Active: boolean;
    expanded?: boolean;
}

export class ProjectItem {
    ProductLineID: number;
    ProductLine: string;
    ItemID: number;
    Type: string;
    //AssemblyID?: number;
    //AssemblyNo: string;
    ItemCode: string;
    OrderNumber: number;
    AltCode: string;
    Description: string;
    Quantity: number;
    UOMID: number;
    UOM: string;
    ApproxQuantity: number;
    Weight: number;
    UnitPrice: string;
    ListPrice: string;
    Amount: string;
    ProjectID: number;
    ProjectItemID: number;
    CreatedDate: Date;
}
export class ItemAssemblySearchResult {
    ItemID: number;
    Type: string;
    Name: string;
    ItemCode: string;
}
export class Item {
    ItemID: number;
    ProductLineID: number;
    ProductLine: string;
    ItemCode: string;
    AltCode: string;
    DESCode: string;
    Description: string;
    UOM: string;
    ApproxQuantity: string;
    BidPrice: string;
    Amount: string;
    Weight: string;
    UnitPrice: string;
    ListPrice: string;
    Active: boolean;
    CreatedBy: string;
    CreatedDate: Date;
    LastModifiedBy: string;
    LastModifiedDate: Date;
}
export class AssemblyList {
    AssemblyID: number;
    Name: string;
    AssemblyNo: string;
    AltDescription: string;
    ExternalSystemRefNo: string;
    Active: boolean;
    CreatedBy: string;
    CreatedDate: string;
    LastModifiedBy: string;
    LastModifiedDate: string
}

export class ProjectAssembly {
    ID: number;
    AssemblyID: number;
    Name: string;
    AssemblyNo: string;
    AltDescription: string;
    ProjectID: number;
    ProjectAssemblyID: number;
    Active: boolean;
    CreatedBy: string;
    // CreatedDate     : Date;
    // LastModifiedBy  : string;
    // LastModifiedDate: Date;
}

export class States {
    StateID: string;
    Name: string;
    Active: boolean;
    CreatedBy: string;
    CreatedDate: string;
    LastModifiedBy: string;
    LastModifiedDate: string;
    //PIT_Meta_Counties?   : County[];
}

export class County {
    CountyID: number;
    StateID: string;
    Name: string;
    Active: boolean;
    CreatedBy: string;
    CreatedDate: string;
    LastModifiedBy: string;
    LastModifiedDate: string;
}

// export class ProjectDivision{
//     ProjectID: number;
//     DivisionID: number;
//     Name: string;
//     QuoteID: number;
//     IsMasterQuote: boolean;
//     Version: number;
//     CreatedBy: string;
//     CreatedDate: Date;
//     LastModifiedBy: string;
//     LastModifiedDate?: Date;
// }

export class ProjectDivisions {
    ProductLineID: number;
    ProductLine: string;
    DivisionID: number;
    Name: string;
    ID: number;
    AwardedCustomer: string;
    IsProdLineAwarded: boolean;
    CustomerQuote: CustomerQuotes[];
    AwardedBy: string;
    QuoteStatusID: number;
    ReasonLost:string;
}

export class CustomerQuotes {
    ID: number;
    QuoteCustomerID: number;
    CustomerOfficeID: number;
    DivisionID: number;
    ProductLineID?: number;
    CustomerName: string;
    CustomerID: number;
    QuoteID: number;
    QuoteNumber: string;
    Version: string;
    IsMasterQuote: boolean;
    EmailCount: number;
    IsAllQuoteLocked: boolean;
    IsAwarded: boolean;
    IsMasterQuoteAwarded: boolean;
    CreatedBy: string;
    CreatedDate: Date;
    LastModifiedBy: string;
    LastUpdatedDate: Date;
    Locked?: boolean;
    CountyName: string;
    QuoteLockedBy: string;
    LockedDate: Date;
    LockedByUserName: string;
    AwardedBy: string;
    QuoteStatusID: number;
    ItemsCount:number;
}

export class QuoteCustomerInfo {
    QuoteCustomerID: number;
    CustomerID?: number;
    CustomerOfficeID?: number;
    QuoteID: number;
    ProjectID: number;
    ProjectName: string;
    ProjectNumber: string;
    IsProjectLocked: boolean;
    Highway: string;
    EstimatedCost: string;
    Architect: string;
    PhoneNo: string;
    CountyID: number;
    StateID: string;
    DivisionID: number;
    DivisionName: string;
    ProductLineID: number;
    ProductLineName: string;
    QuoteNumber: string;
    GlobalMarkup: number;
    Version: number;
    Locked?: boolean;
    CreatedBy: string;
    CreatedDate: Date;
    LastModifiedBy: string;
    LastUpdatedDate: Date;
    Name: string;
    Address: string;
    Address1: string;
    City: string;
    State: string;
    Country: string;
    ZIPCode: string;
    Fax: string;
    OfficePhone: string;
    Email: string;
    ExpiryDate: Date;
    FreightRate: string;
    TruckCapacity: number;
    NoOfTrucks: number;
    Surcharge1: number;
    Surcharge2: number;
    Surcharge3: number;
    PrimeContractor: string;
    ControlNumber: string;
    LettingDate: Date;
    WorkingDays: number;
    CountyName: string;
    TotalWeight: number;
    TotalCost: number;
    TotalBidPrice: number;
    TotalFreight: number;
    ActualGlobalMargin: number;
    Awarded: boolean;
    AwardedDate: Date;
    AwardValue: number;
    IsMasterQuoteAwarded: boolean;
    IsAllQuoteLocked: boolean;
    QuoteLockedBy: string;
    QuoteLockedByUserName: string;
    AuthorisedBy:string;
    AuthorisedByName: string;
    EstimatedBy:string;
    EstimatedByName:string;
    QuoteStatusName: string;
    ReasonLost:string;
}

export class ReplicateMQuote {
    QuoteID: number;
    CustomerID: string;
    User: string;
}

export class CustomerDivisions {
    CustDivisionMapID: number;
    CustomerID: number;
    DivisionID: number;
    Name: string;
    QuoteCustomerID?: number;
    ShortName: string;
    CreatedBy: string;
    CreatedDate: Date;
    //Cell: string;
    //OtherPhone: string;
    // Address: string;
    // City: string;
    //OfficePhone: string;
    //Email: string;
}

export class ProductLineQuote {
    QuoteID: number;
    QuoteNumber: string;
    Version: string;
    GlobalMarkup: number;
    ActualGlobalMargin: number;
    ActualGlobalMarkUp: number;
    TotalFreight: number;
    TotalBidPrice: number;
    TotalCost: number;
    AwardValue: number;
    IsAwarded: boolean;
    CustomerName: string;
    IsMasterQuote: boolean;
    FreightRate: number;
    CreatedBy: string;
    CreatedDate: Date;
    QuoteStatusID: number;
    AwardedMargin: number;
}

export class CountyCustomer {
    CustomerOfficeID: number;
    County: string;
    //QuoteID: number;
    Address: string;
    City: string;
    StateID: string;
    ZIPCode: string;
    OfficePhone: string;
    CustomerID: number;
    StateName: string;
    Name: string;
    Active?: boolean;
    Contacts: string;
    //QuoteCustomerID: number;
}

export class DivisionsItems {
    ItemID: number;
    DivisionID: number;
    DivisionName: string;
    ProductLineID?: number;
    QuoteItemsID?: number;
    ItemNo?: number;
    AltCode: string;
    Description: string;
    UOMID?: number;
    UOM: string;
    ApproxQuantity?: number;
    Weight?: number;
    UnitPrice: string;
    ListPrice: string;
    Amount: string;
}

export class DivisionNotes {
    DivisionID: number;
    DivisionName: string;
    NotesID: number;
    NoteName: string;
    Notes: string;
    DefaultNote: boolean;
    NotesDivisionMapID: string;
}

export class DivisionTermsNConditions {
    DivisionID: number;
    DivisionName: string;
    TermsAndConditionsID: number;
    TNCName: string;
    TermsAndConditions: string;
    DefaultTermsAndConditions: boolean;
    TermsAndConditionsDivisionMapID: number;
}

export class AssociateTermsNConditions {
    TermsAndConditionsID: number;
    TNCName: string;
    TermsAndConditions: string;
    DefaultTermsAndConditions: boolean;
}

export class EmailProposalContacts {
    CustomerOfficeContactMapID: number;
    ContactID: number;
    CustomerOfficeID: number;
    CustomerID: number;
    PrimaryContact: boolean;
    Specifier: boolean;
    ProductLineID: number;
    Active: boolean;
    DivisionID: number;
    CreatedBy: string;
    CreatedDate: Date;
    LastModifiedBy: string;
    LastModifiedDate: Date;
    DivisionName: string;
    CustomerContact: string;
    Email: string;
    CustomerContactName: string;
    Version: string;
    CustomerName: string;
    QuoteNumber: string;
    EmailSubject: string;
    EmailBody: string;
    QuoteID: number;
    ProjectID: number;
    LastProcessedDate: Date;
    Locked: boolean;
    IsMasterQuote: boolean;
}

export class ProjectComments {
    CommentID: number;
    ProjectID: number;
    Comment: string;
    ParentCommentID?: number;
    Picture: string;
    Active: boolean;
    CreatedBy: string;
    CreatedDate: Date;
}
export class ReOrderProjectItems {
    ProjectItemID: number;
    ProjectID: number;
    Up: boolean
}

export class QuoteSearch{
    QuoteID: number;
    QuoteNumber: string;
    ProductLineID : number;
    ProjectID: number;
    ProjectName: string;
    Version: number;
    CreatedBy: string;
    CreatedDate: Date;
    IsMasterQuote: boolean;
    Locked: boolean;
    CustomerName: string;
    Emaildate:Date;
    DivisionName: string;
    LastProcessedDate: Date;
}
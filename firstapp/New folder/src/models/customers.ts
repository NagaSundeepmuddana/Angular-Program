export class Customer{
    Name: string;
    ShortName: string;
    ExternalReferenceNo:string;
    DivisionName:string;
    DivisionID:number;
    CustomerType:string;
    CustomerTypeID:number;
    Active: boolean;
    CustomerID : number;
    CreatedBy       : string;
    CreatedDate     : Date;
    LastModifiedBy  : string;
    LastModifiedDate: Date;
    CustomerOffices:CustomerOffices[];
}
export class CustomerOffices{
    CustomerOfficeID : number;
    CustomerID : number;
    CorporateOffice : boolean;
    CorporateOfficeName : string;
    Address : string;
    Address1 : string;
    Cell:string;
    City : string;
    StateID : string;
    CountryID : string;
    CountyID : number;
    ZIPCode : string;
    Primarycontact:string;
    Fax : string;
    OfficePhone : string;
    OfficeExternalReferenceNo : string;
    Active: boolean;
    CreatedBy       : string;
    CreatedDate     : Date;
    LastModifiedBy  : string;
    LastModifiedDate: Date;
}
export class customercontact{
    ContactID?: number;
    CustomerID: number;
    FirstName: string;
    LastName : string;
    Name : string;
    ContactType: string;
    Email: string;
    Cell : string;
    Position :string;
    OfficePhone : string;
    OtherPhone : string;
    Fax : string;
    Active: boolean;
    CreatedBy       : string;
    CreatedDate     : Date;
    LastModifiedBy  : string;
    LastModifiedDate: Date;
    ContactName:string;
}
export class CustomerDivisionMapping{
    CustDivisionMapID:number;
    CustomerID:number;
    DivisionID:number;
    Name :string;
    DivisionName:string;
    Description:string;
    SubAccount:string;
    ExternalReferenceNo:string;
    Active:boolean;
    CreatedBy :string;
    CreatedDate :Date;
    LastModifiedBy: string;
    LastModifiedDate : Date;
}
export class GetCustomerDivisions{
    DivisionID :number;
    Name:string;
}
export class CustomerDivisionMappingSP{
    CustomerID : number;
    DivisionIDs:string;
    Active:boolean;
    CreatedBy: string;
}

export class CustomerOfficeContacts{
    CustomerOfficeContactMapID : number;
    ContactID : number;
    CustomerOfficeID:number;
    CustomerID: number;
    PrimaryContact:boolean;
    Specifier:boolean;
    ProductLineID:number;
    Active: boolean;
    DivisionID:number;
    CreatedBy       : string;
    CreatedDate     : Date;
    LastModifiedBy  : string;
    LastModifiedDate: Date;
    DivisionName:string;
    CustomerContact: string;
    ContactName: string;
    Email: string;
    EmailSubject:string;
    EmailBody:string;
}
export class ContactType{
    ContactType :string;
    Name:string;
    Description : string;
    Active: boolean;
    CreatedBy       : string;
    CreatedDate     : Date;
    LastModifiedBy  : string;
    LastModifiedDate: Date;
}
export class CustomerType{
    CustomerTypeID :number;
    Name : string;
    Description : string;
    Active: boolean;
    CreatedBy       : string;
    CreatedDate     : Date;
    LastModifiedBy  : string;
    LastModifiedDate: Date;
}
export class Country{
    CountryID :number;
    Name : string;
    Active: boolean;
    CreatedBy       : string;
    CreatedDate     : Date;
    LastModifiedBy  : string;
    LastModifiedDate: Date;
}
export class CustomerEmailHistory{
    RequestID:number;
    ProjectID:number;
    ProjectName:string;
    QuoteID:number;
    QuoteNumber:string;
    RequestedBy:string;
    RequestedByName:string;
    RequestedDate:Date;
    Processed:boolean;
    ProcessedDate:Date;
    ProcessRunControl:string;
    Error:boolean;
    ErrorMessage:string;
    EmailTo:string;
}
export class CustomerEmail{
    RequestID:number;
    ProjectID:number;
    ProjectName:string;
    Division: string;
    QuoteID:number;
    CustomerContactName:string;
    ContactID:number;
    ProductLine:string;
    QuoteNumber:string;
    CustomerOfficeID:number;
    RequestedBy:string;
    CustomerID:number;
    CreatedDate:string;
    RequestedByName:string;
    Version:string;
    RequestedDate:Date;
    Processed:boolean;
    ProcessedDate:Date;
    LastProcessedDate: Date;
    ProcessRunControl:string;
    Error:boolean;
    ErrorMessage:string;
    EmailSubject:string;
    EmailBody:string;
    Email: string;
    ToEmails:string;
    EmailTo:string;
    IsMasterQuote: boolean;
    Locked: boolean;
}
export class CustOfficePrdLineMapping{
    CustOfficePrdLineMappingID:number;
    CustomerOfficeID:number;
    ProductLineID:number;
    DivisionID:number;
    DivisionName:string;
    ProductLineName:string;
}

export class Items{
    ItemCode:string;
AltCode:string;
Description:string;
UOMID:string;
Qty:number;
UnitCost:number;
UnitPrice:number;
TotalCost:number;
TotalPrice:number;
Markup:number;
Weight:number;
TotalWeight:number;
Freight:number;





}
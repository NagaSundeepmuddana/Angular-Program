export class TermsAndCondition{
    TermsAndConditionsID: number;
    Name:string;
    TermsAndConditions:string;
    DefaultTermsAndConditions:string;
    DivisionID:number;
    DivisionName:string;
    Active:boolean;
    CreatedBy :string;
    CreatedDate :Date;
    LastModifiedBy: string;
    LastModifiedDate : Date;
}

export class TermsAndConditionsDivisionMapping{
    TermsAndConditionsDivisionMapID:number;
    TermsAndConditionsID:number;
    DivisionID:number;
    DivisionName :string;
    Description :string;
    ExternalReferenceNo :string;
    Name :string;
    SubAccount:string;
    Active:boolean;
    CreatedBy :string;
    CreatedDate :Date;
    LastModifiedBy: string;
    LastModifiedDate : Date;
}
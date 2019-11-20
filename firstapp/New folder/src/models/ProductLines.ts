export class ProductLines{
    ProductLineID? : number;
    DivisionID : number;
    Name : string;
    AltName : string;
    ExternalSystemRefNo : string;
    Active : boolean;
    CreatedBy :string;
    CreatedDate :Date;
    LastModifiedBy: string;
    LastModifiedDate : Date;
    DivisionName:string;
    Type: string;
}

export class ProductlineDivisions{
    ProductLineID:number;
    DivisionID:number;
    Active:boolean;
    CreatedBy :string;
    CreatedDate :Date;
    LastModifiedBy: string;
    LastModifiedDate : Date;
    Name :string;
    Description:string;
    SubAccount:string;
    DivisionIDs:string;
}


export class ProductLineItems{
    ItemID: number;
    ProductLineID?: number;
    QuoteItemsID?: number;
    ItemCode: string;
    ItemNo?: number;
    AltCode: string;
    Description: string;
    UOMID?: number;
    UOM : string;
    ApproxQuantity?: number;
    Weight?: number;
    UnitPrice: string;
    ListPrice: string;
    Amount: string;
}

export class ProductLineNotes{
    NotesID: number;
    Name: string;
    Notes: string;
    DefaultNote: boolean;
    ProductLine: string;
}

export class AssociateNotes{
    NotesID: number;
    Name: string;
    Notes: string;
    DefaultNote: boolean;
}
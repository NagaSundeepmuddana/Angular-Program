export class QuotesItems {
    QuoteNoteID: any;
    QuoteItemsID: number;
    ItemID: number;
    AssemblyID?: number;
    Type: string;
    ItemNo?: number;
    AltCode: string;
    Description: string;
    UOMID?: number;
    ApproxQuantity?: number;
    Weight?: number;
    UnitPrice: number;
    UnitCost: number;
    ListPrice: string;
    Amount: string;
    Freight: number;
    TotalFreight: number;
    QTY: number;
    TotalPrice: number;
    TotalCost: number;
    Markup: number;
    TotalWeight: number;
    Locked: boolean;
    OrderNumber: number;
    QuoteItemDescription: string;
    QuoteItemUnitCost: number;
    UseSuggestedGlobalMarkup: boolean;
    QuoteItemGlobalMarkup: number;
}

export class QuotesNotes {
    QuoteNoteID: number;
    QuoteID: number;
    NotesID?: number;
    Description: string;
    Locked: boolean;
    Active: boolean;
    CreatedBy: string;
    CreatedDate: Date;
    LastModifiedBy: string;
    LastModifiedDate: Date;
    OrderNumber: number;
}

export class QuotesTerms {
    QuoteTermsAndConditionsID: number;
    QuoteID: number;
    TermsAndConditionsID: number;
    Name: string;
    TermsAndConditions: string;
    DefaultTermsAndConditions: string;
    Locked: boolean;
    Active: boolean;
    CreatedBy: string;
    CreatedDate: Date;
    LastModifiedBy: string;
    LastModifiedDate: Date;
}

export class Quote {
    QuoteID: number;
    Version: number;
}
export class QuoteItemUpdate {
    QuoteItemsID: number;
    QuoteID: number;
    ItemID: number;
    ItemCode: string;
    Description: string;
    UnitCost: number;
    UseSugGlobalMarkup: boolean;
    GlobalMarkup: number;
    Weight: number;
    UnitPrice: number;
    QTY: number;
    QuoteGlobalMarkup: number;
    TotalFreight: number;
    Rounding: string;
    TotalWeight: number;
}

export class BatchQuotes{
    ProjectID: number;
    QuoteIDs: string;
    User: string;
}
export class ReOrderQuotesNotes {
    QuoteNoteID: number;
    QuoteID: number;
    Up: boolean
    
}

export class Lostjob {
    LostQuoteID: number;
    QuoteID: number;
    LostCustomer: number;
    ReasonLost:string;
    Active: boolean;
    CreatedBy: string;
    CreatedDate: Date;
    LastModifiedBy: string;
    LastModifiedDate: Date;
    
}
export class GetallLostCustomer {
    QuoteID: number;
    LostCustomer: number;
    CustomerName:string;
    ReasonLost:string;
}

export class Customersearch{
    Name: string;
    CustomerID:number;
}

export class ItemQuotesearch{
    Name: string;
    ItemID:number;
    ItemCode:string
}

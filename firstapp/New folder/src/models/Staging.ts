export class ProjectStaging {
    DataLoadID: number;
    ProcessRunControlID: string;
    CountyID: number;
    Highway: string;
    Length?: number;
    ControlNumber: string;
    DBEGoal?: number;
    ProjectNumber: string;
    Type: string;
    TimeForCompletion?: number;
    Guaranty?: any;
    EstimatedCost?: any;
    BidsReceivedUntil?: Date;
    BidsWillBeOpened?: Date;
    DeliverBidsTo: string;
    PSEContact: string;
    ProjectExistsAlready: boolean;
    ActiveQuotesExistAlready: boolean;
    ProjectID: number;
    ProcessDate: string;
    ProcessName: string;
    UnProcessed: number;
    Processed: number;
    ToTalRecords: number;
    Error:boolean;
}

export class ProjectStagingItems {
    DataLoadItemID: number;
    DataLoadID: number;
    AltCode: string;
    ItemNo: string;
    DESCode: string;
    Description: string;
    UOM: string;
    ApproxQuantity: number;
    BidPrice: number;
    Amount: any;
    Error: string;
    ErrorMessage: boolean;
    ItemID: number;
}
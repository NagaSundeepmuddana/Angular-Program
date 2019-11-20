export class LockHistory{
    HistoryID: number;
    ProjectID: number;
    UserID: string;
    LockedDate: Date;
    Active: boolean;
    CreatedBy: string;
    CreatedDate: Date;
    LastModifiedBy: string;
    LastModifiedDate: Date;
}

export class QuoteLockHistory{
    HistoryID: number;
    QuoteID: number;
    QuoteCustomerID?: number;
    UserID: string;
    LockedDate: Date;
    Active: boolean;
    CreatedBy: string;
    CreatedDate: Date;
    LastModifiedBy: string;
    LastModifiedDate: Date;
}
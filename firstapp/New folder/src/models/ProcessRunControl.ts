export class ProcessRunControl {
    ProcessRunControlID: number;
    ProcessID: string;
    BeginTime: string;
    EndTime: string;
    Status: string;
    ErrorMessage: string;
    DataColumn: string;
    DataColumn1: string;
    DataColumn2: string;
    DataColumn3: string;
    Active: boolean;
    CreatedBy: string;
    CreatedDate: Date;
    LastModifiedBy: string;
    LastModifiedDate: Date;
}
export class ProcessRunControlDataByPrcsID {
    RequestID: number;
    ProjectID: number;
    ErrorMessage: string;
    Error: string;
    QuoteID: number;
    ProjectNumber:string;
    ProjectName:string;
    QuoteNumber:string;
    RequestedBy: string;
    RequestedDate: string;
    ProcessedDate: string;
    DataLoadID: number;
    Type: string;
    ControlNumber: string;
    Highway: string;
    Length: number;
    ProcessID: string;
}
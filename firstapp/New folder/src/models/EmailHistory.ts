export class EmailHistory{
    EmailRequestID: number;
    ProjectID: number;
    QuoteID: number;
    RequestedBy: string;
    RequestedDate: Date;
    Processed: boolean;
    ProcessedDate: Date;
    Error: boolean;
    ErrorMessage: string;
    ProcessRunControl: string;
    SentTo: string;
}
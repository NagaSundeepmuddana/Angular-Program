export class DashboardQuickStats {
    DataID: number;
    NewQuotes: number;
    NewComments: number;
    ApprovedBidPercentage: number;
    ActiveUsers: number;
    NewProjects: number;
    NewCustomers: number;
    AvgGlobalMarkup: number;
    SupportTickets: number;
    NewBids: number;
    ApprovedBids: number;
    RejectedBids: number;
    TotalBids: number;
    Active: boolean;
    CreatedBy: string;
    CreatedDate: Date;
    LastModifiedBy: string;
    LastModifiedDate: number;
}
export class QuoteByMonth {
    //MonthName: string;
    QuoteCount: number;
    DivisionName: string;
    BidValue:number;
}
export class AwardByMonth {
    //MonthName: string;
    AwardsCount: number;
    DivisionName: string;
    BidValue:number;
}
export class QuotesByContract {
    //MonthName: string;
    QuotesCount: number;
    ContractTypeName: string;
    BidValue:number;
}
export class QuotesByState {
    //MonthName: string;
    QuotesCount: number;
    StateName: string;
    BidValue:number;
}

export class RevenueByDivision {
    DivisionName: string;
    Yr1Revenue: number;
    Yr2Revenue: number;
    Yr3Revenue: number;
}

export class DivisionsByState {
    StateID: string;
    BidCount: number;
    // BRCount: number;
    // GRCount:number;
    // SSCount: number;
    // STCount: number;
    // TLCount: number
}
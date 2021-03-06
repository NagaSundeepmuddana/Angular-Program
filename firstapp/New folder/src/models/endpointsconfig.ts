import { environment } from "../environments/environment";


export const EndPointsConfig = {
    HostName: environment.apiHostName,
    ProjectsEndPoint: 'Project/',
    ProjectItems: 'ProjectItems/',
    ProjectAssembly: 'ProjectAssembly/',
    CustomersEndPoint: 'Customer/',
    DivisionsEndPoint: 'Divisions/',
    NotesEndPoint: 'Note/',
    LDREndPoint: 'LDRReports',
    PCREndPoint: 'PCRReports',
    ProjectCategories: 'ProjectCategories',
    ProjectSubCategories: 'ProjectSubCategories',
    ProjectStates: 'States/',
    ProjectCounty: 'County/',
    TermsAndConditionsEndPoint: 'TermsAndConditions/',
    CustomerContactEndpoint: 'CustomerContact/',
    FreightEndPoint: 'FreightSetup/',
    salesRepresentativeEndPoint: 'SalesRep/',
    ProductLinesEndPoint: 'ProductLines/',
    ItemsEndPoint: 'Items/',
    ItemSearchEndPoint: 'ItemSearch/',
    ItemAssemblyEndPoint: 'ItemAssembly/',
    AssemblyEndPoint: 'Assemblies/',
    AssemblyParts: 'AssemblyParts/',
    Users: 'users/',
    UsersEmailSignature: 'EmailSignature/',
    TermsAndConditionsDivEndPoint: 'TermsAndConditionsDivisionMapping/',
    NotesDivEndPoint: 'NoteDivisionMapping/',
    NotesNoteProductLineEndPoint: 'NoteProductLine/',
    CustomerDivEndPoint: 'CustomerDivisions/',
    ProductLineQuotesEndPoint: 'ProductLineQuotes/',
    AwardQuoteEndPoint: 'AwardQuote/',
    // CustomerDivEndPoint:'CustomerDivisionMapping/',
    CountyCustomerEndPoint: 'CountyCustomer/',
    ProductLineDivEndPoint: 'ProductLineDivisionMapping/',
    ProjectDivisions: 'ProjectDivisions/',
    QuoteCustomerInfo: 'QuoteAndCustomerInfo/',
    EmailHistoryEndPoint: 'ProposalEmail/',
    EmailEndPoint: 'EmailRequests/',
    ProjectEmailProposal: 'ProjectEmailProposal/',
    ProductLineItemsEndPoint: 'ProductLineItems/',
    DivisionItemsEndPoint: 'DivisionItems/',
    DivisionNoteEndPoint: 'DivisionNote/',
    DivisionTermsNConditionEndPoint: 'DivisionTerms/',
    CustomerOfficesEndpoint: 'CustomerOffices/',
    CustomerOfficeContactEndpoint: 'CustomerOfficeContact/',
    CustomerDivisionMappingEndPoint: 'CustomerDivisionMapping/',
    ContactTypeEndPoint: 'ContactType/',
    CustomerTypeEndPoint: 'CustomerType/',
    CountryEndPoint: 'Country/',
    UOMEndPoint: '/UOM',
    ContractTypeEndPoint: 'ContractType/',
    QuoteItemsEndPoint: 'QuoteItems/',
    QuoteTermsEndPoint: 'QuoteTerms/',
    QuoteNotesEndPoint: 'QuoteNotes/',
    ProjectLockEndPoint: 'LockHistory/',
    ProjectPrimeContractorEndPoint: 'ProjectPrimeContractor/',
    QuotePrimeContractorEndPoint: 'QuotePrimeContractor/',
    PhaseEndPoint: 'Phase/',
    ProcessRunControlEndPoint: 'ProcessRunControl/',
    QuoteEndPoint: 'Quote/',
    QuoteItemsUpdateEndPoint: 'QuoteItemsUpdate/',
    //PDFEndPoint:'GenPdf/',
    PDFEndPoint: 'proposal/',
    SendProposalEmailRequestEndPoint: 'SendProposalEmailRequest/',
    ProductLinesItems: 'ProductLinesItems/',
    ProductLineNotes: 'ProductLineNotes/',
    ProjectStagingEndPoint: 'ProjectStaging/',
    NotificationEndPoint: 'Notifications/',
    AwardedQuoteReportEndPoint: 'AwardedQuotesReport/',
    PDFAwardedReportEndPoint:'PDFAwardedReport/',
    QuoteReportEndPoint: 'QuotesReport/',
    QuotesReportbyControlNumberEndPoint:'QuotesReportbyControlNumber/',
    PDFQuotesReportEndPoint: 'PDFQuotesReport/',
    SysproBudgetReportEndPoint: 'SysproBudgetReport/',
    PDFSysproBudgetReportEndPoint:'PDFSysproBudgetReport/',
    QuotesbyContactReportEndPoint: 'QuotesbyContactReport/',
    PDFQuotesbyContactReportEndPoint:'PDFQuotesbyContactReport/',
    QuotesbyVendorReportEndPoint: 'QuotesbyVendorReport/',
    PDFQuotesbyVendorReportEndPoint:'PDFQuotesbyVendorReport/',
    ChangeOrderReportEndPoint: 'ChangeOrdersReport/',
    PDFChangeOrderReportEndPoint:'PDFChangeOrderReport/',
    ContactsReportEndPoint: 'ContactsReport/',
    PDFContactReportEndPoint:'PDFContactReport/',
    SpecifiedEntitiesReportEndPoint: 'SpecifiedEntitiesReport/',
    PDFSpecifiedEntitiesReportEndPoint:'PDFSpecifiedEntitiesReport/',
    ProductAssemblylineItemsReportsEndPoint: 'ProductAssemblylineItemsReports/',
    ProductlineItemsReportsEndPoint: 'ProductLineItemsReport/',
    PDFProductlineitemReportEndPoint:'PDFProductlineitemReport/',
    CommentsEndPoint: 'ProjectComments/',
    DashboardQuickStatEndPoint: 'DashboardQuickStats/',
    DashboardQuoteByMonth: 'QuotesByMonth',
    DashboardAwardByMonth: 'DashboardAward',
    DashboardQuoteByContract: 'DashboardQuoteByContract',
    DashboardRevenueByDivision: 'RevenueByDivision',
    DashboardDivisionsByState: 'DashboardDivByState',
    ReOrderProjectAndQuote: 'ReOrderProjectAndQuote',
    DefaultReOrderNotes:'DefaultReOrderNotes',
    TxDotImport: 'TxDotImport',
    CustOfficePrdLineMappingEndPoint: 'CustomerOfficePrdLineMapping/',
    CustOfficePrdLineDropdownEndPoint: 'CustOfficePrdLineDropdown/',
    CustomerExportEndPoint: 'CustomerExport/',
    Roles: 'Roles/',
    UserRoles: 'UserRoles/',
    RolesToPermissions: 'RolesToPermissions/',
    Permissions: 'Permissions/',
    BusinessManager: 'BusinessManager/',
    QuoteLockStatus: 'QuoteLockStatus/',
    QuotesSearchEndPoint: 'QuotesSearch/',
    LockAllUnlockedQuotes: 'BatchQuotesLock/',
    PDFQuotesReportbyControlNumberControllerEndPoint: 'PDFQuotesReportbyControlNumber/',
    LostJobQuoteEndPoint:'LostJobQuote/',
    CustomerSearchEndPoint:'CustomerSearch/',
    LostCustomerEndPoint:'GetLostCustomer/',    
    ItemSearchByquotehistEndPoint:'ItemSearchbyquotehist/',
    QuotesHistoryItemsReportEndPoint:'QuotesHistoryItemsReport/',
    TripReportEndPoint: 'TripReport/',
    MessageChannelReportEndPoint: 'MessageChannelReport/',
    GetTripReportEndPoint: 'GetTripReport/',
    MessageChannelEndPoint: 'MessageChannel/',
}

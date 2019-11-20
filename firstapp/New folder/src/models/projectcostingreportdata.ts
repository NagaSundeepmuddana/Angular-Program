export class ProjectCostingReportData{
    PRJID:number;
    PROJECTNAME:string;
    CONTROLNUMBER:string;
    COUNTYID:number;
    PROJECTNUMBER:string;
    STARTDATE:Date;
    COUNTYNAME:string;
    RPT_PCR_DATA_ITEM:ProjectCostingReportItemData[];
    constructor() {
        this.RPT_PCR_DATA_ITEM = [];
    }
}

export class ProjectCostingReportItemData{
    ITEMNUMBER:string;
    ITEMDESC:string;
    QUANTITY:number;
    UNIT:string;
    UNITCOST:number;
    UNITPRICE:number;
    TOTALCOST:number;
    TOTALPRICE:number;
    MARKUPPERCENT:number;
    DIVISIONID:number;
    DIVISIONNAME:string;
    QUOTID:number;
    TOTALFREIGHTFORQUOTE:number;
    TOTALFREIGHT:number;
    TOTALBIDPRICE:number;
    SUMOFTOTALCOST:number;
    MARKUPFORDIVISION:number;
    MARGINPERCENT:number;
    PROJECTTOTALBIDPRICE:number;
    PROJECTTOTALCOST:number;
    PRJMARGINPERCENT:number;
    PRJMARKUPPERCENT:number;
}
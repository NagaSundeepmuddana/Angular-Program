export class Assembly{
    AssemblyID :number;
    Name : string;
    DivisionID:number;
    AssemblyNo :string;
    AltDescription:string;
    ExternalSystemRefNo : string;
    ProductLineID:number;
    Active :boolean;
    CreatedBy :string;
    CreatedDate :Date;
    LastModifiedBy: string;
    LastModifiedDate : Date;
}
export class AssemblyItem {
    AssemblyPartID   : number;
    ItemID          : number;
    ProductLineID   :number;
    Quantity        :number;
    ItemNo          : string;
    ItemCode        : string;
    AltCode         : string;
    Description     : string;
    TotalUnitPrice  :string;
    TotalWeight     :string;
    UOMID           : number;
    ApproxQuantity  : number;
    Weight          : number;
    UnitPrice       : string;
    ListPrice       : string;
    Amount          : string;
    AssemblyID       : number;
    UOM             : string;
    Active: boolean;
    CreatedBy: string;
    CreatedDate: Date;
    LastModifiedBy  : string;
    LastModifiedDate: Date
}
export class Item {
    ItemID: number;
    ProductLineID: number;
    ProductLine: string;
    ItemCode: string;
    AltCode: string;
    DESCode: string;
    Description: string;
    UOM: string;
    ApproxQuantity: string;
    BidPrice: string;
    Amount: string;
    Weight: string;
    UnitPrice: string;
    ListPrice: string;
    Active: boolean;
    CreatedBy: string;
    CreatedDate: Date;
    LastModifiedBy: string;
    LastModifiedDate: Date
}
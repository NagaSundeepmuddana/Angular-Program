export class Items{
    ItemID :number;
    Type: string;
    ProductLineID : number;
    ItemNo :string;
    ProductLine:string;
    ItemCode : string;
    AltCode : string;
    UOM:string;
    Description:string;
    UOMID : number;
    ExternalSystemRefNo : string;
    ApproxQuantity : string;
    Weight : string;
    UnitPrice : string;
    ListPrice : string;
    Amount : string;
    Active :boolean;
    CreatedBy :string;
    CreatedDate :Date;
    LastModifiedBy: string;
    LastModifiedDate : Date;
    Rounding:string;
}
export class UOM{
    UOMID:number;
    UOM:string;
    Description :string;
    Active :boolean;
    CreatedBy :string;
    CreatedDate :Date;
    LastModifiedBy: string;
    LastModifiedDate : Date;
}
export class AssemblyItems{
    AssemblyItemID:number;
    ItemID:number;
    Active :boolean;
    CreatedBy :string;
    Quantity:string;
    CreatedDate :Date;
    LastModifiedBy: string;
    LastModifiedDate : Date;
    Type: string;
    ProductLineID : number;
    ItemNo :string;
    ProductLine:string;
    ItemCode : string;
    AltCode : string;
    UOM:string;
    Description:string;
    UOMID : number;
    ExternalSystemRefNo : string;
    ApproxQuantity : string;
    Weight : string;
    UnitPrice : string;
    ListPrice : string;
    Amount : string;
}
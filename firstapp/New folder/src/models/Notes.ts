export class Notes{
    NotesID: number;
    Name:string;
    Notes:string;
    DefaultNote:string;
    ProductLineName:string;
    ProductLineID:string;
    Active:boolean;
    CreatedBy :string;
    CreatedDate :Date;
    LastModifiedBy: string;
    LastModifiedDate : Date;
}

export class NotesDivisionMapping{
    NotesDivisionMapID:number;
    NotesID:number;
    DivisionID:number;
    Active:boolean;
    Name :string;
    CreatedBy :string;
    CreatedDate :Date;
    LastModifiedBy: string;
    LastModifiedDate : Date;
    Description:string;
    SubAccount:string;
}
export class NoestoProductLineMapping{
    NotesDivisionMapID :number;
    NotesID:number;
    ProductLineID:number;
    DivisionID:number;
    DivisionName:string;
    ProductLineName:string;
}

export class PutNoestoProductLineMapping{
    ProductLineID :number;
    DivisionID:number;
    Name:string;
    AltName:string;
    ExternalSystemRefNo:string;
    NotesDivisionMapID:number;
    NotesID:number;
}
export class GetNoteDivisions{
    DivisionID :number;
    Name:string;
}
export class NotesDivisionMappingSP{
    NotesID : number;
    DivisionIDs:string;
    Active:boolean;
    CreatedBy: string;
}
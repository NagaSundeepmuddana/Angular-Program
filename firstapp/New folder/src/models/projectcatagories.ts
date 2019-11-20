export class ProjectCategories {
    ProjectCatID    : number;
    ProjectSubCatID? : number;
    Name            : string;
    Active          : boolean;
    CreatedBy       : string;
    CreatedDate     : string;
    LastModifiedBy  : string;
    LastModifiedDate: string;
    PIT_Meta_ProjectSubCategories?   : ProjectSubCategories[];
}
export class ProjectSubCategories {
    ProjectSubCatID : number;
    ProjectCatID    : number;
    Name            : string;
    Active          : boolean;
    CreatedBy       : string;
    CreatedDate     : string;
    LastModifiedBy  : string;
    LastModifiedDate: string
}
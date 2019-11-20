export class Role{
    RoleID: number;
    Name: string;
    Description: string;
    Active: boolean;
    CreatedBy: string;
    CreatedByID: string;
    CreatedDate: string;
    LastModifiedBy: string;
    LastModifiedByID: string;
    LastModifiedDate: string;
}

export class Permissions{
    PermissionID: number;
    ParentPermissionID: number;
    Description: string;
    RoleID: number;  
    Name: string;
    IsParent: boolean;
}

export class RolesPermissions{
    RoleID: number;
    PermissionIDs: string;
    User: string;  
}

export class UserPermissions{
    PLROOT: boolean;  
    PL000000: boolean;
    PL000001: boolean
    PL000002: boolean;
    PL000003: boolean;
    PL000004: boolean;
    PL000005: boolean;
    PL000006: boolean;
    PL000007: boolean;
    PL000008: boolean;
    PL000009: boolean;
    PL000010: boolean;
    PL000011: boolean;
    PL000012: boolean;
    PL000013: boolean;
    PL000014: boolean;
    PL000015: boolean;
    PL000016: boolean;
    PL000017: boolean;
    PL000018: boolean;
    PL000019: boolean;
    PL000020: boolean;
    PL000021: boolean;
    PL000022: boolean;
    PL000023: boolean;
    PL000024: boolean;
    PL000025: boolean;
    PL000026: boolean;
    PL000027: boolean;
    PL000028: boolean;
    PL000029: boolean;
    PL000030: boolean;
    PL000031: boolean;
    PL000032: boolean;
    PL000033: boolean;
    PL000034: boolean;
    PL000035: boolean;
    PL000036: boolean;
    PL000037: boolean;
    PL000038: boolean;
    PL000039: boolean;
    PL000040: boolean;
    PL000041: boolean;
    PL000042: boolean;
    PL000043: boolean;
    PL000044: boolean;
    PL000045: boolean;
    PL000046: boolean;
    PL000047: boolean;
    PL000048: boolean;
    PL000049: boolean;
    PL000050: boolean;
    PL000051: boolean;
    PL000052: boolean;
    PL000053: boolean;
    PL000054: boolean;
    PL000055: boolean;
    PL000056: boolean;
    PL000057: boolean;
    PL000058: boolean;
    PL000059: boolean;
    PL000060: boolean;
    PL000061: boolean;
    PL000062: boolean;
    PL000063: boolean;
    PL000064: boolean;
    PL000065: boolean;
    PL000066: boolean;
    PL000067: boolean;
    PL000068: boolean;
    PL000069: boolean;
    PL000070: boolean;
    PL000071: boolean;
    PL000072: boolean;
    PL000073: boolean;
    PL000074: boolean;
    PL000075: boolean;
    PL000076: boolean;
    PL000077: boolean;
    PL000078: boolean;
    PL000079: boolean;
    PL000080: boolean;
    PL000081: boolean;
    PL000082: boolean;
    PL000083: boolean;
    PL000084: boolean;
}
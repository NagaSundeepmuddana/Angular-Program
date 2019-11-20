export class User{
    // email:string;
    // email_verified: boolean;
    // user_id: string;
    // picture: string;
    // nickname: string;
    // updated_at: string;
    // created_at: string;
    // name: string;
    // last_ip: string;
    // last_login: string;
    // logins_count: number;
    // given_name: string;
    // family_name: string;
    // connection: string;
    // blocked: boolean;
    UserID: string;
    Email: string;
    EmailVerified: string;
    FirstName: string;
    LastName: string;
    Name: string;
    CreatedDate: Date;
    Picture: string;
    CreatedBy: string;
    EmailSignature: string;
    Designation: string;
    PhoneNumber: string;
    family_name: string;
    given_name: string;
    password: string;
    Active: boolean;
}

export class PITUser{
    UserID: string;
    Email: string;
    EmailVerified: string;
    FirstName: string;
    LastName: string;
    Name: string;
    CreatedDate: Date;
    Picture: string;
    CreatedBy: string;
    EmailSignature: string;
    Designation: string;
    PhoneNumber: string;
}

export class UserRoles{
    RoleToUserMappingID: number;
    RoleID: number;
    Name: string;
    UserID: string;
    Active: boolean;
    Description: string;
    CreatedDate: Date;
    CreatedBy: string;
    LastModifiedBy: string;
    LastModifiedDate: Date;
}
export class Roles{
    RoleID: number;
    Name: string;
    Description: string;
    Active: boolean;
    CreatedDate: Date;
    CreatedBy: string;
    LastModifiedBy: string;
    LastModifiedDate: Date;
}
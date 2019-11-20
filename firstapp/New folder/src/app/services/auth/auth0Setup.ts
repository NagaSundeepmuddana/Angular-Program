import { environment } from "../../../environments/environment";

interface  AuthSetup{
    ClientID: string,
    Domain: string,
    CallBackURL: string
}

export const AUTH0_Config: AuthSetup = {
    ClientID : 'qIlJCsRfnzT20V8Nss2kTP8i9HecBykC',
    Domain : 'railcarrx-auth.auth0.com',
    CallBackURL: environment.auth0CallBackUrl
}

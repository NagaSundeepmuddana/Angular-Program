// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,

  /*================= QA =========================*/
  /* auth0CallBackUrl : 'http://priceit.railcarrxqa.com/main',
   apiHostName: 'http://priceitapi.railcarrxqa.com/api/', */

  /*================= Production =========================*/
  auth0CallBackUrl : 'http://sspipriceitweb:8080/main', 
  apiHostName: 'http://sspipriceitweb/api/',  

  /*================= UAT =========================*/
 /*  auth0CallBackUrl : 'http://sspipriceit:8090/main',
  apiHostName: 'http://sspipriceit:8091/api/' */

  /*================= Dev =========================*/
     /* auth0CallBackUrl: 'http://localhost:4200/main',
     apiHostName: 'http://localhost:54057/api/' */
};

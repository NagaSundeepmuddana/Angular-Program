import { Injectable, Pipe } from '@angular/core';
import { Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
@Injectable()
export class PrimcomService {
 
  constructor() { }
  getOptions(): RequestOptions {
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });
    return options;
  }

  // getAuthOptions(appContext: AppContext): RequestOptions {
  //   let headers = new Headers({
  //     'Content-Type': 'application/x-www-form-urlencoded',
  //     'Authorization': appContext.User.TokenType + ' ' + appContext.User.AuthToken,
  //     'Accept': 'application/json',
  //     "cache-control": "no-cache"
  //   });
  //   let options = new RequestOptions({ headers: headers });
  //   return options;
  // }

  generateBody(data: any): string {
    let params = new URLSearchParams();
    for (let prop in data) {
      params.append(prop, data[prop]);
    }
    return params.toString();
  }

  getFDAuthOptions(): RequestOptions {
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa('mkodali@railcarrx.com:9901266499'),
      'Accept': 'application/json'
    });
    let options = new RequestOptions({ headers: headers });
    return options;
  }

}

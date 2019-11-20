import { Component, enableProdMode } from '@angular/core';

if(!/localhost/.test(document.location.host)) {
  enableProdMode();
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {}

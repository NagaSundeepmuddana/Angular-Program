import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { MainComponent } from './main/main.component';
import { MainModule } from "./main/main.module";
import { AuthenticationService } from "./services/auth/authentication.service";
import { PrimcomService } from "./services/utilities/primcom.service";
import { MetadataService } from "./services/metadata/metadata.service";
import { ProjectService } from "./services/project/project.service";
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { UserService } from './services/user/user.service';
import * as $ from 'jquery';
import { SecurityService } from './services/security/security.service';
@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    MainComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    MainModule,
    AppRoutingModule
  ],
  providers: [AuthenticationService,PrimcomService,MetadataService,ProjectService,UserService,SecurityService],
  bootstrap: [AppComponent]
})
export class AppModule { }

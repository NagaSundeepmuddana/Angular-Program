import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from "./auth/auth.component";
import { MainComponent } from "./main/main.component";

const routes: Routes = [
  {path: '', pathMatch : 'full', component : AuthComponent},
  {path : 'auth', component : AuthComponent},
  {path : 'main', component : MainComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

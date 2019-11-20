import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from "./main.component";
import { LdrComponent } from "./ldr/ldr.component";
import { PcrComponent } from "./pcr/pcr.component";
import { DashComponent } from "./dash/dash.component";
import { PcidComponent } from './pcid/pcid.component';
import { dvsComponent } from './dvs/dvs.component';
import { custComponent } from './cust/cust.component';
import { noteComponent } from './note/note.component';
import { tacComponent } from './tac/tac.component';
import { frtComponent } from './frt/frt.component';
import { salesrComponent } from './salesr/salesr.component';
import { prdtComponent } from './prdt/prdt.component';
import { itemComponent } from './item/item.component';
import { asmblComponent } from './asmbl/asmbl.component';
import { PrjComponent } from './prj/prj.component';
import { PrjdtsComponent } from './prjdts/prjdts.component';
import { PrjmngComponent } from './prjmng/prjmng.component';
import { UsersComponent } from './users/users.component';
import { prcComponent } from './prc/prc.component';
import { PrjstgComponent } from './prjstg/prjstg.component';
import { qrComponent } from './qr/qr.component';
import { aqrComponent } from './aqr/aqr.component';
import { qbcrComponent } from './qbcr/qbcr.component';
import { qbvrComponent } from './qbvr/qbvr.component';
import { corComponent } from './cor/cor.component';
import { crComponent } from './cr/cr.component';
import { serComponent } from './ser/ser.component';
import { pairComponent } from './pair/pair.component';
import { pirComponent } from './pir/pir.component';
import { SecurityComponent } from './security/security.component';
import { sbrComponent } from './sbr/sbr.component';
import{QtsearchComponent} from './qtsearch/qtsearch.component';
import { qrcnComponent } from './qrcn/qrcn.component';
import { QhtComponent } from './qht/qht.component';
import { TripComponent } from './trip/trip.component';
import { TRepComponent } from './trep/trep.component';
import { MchanComponent } from './mchan/mchan.component';
const routes: Routes = [{
  path : 'main',
  component : MainComponent,
  children : [
    {path : '' , component : DashComponent},
    {path : 'dash' , component : DashComponent},
    {path : 'ldr' , component : LdrComponent},
    {path : 'pcr' , component : PcrComponent},
    {path : 'pcid' , component : PcidComponent},
    {path : 'dvs' , component : dvsComponent},
    {path : 'cust' , component : custComponent},
    {path : 'note' , component : noteComponent},
    {path : 'tac' , component : tacComponent},
    {path : 'frt' , component : frtComponent},
    {path : 'salesr' , component : salesrComponent},
    {path : 'prdt' , component : prdtComponent},
    {path : 'item' , component : itemComponent},
    {path : 'asmbl' , component : asmblComponent},
    {path : 'prj' , component : PrjComponent},
    {path : 'prjstg' , component : PrjstgComponent},
    {path : 'prjdts/:id' , component : PrjdtsComponent},
    {path : 'prjmng/:id' , component : PrjmngComponent},
    {path : 'users' , component : UsersComponent},
    {path : 'prc' , component : prcComponent},
    {path : 'qr' , component : qrComponent},
    {path : 'aqr' , component : aqrComponent},
    {path : 'qbcr' , component : qbcrComponent},
    {path : 'qbvr' , component : qbvrComponent},
    {path : 'cor' , component : corComponent},
    {path : 'cr' , component : crComponent},
    {path : 'ser' , component : serComponent},
    {path : 'pair' , component : pairComponent},
    {path : 'pir' , component : pirComponent},
    {path : 'security' , component : SecurityComponent},
    {path : 'sbr' , component : sbrComponent},
    {path:'qtsearch',component:QtsearchComponent },
    {path: 'qrcn', component: qrcnComponent},
    {path: 'qht', component: QhtComponent},
    {path: 'trip/:id', component: TripComponent},
    {path: 'trep/:id', component: TRepComponent},
    {path: 'mchan', component: MchanComponent}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }

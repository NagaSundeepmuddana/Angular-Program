import { NgModule, Component, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { LdrComponent } from './ldr/ldr.component';
import { PcrComponent } from './pcr/pcr.component';
import { DxButtonModule, DxFormModule, DxTemplateModule,DxRadioGroupModule, DxTextBoxModule, DxTextAreaModule, DxCheckBoxModule, DxSelectBoxModule, DxPivotGridModule, DxAutocompleteModule, DxTagBoxModule, DxTabPanelModule, DxTabsModule, DxSwitchModule, DxDataGridModule, DxLoadPanelModule, DxChartModule, DxTreeListModule, DxTreeViewModule, DxPopupModule, DxTooltipModule, DxDateBoxModule, DxAccordionModule, DxSliderModule, DxNumberBoxModule,DxFileUploaderModule,DxBoxModule, DxLookupModule, DxPieChartModule } from 'devextreme-angular';
import { DashComponent } from './dash/dash.component';
import { FormsModule } from "@angular/forms";
import { PcidComponent } from './pcid/pcid.component';
import { dvsComponent } from './dvs/dvs.component';
import { custComponent } from './cust/cust.component';
import { noteComponent } from './note/note.component';
import { prcComponent } from './prc/prc.component';
import { tacComponent } from './tac/tac.component';
import { frtComponent } from './frt/frt.component';
import { salesrComponent } from './salesr/salesr.component';
import { prdtComponent } from './prdt/prdt.component';
import { itemComponent } from './item/item.component';
import { asmblComponent } from './asmbl/asmbl.component';
import { PrjComponent } from './prj/prj.component';
import { PrjstgComponent } from './prjstg/prjstg.component';
import { PrjdtsComponent } from './prjdts/prjdts.component';
import { PrjmngComponent } from './prjmng/prjmng.component';
import { UsersComponent } from './users/users.component';
import { EllipsisPipe } from '../services/ellipsis.pipe';
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
import { QtsearchComponent } from './qtsearch/qtsearch.component';
import  { qrcnComponent } from './qrcn/qrcn.component';
import { QhtComponent } from './qht/qht.component';
import { TripComponent } from './trip/trip.component';
import { TRepComponent } from './trep/trep.component';
import { MchanComponent } from './mchan/mchan.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MainRoutingModule,
    DxButtonModule,
    DxSelectBoxModule,
    DxTextBoxModule,
    DxTextAreaModule,
    DxCheckBoxModule,
    DxTemplateModule,
    DxPivotGridModule,
    DxAutocompleteModule,
    DxTagBoxModule,
    DxDataGridModule,
    DxLoadPanelModule,
    DxChartModule,
    DxTreeListModule,
    DxTreeViewModule,
    DxPopupModule,
    DxTooltipModule,
    DxDateBoxModule,
    DxAccordionModule,
    DxSliderModule,
    DxTabPanelModule,
    DxTabsModule,
    DxSwitchModule,
    DxNumberBoxModule,
    DxFormModule,
    DxFileUploaderModule,
    DxBoxModule,
    DxRadioGroupModule,
    DxLookupModule,
    DxPieChartModule
  ],
  declarations: [LdrComponent, PcrComponent, DashComponent, PcidComponent, dvsComponent,custComponent,noteComponent,tacComponent,frtComponent,salesrComponent,prdtComponent,itemComponent,asmblComponent, PrjComponent, PrjdtsComponent, PrjmngComponent, UsersComponent, EllipsisPipe,prcComponent, PrjstgComponent,qrComponent,aqrComponent,qbcrComponent,qbvrComponent,corComponent,crComponent,serComponent,pairComponent,pirComponent, SecurityComponent,sbrComponent,QtsearchComponent, qrcnComponent, QhtComponent, TripComponent, TRepComponent, MchanComponent]
})
export class MainModule { }

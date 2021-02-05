import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewOrderPageRoutingModule } from './view-order-routing.module';

import { ViewOrderPage } from './view-order.page';
import { GeneralComponent } from './general/general.component';
import { DirectionsComponent } from './directions/directions.component';
import { PackagesComponent } from './packages/packages.component';
import { LogComponent } from './log/log.component';
import { PipesModule } from '../pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';
import { EvidencePreviewComponent } from './evidence-preview/evidence-preview.component';

@NgModule({
  entryComponents: [
    GeneralComponent,
    DirectionsComponent,
    PackagesComponent,
    LogComponent,
    EvidencePreviewComponent
  ],  
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewOrderPageRoutingModule,
    PipesModule,
    TranslateModule.forChild()
  ],
  declarations: [
    ViewOrderPage,
    GeneralComponent,
    DirectionsComponent,
    PackagesComponent,
    LogComponent,
    EvidencePreviewComponent
  ],
  exports: [
    GeneralComponent,
    DirectionsComponent,
    PackagesComponent,
    LogComponent,
    EvidencePreviewComponent
  ],
})
export class ViewOrderPageModule {}

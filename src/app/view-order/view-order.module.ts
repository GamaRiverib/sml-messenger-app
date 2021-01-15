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
import { ServiceTypePipe } from '../pipes/service-type.pipe';
import { DeliveryStatusPipe } from '../pipes/delivery-status.pipe';

@NgModule({
  entryComponents: [
    GeneralComponent,
    DirectionsComponent,
    PackagesComponent,
    LogComponent
  ],  
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewOrderPageRoutingModule
  ],
  declarations: [
    ViewOrderPage,
    GeneralComponent,
    DirectionsComponent,
    PackagesComponent,
    LogComponent,
    DeliveryStatusPipe,
    ServiceTypePipe
  ],
  exports: [
    GeneralComponent,
    DirectionsComponent,
    PackagesComponent,
    LogComponent,
    DeliveryStatusPipe,
    ServiceTypePipe
  ],
})
export class ViewOrderPageModule {}

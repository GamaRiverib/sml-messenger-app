import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OrderComponent } from './order.component';
import { DeliveryStatusPipe } from '../pipes/delivery-status.pipe';
import { ServiceTypePipe } from '../pipes/service-type.pipe';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule, RouterModule],
  declarations: [ OrderComponent, DeliveryStatusPipe, ServiceTypePipe ],
  exports: [ OrderComponent, DeliveryStatusPipe, ServiceTypePipe ]
})
export class OrderComponentModule {}

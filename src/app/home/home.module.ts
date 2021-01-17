import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { HomePage } from './home.page';
import { HomePageRoutingModule } from './home-routing.module';
import { OrderComponentModule } from '../order/order.module';
import { OptionsComponent } from './options/options.component';

@NgModule({
  entryComponents: [
    OptionsComponent
  ],
  exports: [
    OptionsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrderComponentModule,
    HomePageRoutingModule
  ],
  declarations: [
    OptionsComponent,
    HomePage
  ]
})
export class HomePageModule {}

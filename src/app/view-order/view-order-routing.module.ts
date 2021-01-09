import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DirectionsComponent } from './directions/directions.component';
import { GeneralComponent } from './general/general.component';
import { LogComponent } from './log/log.component';
import { PackagesComponent } from './packages/packages.component';

import { ViewOrderPage } from './view-order.page';

const routes: Routes = [
  {
    path: '',
    component: ViewOrderPage,
    children: [{
      path: '',
      component: GeneralComponent
    }, {
      path: 'general',
      component: GeneralComponent
    }, {
      path: 'directions',
      component: DirectionsComponent
    }, {
      path: 'packages',
      component: PackagesComponent
    }, {
      path: 'log',
      component: LogComponent
    }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewOrderPageRoutingModule {}

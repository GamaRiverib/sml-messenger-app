import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OrderComponent } from './order.component';
import { PipesModule } from '../pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [ 
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule,
    PipesModule,
    TranslateModule.forChild()
  ],
  declarations: [ OrderComponent ],
  exports: [ OrderComponent ]
})
export class OrderComponentModule {}

import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { DeliveryStatusPipe } from "./delivery-status.pipe";
import { ServiceTypePipe } from "./service-type.pipe";

@NgModule({
  declarations: [
    DeliveryStatusPipe,
    ServiceTypePipe
  ],
  exports: [
    DeliveryStatusPipe,
    ServiceTypePipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ]
})
export class PipesModule { }
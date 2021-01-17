import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/model/order';
import { DataService } from 'src/app/services/data.service';
import { MylocationService } from 'src/app/services/mylocation.service';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss'],
})
export class GeneralComponent implements OnInit {

  public order: Order;
  public distance: number;
  public estimatedTime: number;

  private loadIntents = 3;

  constructor(
    private data: DataService,
    private myLocation: MylocationService) { }

  async ngOnInit() {
    if (this.loadIntents > 0) {
      this.loadIntents--;
      this.order = this.data.getSelectedOrder();
      if (!this.order) {
        setTimeout(this.ngOnInit.bind(this), 1000);
        return;
      }
      this.loadIntents = 3;
      const source = this.order.sourceAddress;
      const destination = this.order.destinationAddress;
      const resp = this.myLocation.calculateDeliveryDistance(source, destination);
      this.distance = (await resp).distance;
      this.estimatedTime = (await resp).time;
    }
  }

  get progress(): number {
    if (!this.order) {
      return 0;
    }
    return this.data.getOrderProgress(this.order);
  }

  get progressColor(): string {
    if (!this.order) {
      return '';
    }
    return this.data.getOrderProgressColor(this.order);
  }

}

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

  constructor(private data: DataService, private myLocation: MylocationService) { }

  async ngOnInit() {
    this.order = this.data.getSelectedOrder();
    if (!this.order) {
      return;
    }

    const source = this.order.SourceAddress;
    const destination = this.order.DestinationAddress;
    const resp = this.myLocation.calculateDistance(source, destination);
    this.distance = (await resp).distance;
    this.estimatedTime = (await resp).time;
  }



}

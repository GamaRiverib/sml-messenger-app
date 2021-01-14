import { Component, Input, OnInit } from '@angular/core';
import { OrderDto } from '../model/order-dto';
import LatLonSpherical from '../services/latlonspherical';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit {

  @Input() order: OrderDto;

  constructor() { }

  ngOnInit() {
    console.log({
      source: this.order.SourceAddress.FullAddress,
      destination: this.order.DestinationAddress.FullAddress,
      distance: this.Distance,
      estimatedTime: this.EstimatedTime
    });
  }

  isIos() {
    const win = window as any;
    return win && win.Ionic && win.Ionic.mode === 'ios';
  }

  get Distance(): number {
    if (!this.order) {
      return 0;
    }
    const p1 = new LatLonSpherical(this.order.SourceAddress.Latitude, this.order.SourceAddress.Longitude);
    const p2 = new LatLonSpherical(this.order.DestinationAddress.Latitude, this.order.DestinationAddress.Longitude);
    const p3 = new LatLonSpherical(this.order.SourceAddress.Latitude, this.order.DestinationAddress.Longitude);
    const p4 = new LatLonSpherical(this.order.DestinationAddress.Latitude, this.order.SourceAddress.Longitude);

    const d1 = p1.distanceTo(p3) + p3.distanceTo(p2);
    const d2 = p1.distanceTo(p4) + p4.distanceTo(p2);
    return Math.floor((d1 + d2) / 2) / 1000;
  }

  get EstimatedTime(): number {
    return Math.ceil(this.Distance * 1.5);
  }

}

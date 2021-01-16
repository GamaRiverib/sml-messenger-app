import { Component, Input, OnInit } from '@angular/core';
import { OrderDto } from '../model/order-dto';
import { DataService } from '../services/data.service';
import { MylocationService } from '../services/mylocation.service';

const icons = {
  CREATED: 'help-circle',
  QUEUED: 'help-circle',
  IN_ORDER: 'location',
  COLLECTED: 'location',
  READY_TO_STORAGE: 'location',
  READY_TO_DELIVERY: 'location',
  DELIVERED: 'checkmark-done-circle',
  TO_STORAGE: 'archive',
  TO_NEXT_VISIT: 'help-circle',
  VISIT_DONE: 'warning',
  STORAGED: 'archive',
  VISIT_CANCELED: 'warning',
  DELETED: 'close-circle',
  VISIT_SUSPENDED: 'warning',
  RETURNED: 'warning',
  LOST: 'warning'
};

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit {

  @Input() order: OrderDto;
  public distance: number;
  public estimatedTime: number;
  public directionsToSource: string;
  public directionsToDestination: string;

  constructor(private data: DataService, private myLocation: MylocationService) { }

  async ngOnInit() {
    this.updateDistanceAndTime();
    const baseUrl = 'https://maps.google.com?saddr=My+Location&daddr=';
    this.directionsToSource = `${baseUrl}${this.order.SourceAddress.Latitude},${this.order.SourceAddress.Longitude}`;
    this.directionsToDestination = `${baseUrl}${this.order.DestinationAddress.Latitude},${this.order.DestinationAddress.Longitude}`;
  }

  isIos() {
    const win = window as any;
    return win && win.Ionic && win.Ionic.mode === 'ios';
  }

  private async updateDistanceAndTime(): Promise<void> {
    if (!this.order) {
      return;
    }
    const source = this.order.SourceAddress;
    const destination = this.order.DestinationAddress;
    const resp = this.myLocation.calculateRoute(source, destination);
    this.distance = (await resp).distance;
    this.estimatedTime = (await resp).time;
  }

  get icon(): string {
    if (!this.order) {
      return 'alert-circle';
    }
    return icons[this.order.DeliveryStatus] || 'alert-circle'
  }

  get color(): string {
    if (!this.order) {
      return '';
    }
    const s = this.order.DeliveryStatus;
    const t = this.order.ServiceType;
    if (s === 'QUEUED' || s === 'CREATED') {
      if (t === 'NEXT_DAY') {
        return 'warning';
      }
      return 'danger';
    }
    if (s === 'IN_ORDER') {
      if (t === 'NEXT_DAY') {
        return 'tertiary';
      }
      return 'warning'
    }
    if (s === 'COLLECTED') {
      if (t === 'NEXT_DAY') {
        return 'tertiary';
      }
      return 'success';
    }
    if (s === 'READY_TO_DELIVERY') {
      return 'warning';
    }
    if (s === 'DELIVERED') {
      return 'success';
    }
    if (s === 'VISIT_DONE' || s === 'RETURNED' || s === 'VISIT_CANCELED') {
      return 'danger';
    }
    if (s === 'VISIT_SUSPENDED') {
      return 'warning';
    }
    if (s === 'TO_STORAGE') {
      return 'tertiary';
    }
    return '';
  }

  reject(): void {
    this.data.reject(this.order);
  }

  take(): void {
    this.data.take(this.order);
  }

  cancel(): void {
    this.data.cancel(this.order);
  }

  collect(): void {
    this.data.collect(this.order);
  }

  toStorage(): void {
    this.data.toStorage(this.order);
  }

  toDelivery(): void {
    this.data.toDelivery(this.order);
  }

  storage(): void {
    this.data.storage(this.order);
  }

  fail(): void {
    this.data.storage(this.order);
  }

  done(): void {
    this.data.done(this.order);
  }

}

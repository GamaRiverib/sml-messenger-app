import { Component, Input, OnInit } from '@angular/core';
import { Location, Order, OrderStatus, ServiceType } from '../services/data.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit {

  @Input() order: Order;

  constructor() { }

  ngOnInit() {}

  isIos() {
    const win = window as any;
    return win && win.Ionic && win.Ionic.mode === 'ios';
  }

  getNextAddress(): string {
    let address = '';
    let l: Location | null = null;
    if (!this.order) {
      return address;
    }
    if (!this.order.pickup.done) {
      l = this.order.pickup.location;
    } else {
      l = this.order.dropoff.location;
    }
    if (l !== null) {
      address = `${l.street} ${l.externalNumber}`;
      if (l.neighborhood) {
        address += `, ${l.neighborhood}`;
      }
    }
    return address;
  }

  getTypeText(): string {
    let type = '';
    if (!this.order) {
      return type;
    }
    switch(this.order.type) {
      case ServiceType.ON_DEMAND:
        type = 'On demand';
        break;
      case ServiceType.NEXT_DAY:
        type = 'Next day';
        break;
      case ServiceType.SAME_DAY:
        type = 'Same day';
        break;
    }
    return type;
  }

  getStatusText(): string {
    let status = '';
    if (!this.order) {
      return status;
    }
    switch(this.order.status) {
      case OrderStatus.CREATED:
        status = 'Created';
        break;
      case OrderStatus.DELETED:
        status = 'Deleted';
        break;
      case OrderStatus.DELIVERED:
        status = 'Delivered';
        break;
      case OrderStatus.IN_ORDER:
        status = 'In order';
        break;
      case OrderStatus.LOST:
        status = 'Lost';
        break;
      case OrderStatus.QUEUED:
        status = 'Queued';
        break;
      case OrderStatus.READY_TO_DELIVERY:
        status = 'Ready to delivery';
        break;
      case OrderStatus.READY_TO_STORAGE:
        status = 'Ready to storage';
        break;
      case OrderStatus.RETURNED:
        status = 'Returned';
        break;
      case OrderStatus.STORAGED:
        status = 'Storaged';
        break;
      case OrderStatus.TO_NEXT_VISIT:
        status = 'To next visit';
        break;
      case OrderStatus.TO_STORAGE:
        status = 'To storage';
        break;
      case OrderStatus.VISITS_DONE:
        status = 'Visits done';
        break;
      case OrderStatus.VISIT_CANCELLED:
        status = 'Visit cancelled';
        break;
      case OrderStatus.VISIT_SUSPENDED:
        status = 'Visit suspended';
        break;
    }
    return status;
  }

}

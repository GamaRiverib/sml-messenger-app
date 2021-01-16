import { Component, OnInit } from '@angular/core';
import { OrderDto } from '../model/order-dto';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  public orders: OrderDto[];
  public loadingMessage: string = '';

  constructor(private data: DataService) {}

  private async loadOrders(): Promise<void> {
    const status_priority = [
      "QUEUED", "READY_TO_DELIVERY", "IN_ORDER", "COLLECTED", "READY_TO_STORAGE", 
      "TO_STORAGE", "RETURNED", "VISIT_DONE", "TO_NEXT_VISIT", "VISIT_SUSPENDED",
      "VISIT_CANCELED", "STORAGED", "CREATED", "DELIVERED", "LOST"];
    const service_type_priority = ["ON_DEMAND", "SAME_DAY", "NEXT_DAY"];
    this.loadingMessage = 'Loading...'
    this.orders = (await this.data.getOrders() || []).sort((a: OrderDto, b: OrderDto) => {
      const avalue = status_priority.indexOf(a.DeliveryStatus) + service_type_priority.indexOf(a.ServiceType);
      const bvalue = status_priority.indexOf(b.DeliveryStatus) + service_type_priority.indexOf(b.ServiceType);
      return avalue - bvalue;
    });
    if (this.orders.length === 0) {
      this.loadingMessage = 'No orders';
    } else {
      this.loadingMessage = '';
    }
  }

  async refresh(ev: any) {
    this.data.reload();
    await this.loadOrders();
    ev.detail.complete();
  }

  async ngOnInit() {
    this.loadOrders();
  }

}

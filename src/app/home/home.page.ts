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
    this.loadingMessage = 'Loading...'
    this.orders = await this.data.getOrders();
    if (this.orders.length === 0) {
      this.loadingMessage = 'No orders';
    } else {
      this.loadingMessage = '';
    }
  }

  async refresh(ev: any) {
    await this.loadOrders();
    ev.detail.complete();
  }

  async ngOnInit() {
    this.loadOrders();
  }

}

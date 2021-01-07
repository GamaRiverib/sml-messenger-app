import { Component } from '@angular/core';
import { DataService, Order } from '../services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(private data: DataService) {}

  refresh(ev: any) {
    setTimeout(() => {
      ev.detail.complete();
    }, 3000);
  }

  getOrders(): Order[] {
    return this.data.getOrders();
  }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order } from '../model/order';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.page.html',
  styleUrls: ['./view-order.page.scss'],
})
export class ViewOrderPage implements OnInit {

  public order: Order;

  constructor(
    private data: DataService,
    private activatedRoute: ActivatedRoute
  ) { }

  private async loadOrder(id: number): Promise<void> {
    this.order = await this.data.getOrderById(id);
  }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.loadOrder(parseInt(id));
  }

  getBackButtonText() {
    const win = window as any;
    const mode = win && win.Ionic && win.Ionic.mode;
    return mode === 'ios' ? 'Orders' : '';
  }

  tabChange(ev: any) {
    // console.log('Tab change event', event);
  }

}

import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/model/order';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss'],
})
export class LogComponent implements OnInit {

  public order: Order;

  constructor(private data: DataService) { }

  ngOnInit() {
    this.order = this.data.getSelectedOrder();
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

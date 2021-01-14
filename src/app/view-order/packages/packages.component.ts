import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/model/order';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.scss'],
})
export class PackagesComponent implements OnInit {

  public order: Order;

  constructor(private data: DataService) { }

  ngOnInit() {
    this.order = this.data.getSelectedOrder();
  }

}

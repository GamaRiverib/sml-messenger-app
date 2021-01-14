import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from 'src/app/model/order';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss'],
})
export class GeneralComponent implements OnInit {

  public order: Order;

  constructor(private data: DataService) { }

  ngOnInit() {
    this.order = this.data.getSelectedOrder();
  }

}

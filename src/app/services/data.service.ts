import { Injectable } from '@angular/core';
import { OrderDto } from '../model/order-dto';
import * as TestData from '../data/test-orders';
import { Order } from '../model/order';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  public getOrders(): OrderDto[] {
    return TestData.getAllOrders();
  }

  public getOrderById(id: number): Order {
    return TestData.getOrderById(id);
  }
}

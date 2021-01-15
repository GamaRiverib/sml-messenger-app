import { Injectable } from '@angular/core';
import { OrderDto } from '../model/order-dto';
import * as TestData from '../data/test-orders';
import { Order } from '../model/order';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private selected: Order = null;

  constructor() { }

  public getOrders(): Promise<OrderDto[]> {
    return new Promise<OrderDto[]>((resolve, reject) => {
      setTimeout(() => {
        const orders = TestData.getAllOrders();
        resolve(orders);
      }, 2000);
    });
  }

  public getOrderById(id: number): Promise<Order> {
    return new Promise<Order>((resolve, reject) => {
      setTimeout(() => {
        const order = TestData.getOrderById(id);
        if (!order) {
          return reject();
        }
        this.selected = order;
        resolve(order);
      }, 800);
    });
  }

  public getSelectedOrder(): Order | null {
    return this.selected;
  }

  public reload(): void {
    return TestData.reload();
  }

  public reject(order: OrderDto | Order): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        order.DeliveryStatus = 'CREATED';
        resolve();
      }, 600);
    });
  }

  public take(order: OrderDto | Order): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        order.DeliveryStatus = 'IN_ORDER';
        resolve();
      }, 600);
    });
  }

  public cancel(order: OrderDto | Order): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        order.DeliveryStatus = 'CREATED';
        resolve();
      }, 600);
    });
  }

  public collect(order: OrderDto | Order): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        order.DeliveryStatus = 'COLLECTED';
        resolve();
      }, 600);
    });
  }

  public toStorage(order: OrderDto | Order): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        order.DeliveryStatus = 'READY_TO_STORAGE';
        resolve();
      }, 600);
    });
  }

  public toDelivery(order: OrderDto | Order): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        order.DeliveryStatus = 'READY_TO_DELIVERY';
        resolve();
      }, 600);
    });
  }

  public storage(order: OrderDto | Order): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        order.DeliveryStatus = 'TO_STORAGE';
        resolve();
      }, 600);
    });
  }

  public fail(order: OrderDto | Order): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        order.DeliveryStatus = 'VISIT_DONE';
        resolve();
      }, 600);
    });
  }

  public done(order: OrderDto | Order): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        order.DeliveryStatus = 'DELIVERED';
        resolve();
      }, 600);
    });
  }

}

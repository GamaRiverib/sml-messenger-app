import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
import { OrderDto } from '../model/order-dto';
import * as TestData from '../data/test-orders';
import { Order } from '../model/order';
import { AddressDto } from '../model/address-dto';

// const SERVER_URL = 'http://localhost:3000';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private selected: Order = null;

  constructor(/*private http: HttpClient*/) { }

  public getSpeed(): number {
    // TODO: calcular velocidad promedio de acuerdo al día y hora
    return 40;
  }

  public getPickupDelay(): number {
    // TODO: estadística sobre el tiempo de recolección promedio
    return 10;
  }

  public getStorageAddress(): AddressDto {
    // TODO: En environment establecer las Address del almacén
    const FullAddress = "Calle Vicente Guerrero s/n, Infonavit, 85120 Cd Obregón, Son."
    const Latitude = 27.493168146428467;
    const Longitude = -109.95447145273737;
    return {
      Id: 0,
      FullAddress,
      Latitude,
      Longitude
    };
  }

  public async getOrders(): Promise<OrderDto[]> {
    /*const url = `${SERVER_URL}/orders`;
    const response = await this.http.get<{ orders: OrderDto[] }>(url)
      .toPromise<{ orders: OrderDto[] }>();
    return response.orders || [];*/
    return new Promise<OrderDto[]>((resolve, reject) => {
      setTimeout(() => {
        const orders = TestData.getAllOrders();
        resolve(orders);
      }, 2000);
    });
  }

  public async getOrderById(id: number): Promise<Order> {
    /*const url = `${SERVER_URL}/orders/${id}`;
    const response = await this.http.get<{ order: Order }>(url)
      .toPromise<{ order: Order }>();
    return response.order;*/
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

  public async reject(order: OrderDto | Order): Promise<void> {
    /*const url = `${SERVER_URL}/orders/${order.Id}/reject`;
    const response = await this.http.post<void>(url, {})
      .toPromise<void>();
    return;*/
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        order.DeliveryStatus = 'CREATED';
        resolve();
      }, 600);
    });
  }

  public async take(order: OrderDto | Order): Promise<void> {
    /*const url = `${SERVER_URL}/orders/${order.Id}/take`;
    const response = await this.http.post<void>(url, {})
      .toPromise<void>();
    return;*/
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        order.DeliveryStatus = 'IN_ORDER';
        resolve();
      }, 600);
    });
  }

  public async cancel(order: OrderDto | Order): Promise<void> {
    /*const url = `${SERVER_URL}/orders/${order.Id}`;
    const body = {
      order: {
        DeliveryStatus: 'CREATED'
      }
    };
    if (estimatedTime) {
      body.order['EstimatedDeliveryTime'] = estimatedTime;
    }
    return this.http.put<void>(url, body).toPromise<void>();*/
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        order.DeliveryStatus = 'CREATED';
        resolve();
      }, 600);
    });
  }

  public async collect(order: OrderDto | Order, estimatedTime?: number): Promise<void> {
    /*const url = `${SERVER_URL}/orders/${order.Id}`;
    const body = {
      order: {
        DeliveryStatus: 'COLLECTED'
      }
    };
    if (estimatedTime) {
      body.order['EstimatedDeliveryTime'] = estimatedTime;
    }
    return this.http.put<void>(url, body).toPromise<void>();*/
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        order.DeliveryStatus = 'COLLECTED';
        resolve();
      }, 600);
    });
  }

  public toStorage(order: OrderDto | Order): Promise<void> {
    /*const url = `${SERVER_URL}/orders/${order.Id}`;
    const body = {
      order: {
        DeliveryStatus: 'READY_TO_STORAGE'
      }
    };
    return this.http.put<void>(url, body).toPromise<void>();*/
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        order.DeliveryStatus = 'READY_TO_STORAGE';
        resolve();
      }, 600);
    });
  }

  public toDelivery(order: OrderDto | Order, estimatedTime?: number): Promise<void> {
    /*const url = `${SERVER_URL}/orders/${order.Id}`;
    const body = {
      order: {
        DeliveryStatus: 'READY_TO_DELIVERY'
      }
    };
    if (estimatedTime) {
      body.order['EstimatedDeliveryTime'] = estimatedTime;
    }
    return this.http.put<void>(url, body).toPromise<void>();*/
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        order.DeliveryStatus = 'READY_TO_DELIVERY';
        resolve();
      }, 600);
    });
  }

  public storage(order: OrderDto | Order): Promise<void> {
    /*const url = `${SERVER_URL}/orders/${order.Id}`;
    const body = {
      order: {
        DeliveryStatus: 'TO_STORAGE'
      }
    };
    return this.http.put<void>(url, body).toPromise<void>();*/
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        order.DeliveryStatus = 'TO_STORAGE';
        resolve();
      }, 600);
    });
  }

  public fail(order: OrderDto | Order): Promise<void> {
    /*const url = `${SERVER_URL}/orders/${order.Id}`;
    const body = {
      order: {
        DeliveryStatus: 'VISIT_DONE'
      }
    };
    return this.http.put<void>(url, body).toPromise<void>();*/
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        order.DeliveryStatus = 'VISIT_DONE';
        resolve();
      }, 600);
    });
  }

  public done(order: OrderDto | Order): Promise<void> {
    /*const url = `${SERVER_URL}/orders/${order.Id}`;
    const body = {
      order: {
        DeliveryStatus: 'DELIVERED'
      }
    };
    return this.http.put<void>(url, body).toPromise<void>();*/
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        order.DeliveryStatus = 'DELIVERED';
        resolve();
      }, 600);
    });
  }

}

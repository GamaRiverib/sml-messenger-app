import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
import { OrderDto } from '../model/order-dto';
import * as TestData from '../data/test-orders';
import { Order } from '../model/order';
import { AddressDto } from '../model/address-dto';

// const SERVER_URL = 'http://localhost:3000';
const STATUS_PRIORITY = [
  "QUEUED", "READY_TO_DELIVERY", "IN_ORDER", "COLLECTED", "READY_TO_STORAGE", 
  "TO_STORAGE", "RETURNED", "VISIT_DONE", "TO_NEXT_VISIT", "VISIT_SUSPENDED",
  "VISIT_CANCELED", "STORAGED", "CREATED", "DELIVERED", "LOST"];
const SERVICE_TYPE_PRIORITY = ["ON_DEMAND", "SAME_DAY", "NEXT_DAY"];

const ORDER_PROGRESS = {
  CREATED: 0.1,
  QUEUED: 0.1,
  IN_ORDER: 0.25,
  COLLECTED: 0.5,
  RETURNED: 0.5,
  READY_TO_DELIVERY: 0.75,
  READY_TO_STORAGE: 0.75,
  TO_STORAGE: 0.75,
  DELIVERED: 1,
  STORAGED: 1,
  LOST: 1,
  VISIT_DONE: 0.5,
  TO_NEXT_VISIT: 0.2,
  VISIT_CANCELED: 0.5,
  VISIT_SUSPENDED: 0.5
};

const ORDER_PROGRESS_COLOR = {
  CREATED: 'secondary',
  QUEUED: 'secondary',
  IN_ORDER: 'primary',
  COLLECTED: 'primary',
  RETURNED: 'warning',
  READY_TO_DELIVERY: 'primary',
  READY_TO_STORAGE: 'primary',
  TO_STORAGE: 'primary',
  DELIVERED: 'success',
  STORAGED: 'success',
  LOST: 'danger',
  VISIT_DONE: 'warning',
  TO_NEXT_VISIT: 'tertiary',
  VISIT_CANCELED: 'warning',
  VISIT_SUSPENDED: 'warning'
};

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private orders: OrderDto[];
  private selected: Order = null;

  constructor(/*private http: HttpClient*/) { }

  private sortOrders(): void {
    this.orders = this.orders.sort((a: OrderDto, b: OrderDto) => {
      const avalue = STATUS_PRIORITY.indexOf(a.deliveryStatus) + SERVICE_TYPE_PRIORITY.indexOf(a.serviceType);
      const bvalue = STATUS_PRIORITY.indexOf(b.deliveryStatus) + SERVICE_TYPE_PRIORITY.indexOf(b.serviceType);
      return avalue - bvalue;
    });
  }

  public getOrderProgress(order: OrderDto | Order): number {
    return ORDER_PROGRESS[order.deliveryStatus] || 0;
  }

  public getOrderProgressColor(order: OrderDto | Order): string {
    return ORDER_PROGRESS_COLOR[order.deliveryStatus] || '';
  }

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
    const fullAddress = "Calle Vicente Guerrero s/n, Infonavit, 85120 Cd Obregón, Son."
    const latitude = 27.493168146428467;
    const longitude = -109.95447145273737;
    return {
      id: 0,
      fullAddress,
      latitude,
      longitude
    };
  }

  public async getOrders(cache?: boolean): Promise<OrderDto[]> {
    /*const url = `${SERVER_URL}/orders`;
    const response = await this.http.get<{ orders: OrderDto[] }>(url)
      .toPromise<{ orders: OrderDto[] }>();
    return response.orders || [];*/
    return new Promise<OrderDto[]>((resolve, reject) => {
      if (cache) {
        return this.orders;
      }
      setTimeout(() => {
        this.orders = TestData.getAllOrders() || [];
        this.sortOrders();
        resolve(this.orders);
      }, 1200);
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

  public async reject(order: OrderDto | Order): Promise<void> {
    /*const url = `${SERVER_URL}/orders/${order.id}/reject`;
    const response = await this.http.post<void>(url, {})
      .toPromise<void>();
    return;*/
    return new Promise<void>(async (resolve, reject) => {
      setTimeout(() => {
        order.deliveryStatus = 'CREATED';
        this.getOrderById(order.id)
          .then(o => o.deliveryStatus = 'CREATED');
        this.sortOrders();
        resolve();
      }, 600);
    });
  }

  public async take(order: OrderDto | Order): Promise<void> {
    /*const url = `${SERVER_URL}/orders/${order.id}/take`;
    const response = await this.http.post<void>(url, {})
      .toPromise<void>();
    return;*/
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        order.deliveryStatus = 'IN_ORDER';
        this.getOrderById(order.id)
          .then(o => o.deliveryStatus = 'IN_ORDER');
        this.sortOrders();
        resolve();
      }, 600);
    });
  }

  public async cancel(order: OrderDto | Order): Promise<void> {
    /*const url = `${SERVER_URL}/orders/${order.id}`;
    const body = {
      order: {
        deliveryStatus: 'CREATED'
      }
    };
    if (estimatedTime) {
      body.order['EstimatedDeliveryTime'] = estimatedTime;
    }
    return this.http.put<void>(url, body).toPromise<void>();*/
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        order.deliveryStatus = 'CREATED';
        this.getOrderById(order.id)
          .then(o => o.deliveryStatus = 'CREATED');
        this.sortOrders();
        resolve();
      }, 600);
    });
  }

  public async collect(order: OrderDto | Order, estimatedTime?: number): Promise<void> {
    /*const url = `${SERVER_URL}/orders/${order.id}`;
    const body = {
      order: {
        deliveryStatus: 'COLLECTED'
      }
    };
    if (estimatedTime) {
      body.order['EstimatedDeliveryTime'] = estimatedTime;
    }
    return this.http.put<void>(url, body).toPromise<void>();*/
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        order.deliveryStatus = 'COLLECTED';
        this.getOrderById(order.id)
          .then(o => o.deliveryStatus = 'COLLECTED');
        this.sortOrders();
        resolve();
      }, 600);
    });
  }

  public toStorage(order: OrderDto | Order): Promise<void> {
    /*const url = `${SERVER_URL}/orders/${order.id}`;
    const body = {
      order: {
        deliveryStatus: 'READY_TO_STORAGE'
      }
    };
    return this.http.put<void>(url, body).toPromise<void>();*/
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        order.deliveryStatus = 'READY_TO_STORAGE';
        this.getOrderById(order.id)
          .then(o => o.deliveryStatus = 'READY_TO_STORAGE');
        this.sortOrders();
        resolve();
      }, 600);
    });
  }

  public toDelivery(order: OrderDto | Order, estimatedTime?: number): Promise<void> {
    /*const url = `${SERVER_URL}/orders/${order.id}`;
    const body = {
      order: {
        deliveryStatus: 'READY_TO_DELIVERY'
      }
    };
    if (estimatedTime) {
      body.order['EstimatedDeliveryTime'] = estimatedTime;
    }
    return this.http.put<void>(url, body).toPromise<void>();*/
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        order.deliveryStatus = 'READY_TO_DELIVERY';
        this.getOrderById(order.id)
          .then(o => o.deliveryStatus = 'READY_TO_DELIVERY');
        this.sortOrders();
        resolve();
      }, 600);
    });
  }

  public storage(order: OrderDto | Order): Promise<void> {
    /*const url = `${SERVER_URL}/orders/${order.id}`;
    const body = {
      order: {
        deliveryStatus: 'TO_STORAGE'
      }
    };
    return this.http.put<void>(url, body).toPromise<void>();*/
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        order.deliveryStatus = 'STORAGED';
        this.getOrderById(order.id)
          .then(o => o.deliveryStatus = 'STORAGED');
        this.sortOrders();
        resolve();
      }, 600);
    });
  }

  public fail(order: OrderDto | Order): Promise<void> {
    /*const url = `${SERVER_URL}/orders/${order.id}`;
    const body = {
      order: {
        deliveryStatus: 'VISIT_DONE'
      }
    };
    return this.http.put<void>(url, body).toPromise<void>();*/
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        order.deliveryStatus = 'VISIT_DONE';
        this.getOrderById(order.id)
          .then(o => o.deliveryStatus = 'VISIT_DONE');
        this.sortOrders();
        resolve();
      }, 600);
    });
  }

  public done(order: OrderDto | Order): Promise<void> {
    /*const url = `${SERVER_URL}/orders/${order.id}`;
    const body = {
      order: {
        deliveryStatus: 'DELIVERED'
      }
    };
    return this.http.put<void>(url, body).toPromise<void>();*/
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        order.deliveryStatus = 'DELIVERED';
        this.getOrderById(order.id)
          .then(o => o.deliveryStatus = 'DELIVERED');
        this.sortOrders();
        resolve();
      }, 600);
    });
  }

  public lost(order: OrderDto | Order): Promise<void> {
    /*const url = `${SERVER_URL}/orders/${order.id}`;
    const body = {
      order: {
        deliveryStatus: 'LOST'
      }
    };
    return this.http.put<void>(url, body).toPromise<void>();*/
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        order.deliveryStatus = 'LOST';
        this.getOrderById(order.id)
          .then(o => o.deliveryStatus = 'LOST');
        this.sortOrders();
        resolve();
      }, 600);
    });
  }

}

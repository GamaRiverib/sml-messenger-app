import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
import { OrderDto } from '../model/order-dto';
import * as TestData from '../data/test-orders';
import { Order } from '../model/order';
import { AddressDto } from '../model/address-dto';
import { ORDER_PROGRESS, ORDER_PROGRESS_COLOR,
         SERVICE_TYPE_PRIORITY, STATUS_ICONS, 
         STATUS_ICON_COLOR, STATUS_PRIORITY } from '../app.values';

// const SERVER_URL = 'http://localhost:3000';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private orders: OrderDto[];
  private selected: Order = null;

  private online: boolean = true;
  private autoAcceptOrders: boolean = false;

  private static MONITOR_TIMEOUT: any = null;

  constructor(/*private http: HttpClient*/) { }

  private sortOrders(): void {
    this.orders = this.orders.sort((a: OrderDto, b: OrderDto) => {
      const avalue = STATUS_PRIORITY.indexOf(a.deliveryStatus) + SERVICE_TYPE_PRIORITY.indexOf(a.serviceType);
      const bvalue = STATUS_PRIORITY.indexOf(b.deliveryStatus) + SERVICE_TYPE_PRIORITY.indexOf(b.serviceType);
      return avalue - bvalue;
    });
  }

  public startMonitor(freq?: number): void {
    freq = freq || 60000;
    if (DataService.MONITOR_TIMEOUT !== null) {
      clearInterval(DataService.MONITOR_TIMEOUT);
    }
    DataService.MONITOR_TIMEOUT = setInterval(this.getOrders.bind(this), freq);
  }

  public stopMonitor(): void {
    if (DataService.MONITOR_TIMEOUT !== null) {
      clearInterval(DataService.MONITOR_TIMEOUT);
    }
  }

  public getStatusIcon(order: OrderDto | Order): string {
    return STATUS_ICONS[order.deliveryStatus] || 'alert-circle';
  }

  public getStatusIconColor(order: OrderDto | Order): string {
    const s = order.deliveryStatus;
    const t = order.serviceType;
    if (!STATUS_ICON_COLOR[t]) {
      return ''; 
    }
    if (!(STATUS_ICON_COLOR[t])[s]) {
      return '';
    }
    return (STATUS_ICON_COLOR[t])[s] || '';
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
    return 3;
  }

  public getStorageAddress(): AddressDto {
    // TODO: En environment establecer las Address del almacén
    const fullAddress = 'Calle Vicente Guerrero s/n, Infonavit, 85120 Cd Obregón, Son.'
    const latitude = 27.493168146428467;
    const longitude = -109.95447145273737;
    return {
      id: 0,
      fullAddress,
      latitude,
      longitude
    };
  }

  public getOnlineMode(): boolean {
    return this.online;
  }

  public setOnlineMode(val: boolean): void {
    this.online = val;
  }

  public getAutoAcceptOrders(): boolean {
    return this.autoAcceptOrders;
  }

  public setAutoAcceptOrders(val: boolean): void {
    this.autoAcceptOrders = val;
  }

  public async getOrders(cache?: boolean): Promise<OrderDto[]> {
    /*const url = `${SERVER_URL}/orders`;
    const response = await this.http.get<{ orders: OrderDto[] }>(url)
      .toPromise<{ orders: OrderDto[] }>();
    return response.orders || [];*/
    // TODO: Testing purposes only
    if (cache) {
      console.log('get orders from cache');
      return this.orders;
    }
    return new Promise<OrderDto[]>((resolve, reject) => {
      setTimeout(() => {
        this.orders = TestData.getAllOrders() || [];
        this.sortOrders();
        resolve(this.orders);
      }, 1000);
    });
  }

  public async selectOrderById(id: number): Promise<Order> {
    /*const url = `${SERVER_URL}/orders/${id}`;
    const response = await this.http.get<{ order: Order }>(url)
      .toPromise<{ order: Order }>();
    return response.order;*/
    // TODO: Testing purposes only
    return new Promise<Order>((resolve, reject) => {
      setTimeout(() => {
        const order = TestData.getOrderById(id);
        if (!order) {
          return reject();
        }
        this.selected = order;
        resolve(this.selected);
      }, 800);
    });
  }

  public getSelectedOrder(): Order | null {
    return this.selected;
  }

  public clearSelectedOrder(): void {
    this.selected = null;
  }

  public async reject(order: OrderDto | Order): Promise<void> {
    /*const url = `${SERVER_URL}/orders/${order.id}/reject`;
    const response = await this.http.post<void>(url, {})
      .toPromise<void>();
    return;*/
    // TODO: Testing purposes only
    return new Promise<void>(async (resolve, reject) => {
      setTimeout(() => {
        TestData.updateStatusOrder(order.id, 'CREATED');
        this.selected = TestData.getOrderById(order.id);
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
    // TODO: Testing purposes only
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        TestData.updateStatusOrder(order.id, 'IN_ORDER');
        this.selected = TestData.getOrderById(order.id);
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
    // TODO: Testing purposes only
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        TestData.updateStatusOrder(order.id, 'CREATED');
        this.selected = TestData.getOrderById(order.id);
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
    // TODO: Testing purposes only
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        TestData.updateStatusOrder(order.id, 'COLLECTED');
        this.selected = TestData.getOrderById(order.id);
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
    // TODO: Testing purposes only
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        TestData.updateStatusOrder(order.id, 'READY_TO_STORAGE');
        this.selected = TestData.getOrderById(order.id);
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
    // TODO: Testing purposes only
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        TestData.updateStatusOrder(order.id, 'READY_TO_DELIVERY');
        this.selected = TestData.getOrderById(order.id);
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
    // TODO: Testing purposes only
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        TestData.updateStatusOrder(order.id, 'STORAGED');
        this.selected = TestData.getOrderById(order.id);
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
    // TODO: Testing purposes only
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        TestData.updateStatusOrder(order.id, 'VISIT_DONE');
        this.selected = TestData.getOrderById(order.id);
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
    // TODO: Testing purposes only
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        TestData.updateStatusOrder(order.id, 'DELIVERED');
        this.selected = TestData.getOrderById(order.id);
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
    // TODO: Testing purposes only
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        TestData.updateStatusOrder(order.id, 'LOST');
        this.selected = TestData.getOrderById(order.id);
        this.sortOrders();
        resolve();
      }, 600);
    });
  }

}

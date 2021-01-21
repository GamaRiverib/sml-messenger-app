import { Injectable } from '@angular/core';

import { OrderDto } from '../model/order-dto';

import { Order } from '../model/order';
import { AddressDto } from '../model/address-dto';
import { ORDER_PROGRESS, ORDER_PROGRESS_COLOR,
         SERVICE_TYPE_PRIORITY, STATUS_ICONS, 
         STATUS_ICON_COLOR, STATUS_PRIORITY } from '../app.values';
import { HttpService } from './http.service';

// import * as TestData from '../data/test-orders';

const SERVER_URL = 'https://smlapiobr.azurewebsites.net';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private orders: OrderDto[] = [];
  private selected: Order = null;

  private online: boolean = true;
  private autoAcceptOrders: boolean = false;

  private static MONITOR_TIMEOUT: any = null;

  private observers: ((count: number) => void)[] = [];

  constructor(private http: HttpService) {
    // TODO: Test force use web
    // this.http.useWeb = true;
  }

  private notify(count: number): void {
    if (this.observers.length > 0) {
      this.observers.forEach(o => o(count));
    }
  }

  private sortOrders(): void {
    this.orders = this.orders.sort((a: OrderDto, b: OrderDto) => {
      const avalue = STATUS_PRIORITY.indexOf(a.deliveryStatus) + SERVICE_TYPE_PRIORITY.indexOf(a.serviceType);
      const bvalue = STATUS_PRIORITY.indexOf(b.deliveryStatus) + SERVICE_TYPE_PRIORITY.indexOf(b.serviceType);
      return avalue - bvalue;
    });
  }

  private async changeStatus(id: number, deliveryStatus: string, estimatedTime?: number): Promise<void> {
    const url = `${SERVER_URL}/orders/${id}`;
    const body = { order: { deliveryStatus } };
    if (estimatedTime) {
      body.order['EstimatedDeliveryTime'] = estimatedTime;
    }
    await this.http.put(url, body);
    this.sortOrders();
    return;
  }

  public startMonitor(freq?: number): void {
    freq = freq || 60000;
    if (DataService.MONITOR_TIMEOUT !== null) {
      clearInterval(DataService.MONITOR_TIMEOUT);
    }
    DataService.MONITOR_TIMEOUT = setInterval(() => {
      console.log('monitor timeout expire', freq);
      this.getOrders();
    }, freq);
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
    if (cache) {
      console.log('get orders from cache');
      return this.orders;
    }
    const url = `${SERVER_URL}/orders`;
    const response: { orders: OrderDto[] } = await this.http.get(url);
    let count = 0;
    (response.orders || []).forEach((o: OrderDto) => {
      const index = this.orders.findIndex(v => { return v.id === o.id; });
      console.log('index', index);
      if (index < 0) {
        count++;
      }
    });
    if (count > 0) {
      this.notify(count);
    }
    this.orders = response.orders || [];
    this.sortOrders();
    
    return this.orders;
  }

  public async selectOrderById(id: number, force?: boolean): Promise<Order> {
    if (!force && this.selected && this.selected.id === id) {
      return this.selected;
    }
    const url = `${SERVER_URL}/orders/${id}`;
    const response: { order: Order } = await this.http.get(url);
    this.selected = response.order;
    return response.order;
  }

  public getSelectedOrder(): Order | null {
    return this.selected;
  }

  public clearSelectedOrder(): void {
    this.selected = null;
  }

  public async reject(order: OrderDto | Order): Promise<void> {
    const url = `${SERVER_URL}/orders/${order.id}/reject`;
    await this.http.post(url, {});
    this.sortOrders();
    return;
  }

  public async take(order: OrderDto | Order): Promise<void> {
    const url = `${SERVER_URL}/orders/${order.id}/take`;
    await this.http.post(url, {});
    this.sortOrders();
    return;
  }

  public async cancel(order: OrderDto | Order): Promise<void> {
    return this.changeStatus(order.id, 'CREATED');
  }

  public async collect(order: OrderDto | Order, estimatedTime?: number): Promise<void> {
    return this.changeStatus(order.id, 'COLLECTED', estimatedTime);
  }

  public async toStorage(order: OrderDto | Order): Promise<void> {
    return this.changeStatus(order.id, 'READY_TO_STORAGE');
  }

  public async toDelivery(order: OrderDto | Order, estimatedTime?: number): Promise<void> {
    return this.changeStatus(order.id, 'READY_TO_DELIVERY');
  }

  public async storage(order: OrderDto | Order): Promise<void> {
    return this.changeStatus(order.id, 'TO_STORAGE');
  }

  public async fail(order: OrderDto | Order): Promise<void> {
    return this.changeStatus(order.id, 'VISIT_DONE');
  }

  public async done(order: OrderDto | Order): Promise<void> {
    return this.changeStatus(order.id, 'DELIVERED');
  }

  public async lost(order: OrderDto | Order): Promise<void> {
    return this.changeStatus(order.id, 'LOST');
  }

  public addSubscriber(handler: (count: number) => void): void {
    this.observers.push(handler);
  }

  public removeSubscriber(handler: (count: number) => void): void {
    const index = this.observers.findIndex(o => o === handler);
    if (index >= 0) {
      this.observers.splice(index, 1);
    }
  }

}

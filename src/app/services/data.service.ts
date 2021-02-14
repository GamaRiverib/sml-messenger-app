import { Injectable } from '@angular/core';

import { OrderDto } from '../model/order-dto';

import { Order } from '../model/order';
import { AddressDto } from '../model/address-dto';
import { ORDER_PROGRESS, ORDER_PROGRESS_COLOR,
         SERVICE_TYPE_PRIORITY, STATUS_ICONS, 
         STATUS_ICON_COLOR, STATUS_PRIORITY } from '../app.values';
import { HttpService } from './http.service';
import { SERVER_URL } from 'src/environments/environment';
import { AuthData, LocalStorageService } from './local-storage.service';

// import * as TestData from '../data/test-orders';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private orders: OrderDto[] = [];
  private selected: Order = null;

  private authData: AuthData | null = null;

  private online: boolean = true;
  private autoAcceptOrders: boolean = false;

  private static MONITOR_TIMEOUT: any = null;

  private observers: { [event: string]: ((data?: any) => void)[] } = {};

  public static EVENTS = {
    NEW_ORDERS: 'DataService::NewOrders',
    ORDER_STATUS_CHANGE: 'DataService::OrderStatusChange',
    AUTHENTICATED: 'DataService::Authenticated'
  };

  constructor(private http: HttpService, private localStorage: LocalStorageService) {
    // TODO: Test force use web
    this.http.useWeb = true;
    this.loadAuthData();
  }

  private async loadAuthData(): Promise<void> {
    this.authData = await this.localStorage.getAuthData()
    if (this.authData && this.authData.access_token) {
      const now = Date.now();
      if (this.authData.refresh_at && now > this.authData.refresh_at) {
        return;
      }
      this.http.token = this.authData.access_token;
    }
  }

  private notify(event: string, data?: any): void {
    if (this.observers[event] && this.observers[event].length > 0) {
      this.observers[event].forEach(o => o(data));
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
    if (this.selected && this.selected.id === id) {
      this.selected.deliveryStatus = deliveryStatus;
    }
    const dto = this.orders.find(d => d.id == id);
    if (dto) {
      dto.deliveryStatus = deliveryStatus;
    }
    this.sortOrders();
    this.notify(DataService.EVENTS.ORDER_STATUS_CHANGE, { id, deliveryStatus });
    return;
  }

  public get authenticated(): boolean {
    return this.authData !== null;
  }

  public startMonitor(freq?: number): void {
    console.log('Start monitor');
    freq = freq || 60000;
    if (DataService.MONITOR_TIMEOUT !== null) {
      clearInterval(DataService.MONITOR_TIMEOUT);
    }
    DataService.MONITOR_TIMEOUT = setInterval(() => {
      this.getOrders();
    }, freq);
  }

  public stopMonitor(): void {
    console.log('Stop monitor');
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

  public async signin(user: string, password: string): Promise<boolean> {
    const headers = { 'Content-Type': 'application/json' };
    const url = `${SERVER_URL}/login`;
    const response: { token: string } = await this.http.post(url, { user, password }, headers);
    if (response && response.token) {
      this.authData = { access_token: response.token, refresh_at: 60 * 60 * 1000 };
      await this.localStorage.setAuthData(this.authData);
      this.http.token = this.authData.access_token;
      this.notify(DataService.EVENTS.AUTHENTICATED, { authenticated: true });
      return true;
    }
    return false;
  }

  public async signout(): Promise<void> {
    this.authData = null;
    this.http.token = null;
    this.notify(DataService.EVENTS.AUTHENTICATED, { authenticated: false });
    return this.localStorage.removeAuthData();
  }

  public getAuthData(): AuthData | null {
    return this.authData;
  }

  public async getOrders(cache?: boolean): Promise<OrderDto[]> {
    if (cache) {
      return this.orders;
    }
    const headers = { 'Content-Type': 'application/json' };
    const url = `${SERVER_URL}/orders`;
    const response: { orders: OrderDto[] } = await this.http.get(url, headers);
    let count = 0;
    (response.orders || []).forEach((o: OrderDto) => {
      const index = this.orders.findIndex(v => { return v.id === o.id; });
      if (index < 0) {
        count++;
      }
    });
    if (count > 0) {
      this.notify(DataService.EVENTS.NEW_ORDERS, { count });
    }
    this.orders = response.orders || [];
    this.sortOrders();
    
    return this.orders;
  }

  public async selectOrderById(id: number, force?: boolean): Promise<Order> {
    if (!force && this.selected && this.selected.id === id) {
      return this.selected;
    }
    const headers = { 'Content-Type': 'application/json' };
    const url = `${SERVER_URL}/orders/${id}`;
    const response: { order: Order } = await this.http.get(url, headers);
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
    return this.changeStatus(order.id, 'CREATED');
  }

  public async take(order: OrderDto | Order): Promise<void> {
    return this.changeStatus(order.id, 'IN_ORDER');
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
    return this.changeStatus(order.id, 'STORAGED');
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

  public addSubscriber(event: string, handler: (data?: any) => void): void {
    if (!this.observers[event]) {
      this.observers[event] = [];
    }
    this.observers[event].push(handler);
  }

  public removeSubscriber(event: string, handler: (data?: any) => void): void {
    if (this.observers[event]) {
      const index = this.observers[event].findIndex(o => o === handler);
      if (index >= 0) {
        this.observers[event].splice(index, 1);
      }
    }
  }

}

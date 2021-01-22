import { Component, OnDestroy, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { OrderDto } from '../model/order-dto';
import { DataService } from '../services/data.service';
import { OptionsComponent } from './options/options.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  public allOrders: OrderDto[] = [];
  public orders: OrderDto[] = [];
  public loadingMessage: string = '';
  public loading: boolean = false;

  constructor(private data: DataService, private popoverCtrl: PopoverController) {}

  private async loadOrders(cache?: boolean): Promise<void> {
    if (this.allOrders.length === 0) {
      this.loadingMessage = 'Loading...'
    }
    this.loading = true;
    try {
      this.allOrders = await this.data.getOrders(cache) || [];
      this.orders = this.allOrders;
    } catch (err) {
      console.log(err);
    } finally {
      if (this.allOrders.length === 0) {
        this.loadingMessage = 'No orders';
      } else {
        this.loadingMessage = '';
      }
      this.loading = false;
    }
  }

  async refresh(ev: any) {
    await this.loadOrders();
    ev.detail.complete();
  }

  private orderStatusChangeHandler() {
    this.allOrders = [];
    this.loadOrders(true);
  }

  private newOrdersHandler() {
    this.allOrders = [];
    this.loadOrders(true);
  }

  async ngOnInit() {
    this.loadOrders();
    this.data.addSubscriber(DataService.EVENTS.ORDER_STATUS_CHANGE, this.orderStatusChangeHandler.bind(this));
    this.data.addSubscriber(DataService.EVENTS.NEW_ORDERS, this.newOrdersHandler.bind(this));
  }

  ngOnDestroy(): void {
    this.data.removeSubscriber(DataService.EVENTS.ORDER_STATUS_CHANGE, this.orderStatusChangeHandler);
    this.data.removeSubscriber(DataService.EVENTS.NEW_ORDERS, this.newOrdersHandler);
  }

  async showOptions(ev: any): Promise<void> {
    const popover = await this.popoverCtrl.create({
      component: OptionsComponent,
      event: ev,
      translucent: true,
      backdropDismiss: true
    });
    popover.onDidDismiss().then(async (res: any) => {
    });
    return popover.present();
  }

  onSearchChange(ev: any) {
    if (ev && ev.detail) {
      if (!ev.detail.value) {
        this.orders = this.allOrders;
        return;
      }
      const query: string = ev.detail.value.toLowerCase();
      this.orders = this.allOrders.filter((o: OrderDto) => {
        if (o.id.toString().indexOf(query) >= 0) {
          return true;
        }
        if (o.deliveryStatus.toLocaleLowerCase().indexOf(query) >= 0) {
          return true;
        }
        if (o.serviceType.toLocaleLowerCase().indexOf(query) >= 0) {
          return true;
        }
        if (o.sourceAddress.fullAddress && o.sourceAddress.fullAddress.toLocaleLowerCase().indexOf(query) >= 0) {
          return true;
        }
        if (o.destinationAddress.fullAddress && o.destinationAddress.fullAddress.toLocaleLowerCase().indexOf(query) >= 0) {
          return true;
        }
        return false;
      });
    }
  }

}

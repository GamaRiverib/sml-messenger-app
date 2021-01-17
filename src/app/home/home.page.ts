import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { OrderDto } from '../model/order-dto';
import { DataService } from '../services/data.service';
import { OptionsComponent } from './options/options.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  public allOrders: OrderDto[] = [];
  public orders: OrderDto[] = [];
  public loadingMessage: string = '';
  public loading: boolean = false;

  constructor(private data: DataService, private popoverCtrl: PopoverController) {}

  private async loadOrders(): Promise<void> {
    if (this.orders.length === 0) {
      this.loadingMessage = 'Loading...'
    }
    this.loading = true;
    this.allOrders = await this.data.getOrders() || [];
    this.orders = this.allOrders;
    if (this.allOrders.length === 0) {
      this.loadingMessage = 'No orders';
    } else {
      this.loadingMessage = '';
    }
    this.loading = false;
  }

  async refresh(ev: any) {
    await this.loadOrders();
    ev.detail.complete();
  }

  async ngOnInit() {
    this.loadOrders();
  }

  async onOrderChange(order: OrderDto): Promise<void> {
    // this.loadOrders();
  }

  async showOptions(ev: any): Promise<void> {
    const popover = await this.popoverCtrl.create({
      component: OptionsComponent,
      event: ev,
      translucent: true,
      backdropDismiss: true
    });
    popover.onDidDismiss().then(async (res: any) => {
      console.log('popover dismiss');
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

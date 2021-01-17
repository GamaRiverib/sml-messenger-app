import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { Order } from '../model/order';
import { DataService } from '../services/data.service';
import { MylocationService } from '../services/mylocation.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.page.html',
  styleUrls: ['./view-order.page.scss'],
})
export class ViewOrderPage implements OnInit, OnDestroy {

  public order: Order;

  constructor(
    private data: DataService,
    private myLocation: MylocationService,
    private toast: ToastService,
    private actionSheetCtrl: ActionSheetController,
    private activatedRoute: ActivatedRoute,
    private alertCtrl: AlertController
  ) { }

  private async loadOrder(id: number): Promise<void> {
    this.order = await this.data.selectOrderById(id);
  }

  async ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    await this.loadOrder(parseInt(id));
  }

  ngOnDestroy() {
    this.data.clearSelectedOrder();
    this.order = null;
  }

  getBackButtonText() {
    const win = window as any;
    const mode = win && win.Ionic && win.Ionic.mode;
    return mode === 'ios' ? 'Orders' : '';
  }

  tabChange(ev: any) {
    // console.log('Tab change event', event);
  }

  private async estimateTime(): Promise<number | null> {
    if (!this.order) {
      return null;
    }
    const source = this.order.sourceAddress;
    const destination = this.order.destinationAddress;
    const resp = await this.myLocation.deliveryDistanceFromMyPosition(source, destination);
    return resp.time;
  }

  private async reject() {
    const alert = await this.alertCtrl.create({
      header: 'Reject order!',
      message: 'Are you sure you want to <b>REJECT</b> the order?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Yes',
          handler: async () => {
            await this.data.reject(this.order);
            this.toast.showLongTop(`Order #${this.order.id} rejected.`);
            // this.change.emit();
          }
        }
      ]
    });
    await alert.present();
  }

  private take() {
    this.data.take(this.order);
  }

  private async suspend() {
    const alert = await this.alertCtrl.create({
      header: 'Suspend order!',
      message: 'Are you sure you want to <b>SUSPEND</b> the order?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Yes',
          handler: async () => {
            await this.data.cancel(this.order);
            this.toast.showLongTop(`Order #${this.order.id} suspended.`);
            // this.change.emit();
          }
        }
      ]
    });
    await alert.present();
  }

  private async collect() {
    const estimatedTime = await this.estimateTime();
    this.data.collect(this.order, estimatedTime);
    this.toast.showLongTop(`Order #${this.order.id} collected.`);
  }

  private gotoStorage() {
    this.data.toStorage(this.order);
    this.toast.showLongTop(`Order #${this.order.id} on the way to the warehouse.`);
  }

  private async gotoDelivery() {
    const estimatedTime = await this.estimateTime();
    this.data.toDelivery(this.order, estimatedTime);
    this.toast.showLongTop(`Order #${this.order.id} in delivery.`);
  }

  private store() {
    this.data.storage(this.order);
    this.toast.showLongTop(`Order #${this.order.id} in the warehouse.`);
  }

  private fail() {
    this.data.fail(this.order);
    this.toast.showLongTop(`Order #${this.order.id} could not be delivered.`);
  }

  private done() {
    this.data.done(this.order);
    this.toast.showLongTop(`Order #${this.order.id} was delivered.`);
  }

  private lost() {
    this.data.lost(this.order);
    this.toast.showLongTop(`Order #${this.order.id} is lost.`);
  }

  async showOptions(ev: any) {
    if (!this.order) {
      return;
    }
    if (this.order.deliveryStatus === 'DELIVERED' || this.order.deliveryStatus === 'STORAGED') {
      return;
    }
    const status = this.order.deliveryStatus;
    const buttons = [];

    if (status === 'QUEUED' || status === 'CREATED') {
      buttons.push({
        text: 'Reject order',
        role: 'desctructive',
        icon: 'close',
        handler: this.reject.bind(this)
      });
      buttons.push({
        text: 'Take order',
        icon: 'checkmark',
        handler: this.take.bind(this)
      });
    } else if (status === 'IN_ORDER') {
      buttons.push({
        text: 'Suspend order',
        role: 'desctructive',
        icon: 'close',
        handler: this.suspend.bind(this)
      });
      buttons.push({
        text: 'Collected',
        icon: 'checkmark',
        handler: this.collect.bind(this)
      });
    } else if (status === 'COLLECTED' || status === 'VISIT_DONE' || status === 'VISIT_CANCELED'
               || status === 'VISIT_SUSPENDED' || status === 'RETURNED') {
      buttons.push({
        text: 'Report as lost',
        icon: 'search-circle',
        handler: this.lost.bind(this)
      });
      buttons.push({
        text: 'Go to storage',
        icon: 'archive',
        handler: this.gotoStorage.bind(this)
      });
      buttons.push({
        text: 'Go to delivery',
        icon: 'rocket',
        handler: this.gotoDelivery.bind(this)
      });
    } else if (status === 'READY_TO_STORAGE' || status === 'TO_STORAGE') {
      buttons.push({
        text: 'Report as lost',
        icon: 'search-circle',
        handler: this.lost.bind(this)
      });
      buttons.push({
        text: 'Stored',
        icon: 'archive',
        handler: this.store.bind(this)
      });
    } else if (status === 'READY_TO_DELIVERY') {
      buttons.push({
        text: 'Report as lost',
        icon: 'search-circle',
        handler: this.lost.bind(this)
      });
      buttons.push({
        text: 'Returned by recipient',
        icon: 'alert-circle',
        handler: this.fail.bind(this)
      });
      buttons.push({
        text: 'Delivery failed',
        role: 'desctructive',
        icon: 'warning',
        handler: this.fail.bind(this)
      });
      buttons.push({
        text: 'Successfully delivered',
        icon: 'checkmark-done',
        handler: this.done.bind(this)
      });
    }
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Actions',
      buttons
    });
    await actionSheet.present();
  }

}

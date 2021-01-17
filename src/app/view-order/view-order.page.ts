import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { Order } from '../model/order';
import { DataService } from '../services/data.service';
import { MylocationService } from '../services/mylocation.service';

@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.page.html',
  styleUrls: ['./view-order.page.scss'],
})
export class ViewOrderPage implements OnInit {

  public order: Order;

  constructor(
    private data: DataService,
    private myLocation: MylocationService,
    private actionSheetCtrl: ActionSheetController,
    private activatedRoute: ActivatedRoute
  ) { }

  private async loadOrder(id: number): Promise<void> {
    this.order = await this.data.getOrderById(id);
  }

  async ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    await this.loadOrder(parseInt(id));
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
    const resp = await this.myLocation.calculateRoute(source, destination);
    return resp.time;
  }

  private reject() {
    this.data.reject(this.order);
  }

  private take() {
    this.data.take(this.order);
  }

  private cancel() {
    this.data.cancel(this.order);
  }

  private async collect() {
    const estimatedTime = await this.estimateTime();
    this.data.collect(this.order, estimatedTime);
  }

  private gotoStorage() {
    this.data.toStorage(this.order);
  }

  private async gotoDelivery() {
    const estimatedTime = await this.estimateTime();
    this.data.toDelivery(this.order, estimatedTime);
  }

  private store() {
    this.data.storage(this.order);
  }

  private fail() {
    this.data.fail(this.order);
  }

  private done() {
    this.data.done(this.order);
  }

  private lost() {
    this.data.lost(this.order);
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
        text: 'Cancel order',
        role: 'desctructive',
        icon: 'close',
        handler: this.cancel.bind(this)
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

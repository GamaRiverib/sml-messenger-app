import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { Order } from '../model/order';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.page.html',
  styleUrls: ['./view-order.page.scss'],
})
export class ViewOrderPage implements OnInit {

  public order: Order;

  constructor(
    private data: DataService,
    private actionSheetCtrl: ActionSheetController,
    private activatedRoute: ActivatedRoute
  ) { }

  private async loadOrder(id: number): Promise<void> {
    this.order = await this.data.getOrderById(id);
  }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.loadOrder(parseInt(id));
  }

  getBackButtonText() {
    const win = window as any;
    const mode = win && win.Ionic && win.Ionic.mode;
    return mode === 'ios' ? 'Orders' : '';
  }

  tabChange(ev: any) {
    // console.log('Tab change event', event);
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

  private collect() {
    // estimated time
    this.data.collect(this.order);
  }

  private gotoStorage() {
    this.data.toStorage(this.order);
  }

  private gotoDelivery() {
    // estimated time
    this.data.toDelivery(this.order);
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

  async showOptions() {
    if (!this.order) {
      return;
    }
    const status = this.order.DeliveryStatus;
    const buttons = [];

    if (status === 'QUEUED' || status === 'CREATED') {
      buttons.push({
        text: 'Reject order',
        role: 'desctructive',
        icon: 'close',
        handler: this.reject
      });
      buttons.push({
        text: 'Take order',
        icon: 'checkmark',
        handler: this.take
      });
    } else if (status === 'IN_ORDER') {
      buttons.push({
        text: 'Cancel order',
        role: 'desctructive',
        icon: 'close',
        handler: this.cancel
      });
      buttons.push({
        text: 'Collected',
        icon: 'checkmark',
        handler: this.collect
      });
    } else if (status === 'COLLECTED' || status === 'VISIT_DONE' || status === 'VISIT_CANCELED'
               || status === 'VISIT_SUSPENDED' || status === 'RETURNED') {
      buttons.push({
        text: 'Report as lost',
        icon: 'search-circle',
        handler: this.lost
      });
      buttons.push({
        text: 'Go to storage',
        icon: 'archive',
        handler: this.gotoStorage
      });
      buttons.push({
        text: 'Go to delivery',
        icon: 'rocket',
        handler: this.gotoDelivery
      });
    } else if (status === 'READY_TO_STORAGE' || status === 'TO_STORAGE') {
      buttons.push({
        text: 'Report as lost',
        icon: 'search-circle',
        handler: this.lost
      });
      buttons.push({
        text: 'Stored',
        icon: 'archive',
        handler: this.store
      });
    } else if (status === 'READY_TO_DELIVERY') {
      buttons.push({
        text: 'Report as lost',
        icon: 'search-circle',
        handler: this.lost
      });
      buttons.push({
        text: 'Returned by recipient',
        icon: 'alert-circle',
        handler: this.fail
      });
      buttons.push({
        text: 'Delivery failed',
        role: 'desctructive',
        icon: 'warning',
        handler: this.fail
      });
      buttons.push({
        text: 'Successfully delivered',
        icon: 'checkmark-done',
        handler: this.done
      });
    }
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Actions',
      buttons
    });
    await actionSheet.present();
  }

}

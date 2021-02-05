import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { KEYS, STATUS } from '../app.values';
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
  public loadingMessage: string = '';
  public loading: boolean = false;

  private ordersText: string = 'Orders';

  constructor(
    private data: DataService,
    private translate: TranslateService,
    private myLocation: MylocationService,
    private toast: ToastService,
    private actionSheetCtrl: ActionSheetController,
    private activatedRoute: ActivatedRoute,
    private alertCtrl: AlertController
  ) {
    // this.translate.setDefaultLang('es');
    this.translate.get(KEYS.ORDERS).subscribe((v: string) => {
      this.ordersText = `${v || 'Orders'}`;
    });
  }

  async ngOnInit() {
    this.translate.get(KEYS.LOADING).subscribe((v: string) => {
      this.loadingMessage = `${v || 'Loading'}...`;
    });
    this.loading = true;
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.order = await this.data.selectOrderById(parseInt(id));
    this.loadingMessage = '';
    this.loading = false;
  }

  ngOnDestroy() {
    this.data.clearSelectedOrder();
    this.order = null;
  }

  getBackButtonText() {
    const win = window as any;
    const mode = win && win.Ionic && win.Ionic.mode;
    return mode === 'ios' ? this.ordersText : '';
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
    const keys: string[] = [
      KEYS.REJECT, KEYS.ORDER,
      KEYS.ORDER_PAGE.CONFIRM_REJECT,
      KEYS.NO, KEYS.YES,
    ];
    const values: { [key: string]: string } = await this.translate.get(keys).toPromise();
    console.log({values});
    const alert = await this.alertCtrl.create({
      header: `${values.REJECT} ${values.ORDER.toLowerCase()}!`,
      message: values[KEYS.ORDER_PAGE.CONFIRM_REJECT],
      buttons: [
        {
          text: KEYS.NO,
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: KEYS.YES,
          handler: async () => {
            await this.data.reject(this.order);
            const params = { id: this.order.id };
            const key = KEYS.ORDER_PAGE.REJECTED_MESSAGE;
            const msg: string = await this.translate.get(key, params).toPromise();
            this.toast.showLongTop(msg);
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
    const keys: string[] = [
      KEYS.SUSPEND, KEYS.ORDER,
      KEYS.ORDER_PAGE.CONFIRM_SUSPEND,
      KEYS.NO, KEYS.YES,
    ];
    const values: { [key: string]: string } = await this.translate.get(keys).toPromise();
    console.log({values});
    const alert = await this.alertCtrl.create({
      header: `${values.SUSPEND} ${values.ORDER.toLowerCase()}!`,
      message: values[KEYS.ORDER_PAGE.CONFIRM_SUSPEND],
      buttons: [
        {
          text: KEYS.NO,
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: KEYS.YES,
          handler: async () => {
            await this.data.cancel(this.order);
            const params = { id: this.order.id };
            const key = KEYS.ORDER_PAGE.SUSPENDED_MESSAGE;
            const msg: string = await this.translate.get(key, params).toPromise();
            this.toast.showLongTop(msg);
            // this.change.emit();
          }
        }
      ]
    });
    await alert.present();
  }

  private async collect() {
    const estimatedTime = await this.estimateTime();
    await this.data.collect(this.order, estimatedTime);
    const params = { id: this.order.id };
    const key = KEYS.ORDER_PAGE.COLLECTED_MESSAGE;
    const msg: string = await this.translate.get(key, params).toPromise();
    this.toast.showLongTop(msg);
  }

  private gotoStorage() {
    this.data.toStorage(this.order);
    this.toast.showLongTop(`Order #${this.order.id} on the way to the warehouse.`);
  }

  private async gotoDelivery() {
    const estimatedTime = await this.estimateTime();
    await this.data.toDelivery(this.order, estimatedTime);
    const params = { id: this.order.id };
    const key = KEYS.ORDER_PAGE.IN_DELIVERY;
    const msg: string = await this.translate.get(key, params).toPromise();
    this.toast.showLongTop(msg);
  }

  private async store() {
    await this.data.storage(this.order);
    const params = { id: this.order.id };
    const key = KEYS.ORDER_PAGE.ON_WAY_TO_WAREHOUSE;
    const msg: string = await this.translate.get(key, params).toPromise();
    this.toast.showLongTop(msg);
  }

  private async fail() {
    await this.data.fail(this.order);
    const params = { id: this.order.id };
    const key = KEYS.ORDER_PAGE.COULD_NOT_BE_DELIVERED;
    const msg: string = await this.translate.get(key, params).toPromise();
    this.toast.showLongTop(msg);
  }

  private async done() {
    await this.data.done(this.order);
    const params = { id: this.order.id };
    const key = KEYS.ORDER_PAGE.WAS_DELIVERED;
    const msg: string = await this.translate.get(key, params).toPromise();
    this.toast.showLongTop(msg);
  }

  private async lost() {
    await this.data.lost(this.order);
    const params = { id: this.order.id };
    const key = KEYS.VIEW_ORDER_PAGE.IS_LOST;
    const msg: string = await this.translate.get(key, params).toPromise();
    this.toast.showLongTop(msg);
  }

  async showOptions(ev: any) {
    if (!this.order) {
      return;
    }
    if (this.order.deliveryStatus === STATUS.DELIVERED || this.order.deliveryStatus === STATUS.STORAGED) {
      return;
    }
    const status = this.order.deliveryStatus;
    const buttons = [];

    if (status === STATUS.QUEUED || status === STATUS.CREATED) {
      const keys: string[] = [KEYS.REJECT, KEYS.ORDER, KEYS.TAKE];
      const values: { [key: string]: string } = await this.translate.get(keys).toPromise();
      console.log({values});
      buttons.push({
        text: `${values.REJECT} ${values.ORDER.toLowerCase()}`,
        role: 'desctructive',
        icon: 'close',
        handler: this.reject.bind(this)
      });
      buttons.push({
        text: `${values.TAKE} ${values.ORDER.toLowerCase()}`,
        icon: 'checkmark',
        handler: this.take.bind(this)
      });
    } else if (status === STATUS.IN_ORDER) {
      const keys: string[] = [KEYS.SUSPEND, KEYS.ORDER, KEYS.COLLECTED];
      const values: { [key: string]: string } = await this.translate.get(keys).toPromise();
      console.log({values});
      buttons.push({
        text: `${values.SUSPEND} ${values.ORDER.toLowerCase()}`,
        role: 'desctructive',
        icon: 'close',
        handler: this.suspend.bind(this)
      });
      buttons.push({
        text: values.COLLECTED,
        icon: 'checkmark',
        handler: this.collect.bind(this)
      });
    } else if (status === STATUS.COLLECTED || status === STATUS.VISIT_DONE || status === STATUS.VISIT_CANCELED
               || status === STATUS.VISIT_SUSPENDED || status === STATUS.RETURNED) {

      const vop = KEYS.VIEW_ORDER_PAGE;
      const keys: string[] = [vop.REPORT_AS_LOST, vop.GO_TO_STORAGE, vop.GO_TO_DELIVERY];
      const values: { [key: string]: string } = await this.translate.get(keys).toPromise();
      buttons.push({
        text: values[vop.REPORT_AS_LOST],
        icon: 'search-circle',
        handler: this.lost.bind(this)
      });
      buttons.push({
        text: values[vop.GO_TO_STORAGE],
        icon: 'archive',
        handler: this.gotoStorage.bind(this)
      });
      buttons.push({
        text: values[vop.GO_TO_DELIVERY],
        icon: 'rocket',
        handler: this.gotoDelivery.bind(this)
      });
    } else if (status === STATUS.READY_TO_STORAGE || status === STATUS.TO_STORAGE) {
      const vop = KEYS.VIEW_ORDER_PAGE;
      const keys: string[] = [vop.REPORT_AS_LOST, KEYS.STORED];
      const values: { [key: string]: string } = await this.translate.get(keys).toPromise();
      buttons.push({
        text: values[vop.REPORT_AS_LOST],
        icon: 'search-circle',
        handler: this.lost.bind(this)
      });
      buttons.push({
        text: values.STORED,
        icon: 'archive',
        handler: this.store.bind(this)
      });
    } else if (status === STATUS.READY_TO_DELIVERY) {
      const vop = KEYS.VIEW_ORDER_PAGE;
      const keys: string[] = [
        vop.REPORT_AS_LOST,
        vop.RETURNED_BY_RECIPIENT,
        vop.DELIVERY_FAILED,
        vop.SUCCESSFULLY_DELIVERED
      ];
      const values: { [key: string]: string } = await this.translate.get(keys).toPromise();
      buttons.push({
        text: values[vop.REPORT_AS_LOST],
        icon: 'search-circle',
        handler: this.lost.bind(this)
      });
      buttons.push({
        text: values[vop.RETURNED_BY_RECIPIENT],
        icon: 'alert-circle',
        handler: this.fail.bind(this)
      });
      buttons.push({
        text: values[vop.DELIVERY_FAILED],
        role: 'desctructive',
        icon: 'warning',
        handler: this.fail.bind(this)
      });
      buttons.push({
        text: values[vop.SUCCESSFULLY_DELIVERED],
        icon: 'checkmark-done',
        handler: this.done.bind(this)
      });
    }
    const header = await this.translate.get(KEYS.ACTIONS).toPromise();
    const actionSheet = await this.actionSheetCtrl.create({
      header,
      buttons
    });
    await actionSheet.present();
  }

}

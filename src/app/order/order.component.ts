import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AlertController, IonItemSliding } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { KEYS, SERVICE, STATUS } from '../app.values';
import { AddressDto } from '../model/address-dto';
import { OrderDto } from '../model/order-dto';
import { DataService } from '../services/data.service';
import { MylocationService } from '../services/mylocation.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit, OnDestroy {
  
  @Input() order: OrderDto;
  @Output() change: EventEmitter<any> = new EventEmitter();
  public nextAddress: string;
  public distance: number;
  public estimatedTime: number;
  public directionsToSource: string;
  public directionsToDestination: string;

  constructor(
    private data: DataService,
    private translate: TranslateService,
    private myLocation: MylocationService,
    private toast: ToastService,
    private alertCtrl: AlertController
    ) {
      // this.translate.setDefaultLang('es');
    }

  private orderStatusChangeHandler(data: {id: number, deliveryStatus: string}) {
    if (data && this.order.id === data.id) {
      this.order.deliveryStatus = data.deliveryStatus; 
    }
  }

  async ngOnInit() {
    this.updateDistanceAndTime();
    const baseUrl = 'https://maps.google.com?saddr=My+Location&daddr=';
    this.directionsToSource = `${baseUrl}${this.order.sourceAddress.latitude},${this.order.sourceAddress.longitude}`;
    this.directionsToDestination = `${baseUrl}${this.order.destinationAddress.latitude},${this.order.destinationAddress.longitude}`;
    this.data.addSubscriber(DataService.EVENTS.ORDER_STATUS_CHANGE, this.orderStatusChangeHandler.bind(this));
  }

  ngOnDestroy(): void {
    this.data.removeSubscriber(DataService.EVENTS.ORDER_STATUS_CHANGE, this.orderStatusChangeHandler);
  }

  isIos() {
    const win = window as any;
    return win && win.Ionic && win.Ionic.mode === 'ios';
  }

  private async updateDistanceAndTime(): Promise<void> {
    if (!this.order) {
      this.nextAddress = '';
      return;
    }
    
    // CREATED, QUEUED, IN_ORDER, RETURNED -> SourceAddress
    let destination: AddressDto | null = this.order.sourceAddress;
    
    if (
      this.order.deliveryStatus === STATUS.READY_TO_DELIVERY ||
      this.order.deliveryStatus === STATUS.DELIVERED ||
      this.order.deliveryStatus === STATUS.VISIT_DONE ||
      this.order.deliveryStatus === STATUS.VISIT_CANCELED ||
      this.order.deliveryStatus === STATUS.VISIT_SUSPENDED) {
        destination = this.order.destinationAddress;
    } else if (
      this.order.deliveryStatus === STATUS.READY_TO_STORAGE ||
      this.order.deliveryStatus === STATUS.TO_STORAGE ||
      this.order.deliveryStatus === STATUS.TO_NEXT_VISIT ||
      this.order.deliveryStatus === STATUS.STORAGED) {
        destination = this.data.getStorageAddress();
    } else if (this.order.deliveryStatus === STATUS.COLLECTED) {
      if (this.order.serviceType === SERVICE.NEXT_DAY) {
        destination = this.data.getStorageAddress();
      } else {
        destination = this.order.destinationAddress;
      }
    }
    if (destination) {
      const resp = this.myLocation.distanceFromMyPosition(destination);
      this.nextAddress = destination.fullAddress;
      this.distance = (await resp).distance;
      this.estimatedTime = (await resp).time;
    }
  }

  get icon(): string {
    if (!this.order) {
      return 'alert-circle';
    }
    return this.data.getStatusIcon(this.order);
  }

  get color(): string {
    if (!this.order) {
      return '';
    }
    return this.data.getStatusIconColor(this.order);
  }

  async reject(slidingItem: IonItemSliding): Promise<void> {
    await slidingItem.close();
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
          text: values.NO,
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: values.YES,
          handler: async () => {
            await this.data.reject(this.order);
            const params = { id: this.order.id };
            const key = KEYS.ORDER_PAGE.REJECTED_MESSAGE;
            const msg: string = await this.translate.get(key, params).toPromise();
            this.toast.showLongTop(msg);
            this.change.emit();
          }
        }
      ]
    });
    await alert.present();
  }

  async take(slidingItem: IonItemSliding): Promise<void> {
    await slidingItem.close();
    await this.data.take(this.order);
    const params = { id: this.order.id };
    const key = KEYS.ORDER_PAGE.ORDER_ASSIGNED;
    const msg: string = await this.translate.get(key, params).toPromise();
    this.toast.showLongTop(msg);
    this.change.emit();
  }

  async suspend(slidingItem: IonItemSliding): Promise<void> {
    await slidingItem.close();
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
          text: values.NO,
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: values.YES,
          handler: async () => {
            await this.data.cancel(this.order);
            const params = { id: this.order.id };
            const key = KEYS.ORDER_PAGE.SUSPENDED_MESSAGE;
            const msg: string = await this.translate.get(key, params).toPromise();
            this.toast.showLongTop(msg);
            this.change.emit();
          }
        }
      ]
    });
    await alert.present();
  }

  async collect(slidingItem: IonItemSliding): Promise<void> {
    await slidingItem.close();
    await this.data.collect(this.order, this.estimatedTime);
    const params = { id: this.order.id };
    const key = KEYS.ORDER_PAGE.COLLECTED_MESSAGE;
    const msg: string = await this.translate.get(key, params).toPromise();
    this.toast.showLongTop(msg);
    this.change.emit();
  }

  async toStorage(slidingItem: IonItemSliding): Promise<void> {
    await slidingItem.close();
    await this.data.toStorage(this.order);
    const params = { id: this.order.id };
    const key = KEYS.ORDER_PAGE.ON_WAY_TO_WAREHOUSE;
    const msg: string = await this.translate.get(key, params).toPromise();
    this.toast.showLongTop(msg);
    this.change.emit();
  }

  async toDelivery(slidingItem: IonItemSliding): Promise<void> {
    await slidingItem.close();
    await this.data.toDelivery(this.order, this.estimatedTime);
    const params = { id: this.order.id };
    const key = KEYS.ORDER_PAGE.IN_DELIVERY;
    const msg: string = await this.translate.get(key, params).toPromise();
    this.toast.showLongTop(msg);
    this.change.emit();
  }

  async storage(slidingItem: IonItemSliding): Promise<void> {
    await slidingItem.close();
    await this.data.storage(this.order);
    const params = { id: this.order.id };
    const key = KEYS.ORDER_PAGE.IN_THE_WAREHOUSE;
    const msg: string = await this.translate.get(key, params).toPromise();
    this.toast.showLongTop(msg);
    this.change.emit();
  }

  async fail(slidingItem: IonItemSliding): Promise<void> {  
    await slidingItem.close();
    await this.data.fail(this.order);
    const params = { id: this.order.id };
    const key = KEYS.ORDER_PAGE.COULD_NOT_BE_DELIVERED;
    const msg: string = await this.translate.get(key, params).toPromise();
    this.toast.showLongTop(msg);
    this.change.emit();
  }

  async done(slidingItem: IonItemSliding): Promise<void> {
    await slidingItem.close();
    await this.data.done(this.order);
    const params = { id: this.order.id };
    const key = KEYS.ORDER_PAGE.WAS_DELIVERED;
    const msg: string = await this.translate.get(key, params).toPromise();
    this.toast.showLongTop(msg);
    this.change.emit();
  }

}

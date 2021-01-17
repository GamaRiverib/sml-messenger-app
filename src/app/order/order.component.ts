import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlertController, IonItemSliding } from '@ionic/angular';
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
export class OrderComponent implements OnInit {
  
  @Input() order: OrderDto;
  @Output() change: EventEmitter<any> = new EventEmitter();
  public nextAddress: string;
  public distance: number;
  public estimatedTime: number;
  public directionsToSource: string;
  public directionsToDestination: string;

  constructor(
    private data: DataService,
    private myLocation: MylocationService,
    private toast: ToastService,
    private alertCtrl: AlertController
    ) { }

  async ngOnInit() {
    this.updateDistanceAndTime();
    const baseUrl = 'https://maps.google.com?saddr=My+Location&daddr=';
    this.directionsToSource = `${baseUrl}${this.order.sourceAddress.latitude},${this.order.sourceAddress.longitude}`;
    this.directionsToDestination = `${baseUrl}${this.order.destinationAddress.latitude},${this.order.destinationAddress.longitude}`;
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
      this.order.deliveryStatus === 'READY_TO_DELIVERY' ||
      this.order.deliveryStatus === 'DELIVERED' ||
      this.order.deliveryStatus === 'VISIT_DONE'||
      this.order.deliveryStatus === 'VISIT_CANCELED' ||
      this.order.deliveryStatus === 'VISIT_SUSPENDED') {
        destination = this.order.destinationAddress;
    } else if (
      this.order.deliveryStatus === 'READY_TO_STORAGE' ||
      this.order.deliveryStatus === 'TO_STORAGE' ||
      this.order.deliveryStatus === 'TO_NEXT_VISIT' ||
      this.order.deliveryStatus === 'STORAGED') {
        destination = this.data.getStorageAddress();
    } else if (this.order.deliveryStatus === 'COLLECTED') {
      if (this.order.serviceType === 'NEXT_DAY') {
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
    this.toast.showLongTop(`Order #${this.order.id} was assigned to you.`);
    this.change.emit();
  }

  async suspend(slidingItem: IonItemSliding): Promise<void> {
    await slidingItem.close();
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
    this.toast.showLongTop(`Order #${this.order.id} collected.`);
    this.change.emit();
  }

  async toStorage(slidingItem: IonItemSliding): Promise<void> {
    await slidingItem.close();
    await this.data.toStorage(this.order);
    this.toast.showLongTop(`Order #${this.order.id} on the way to the warehouse.`);
    this.change.emit();
  }

  async toDelivery(slidingItem: IonItemSliding): Promise<void> {
    await slidingItem.close();
    await this.data.toDelivery(this.order, this.estimatedTime);
    this.toast.showLongTop(`Order #${this.order.id} in delivery.`);
    this.change.emit();
  }

  async storage(slidingItem: IonItemSliding): Promise<void> {
    await slidingItem.close();
    await this.data.storage(this.order);
    this.toast.showLongTop(`Order #${this.order.id} in the warehouse.`);
    this.change.emit();
  }

  async fail(slidingItem: IonItemSliding): Promise<void> {  
    await slidingItem.close();
    await this.data.fail(this.order);
    this.toast.showLongTop(`Order #${this.order.id} could not be delivered.`);
    this.change.emit();
  }

  async done(slidingItem: IonItemSliding): Promise<void> {
    await slidingItem.close();
    await this.data.done(this.order);
    this.toast.showLongTop(`Order #${this.order.id} was delivered.`);
    this.change.emit();
  }

}

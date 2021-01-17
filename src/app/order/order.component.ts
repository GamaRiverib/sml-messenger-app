import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { AlertController, IonItemSliding } from '@ionic/angular';
import { OrderDto } from '../model/order-dto';
import { DataService } from '../services/data.service';
import { MylocationService } from '../services/mylocation.service';

const icons = {
  CREATED: 'ellipse',
  QUEUED: 'help-circle',
  IN_ORDER: 'navigate',
  COLLECTED: 'navigate',
  READY_TO_STORAGE: 'archive',
  READY_TO_DELIVERY: 'navigate',
  DELIVERED: 'checkmark-done-circle',
  TO_STORAGE: 'archive',
  TO_NEXT_VISIT: 'help-circle',
  VISIT_DONE: 'alert-circle',
  STORAGED: 'archive',
  VISIT_CANCELED: 'warning',
  DELETED: 'close-circle',
  VISIT_SUSPENDED: 'warning',
  RETURNED: 'warning',
  LOST: 'warning'
};

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit {

  @Input() order: OrderDto;
  @Output() change: EventEmitter<any> = new EventEmitter();
  public distance: number;
  public estimatedTime: number;
  public directionsToSource: string;
  public directionsToDestination: string;

  constructor(
    private data: DataService,
    private myLocation: MylocationService,
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
      return;
    }
    const source = this.order.sourceAddress;
    const destination = this.order.destinationAddress;
    const resp = this.myLocation.calculateRoute(source, destination);
    this.distance = (await resp).distance;
    this.estimatedTime = (await resp).time;
  }

  get icon(): string {
    if (!this.order) {
      return 'alert-circle';
    }
    return icons[this.order.deliveryStatus] || 'alert-circle'
  }

  get color(): string {
    if (!this.order) {
      return '';
    }
    const s = this.order.deliveryStatus;
    const t = this.order.serviceType;
    if (s === 'CREATED') {
      return 'secondary';
    }
    if (s === 'QUEUED') {
      if (t === 'NEXT_DAY') {
        return 'warning';
      }
      return 'danger';
    }
    if (s === 'IN_ORDER') {
      if (t === 'NEXT_DAY') {
        return 'tertiary';
      }
      if (t === 'SAME_DAY') {
        return 'warning'        
      }
      return 'danger'
    }
    if (s === 'COLLECTED') {
      if (t === 'NEXT_DAY') {
        return 'tertiary';
      }
      return '';
    }
    if (s === 'READY_TO_DELIVERY') {
      return 'success';
    }
    if (s === 'DELIVERED') {
      return 'success';
    }
    if (s === 'VISIT_DONE' || s === 'RETURNED' || s === 'VISIT_CANCELED') {
      return 'danger';
    }
    if (s === 'VISIT_SUSPENDED') {
      return 'warning';
    }
    if (s === 'TO_STORAGE') {
      return 'tertiary';
    }
    if (s === 'STORAGED') {
      return 'success';
    }
    return '';
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
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Yes',
          handler: async () => {
            await this.data.reject(this.order);
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
    this.change.emit();
  }

  async cancel(slidingItem: IonItemSliding): Promise<void> {
    await slidingItem.close();
    const alert = await this.alertCtrl.create({
      header: 'Cancel order!',
      message: 'Are you sure you want to <b>CANCEL</b> the order?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Yes',
          handler: async () => {
            await this.data.cancel(this.order);
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
    this.change.emit();
  }

  async toStorage(slidingItem: IonItemSliding): Promise<void> {
    await slidingItem.close();
    await this.data.toStorage(this.order);
    this.change.emit();
  }

  async toDelivery(slidingItem: IonItemSliding): Promise<void> {
    await slidingItem.close();
    await this.data.toDelivery(this.order, this.estimatedTime);
    this.change.emit();
  }

  async storage(slidingItem: IonItemSliding): Promise<void> {
    await slidingItem.close();
    await this.data.storage(this.order);
    this.change.emit();
  }

  async fail(slidingItem: IonItemSliding): Promise<void> {  
    await slidingItem.close();
    await this.data.fail(this.order);
    this.change.emit();
  }

  async done(slidingItem: IonItemSliding): Promise<void> {
    await slidingItem.close();
    await this.data.done(this.order);
    this.change.emit();
  }

}

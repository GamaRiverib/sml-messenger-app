import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ForegroundService } from '@ionic-native/foreground-service/ngx';
import { ILocalNotification, LocalNotifications } from '@ionic-native/local-notifications/ngx';

import { DataService } from './services/data.service';
import { ToastService } from './services/toast.service';
import { HTTP } from '@ionic-native/http/ngx';
import { MONITOR_DELAY, MONITOR_DELAY_ON_PAUSE } from './app.values';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private foreground: ForegroundService,
    private data: DataService,
    private toast: ToastService,
    private localNotifications: LocalNotifications,
    private http: HTTP,
  ) {
    this.initializeApp();
  }

  private showNotification(text: string, title?: string): void {
    if (this.platform.is('hybrid')) {
      const notification: ILocalNotification = {
        title,
        text,
        foreground: true,
        vibrate: true
      };
      this.localNotifications.schedule(notification);
    } else {
      this.toast.showLongTop(text, title, [100, 100]);
    }
  }

  private newOrdersHandler(data?: { count: number }): void {
    if (data) {
      const text = data.count === 1 ? 'There is a new order.' : `There are ${data.count} new orders.`
      const title = 'New Orders';
      this.showNotification(text, title);
    }
  }

  private orderStatusChangeHandler(data?: { id: number, deliveryStatus: string }) {
    if (data) {
      const text = `Changes to ${data.deliveryStatus}`;
      const title = `Order #${data.id} updated`;
      this.showNotification(text, title);
    }
  }

  initializeApp() {

    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      const mode = 'nocheck'; //SERVER_TRUST_MODE as 'nocheck' | 'default' | 'legacy' | 'pinned';
      this.http.setServerTrustMode(mode).then(() => {
        console.log(`Set server trust mode ${mode} successful`);
      }).catch((reason: any) => {
        console.log(`Set server trust mode ${mode} fails`, reason);
      });

      this.platform.resume.subscribe(async () => {
        this.foreground.stop();
        this.data.startMonitor(MONITOR_DELAY);
      });
  
      this.platform.pause.subscribe(async () => {
        if (this.data.getOnlineMode())   {
          this.foreground.start('SML Messenger App', 'Waiting for new orders', 'icon');
          this.data.startMonitor(MONITOR_DELAY_ON_PAUSE);
        } else {
          this.foreground.stop();
          this.data.stopMonitor();
          this.data.removeSubscriber(DataService.EVENTS.NEW_ORDERS, this.newOrdersHandler);
          this.data.removeSubscriber(DataService.EVENTS.ORDER_STATUS_CHANGE, this.orderStatusChangeHandler);
        }
      });
  
      this.data.addSubscriber(DataService.EVENTS.NEW_ORDERS, this.newOrdersHandler.bind(this));
      this.data.addSubscriber(DataService.EVENTS.ORDER_STATUS_CHANGE, this.orderStatusChangeHandler.bind(this));
  
      this.localNotifications.on('click').toPromise().then((val: any) => {
        console.log('notification click', val);
      });

      this.data.startMonitor(MONITOR_DELAY);

    });
  }
}

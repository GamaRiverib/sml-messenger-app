import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ForegroundService } from '@ionic-native/foreground-service/ngx';
import { ILocalNotification, LocalNotifications } from '@ionic-native/local-notifications/ngx';

import { DataService } from './services/data.service';
import { ToastService } from './services/toast.service';
import { HTTP } from '@ionic-native/http/ngx';
import { KEYS, MONITOR_DELAY, MONITOR_DELAY_ON_PAUSE } from './app.values';
import { TranslateService } from '@ngx-translate/core';
import { Globalization } from '@ionic-native/globalization/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  constructor(
    private translate: TranslateService,
    private globalization: Globalization,
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

  private async newOrdersHandler(data?: { count: number }): Promise<void> {
    if (data) {
      let text = '';
      if (data.count === 1) {
        text = await this.translate.get(KEYS.APP.NEW_ORDER_MESSAGE).toPromise();
      } else {
        const params = { count: data.count };
        text = await this.translate.get(KEYS.APP.NEW_ORDERS_MESSAGE, params).toPromise();
      }
      const title = await this.translate.get(KEYS.APP.NEW_ORDER_TITLE).toPromise();
      this.showNotification(text, title);
    }
  }

  private async orderStatusChangeHandler(data?: { id: number, deliveryStatus: string }) {
    if (data) {
      const key: string = KEYS.STATUS[data.deliveryStatus] ? KEYS.STATUS[data.deliveryStatus].SHORT : KEYS.STATUS.UNKNOW;
      const status = await this.translate.get(key).toPromise();
      const params = {  id: data.id, status };
      const text = await this.translate.get(KEYS.APP.CHANGES_TO_STATUS, params).toPromise();
      const title = await this.translate.get(KEYS.APP.ORDER_UPDATED_TITLE, params).toPromise();
      this.showNotification(text, title);
    }
  }

  initializeApp() {

    this.globalization.getPreferredLanguage().then((v: { value: string }) => {
      console.log('globalization', v.value);
      this.translate.setDefaultLang('es');
      this.translate.setDefaultLang(v.value.split('-')[0] || 'es');
    });

    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      // this.translate.setDefaultLang('es');

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
          const appName = await this.translate.get(KEYS.APP.NAME,).toPromise();
          const msg = await this.translate.get(KEYS.APP.WAITING_NEW_ORDERS).toPromise();
          this.foreground.start(appName, msg, 'icon');
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

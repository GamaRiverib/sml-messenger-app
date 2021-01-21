import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ForegroundService } from '@ionic-native/foreground-service/ngx';
import { ILocalNotification, LocalNotifications } from '@ionic-native/local-notifications/ngx';

import { DataService } from './services/data.service';
import { ToastService } from './services/toast.service';

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
    private localNotifications: LocalNotifications
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

  private newOrdersHandler(count: number): void {
    console.log('new orders');
    const text = count === 1 ? 'There is a new order.' : `There are ${count} new orders.`
    const title = 'New Orders';
    this.showNotification(text, title);
  }

  initializeApp() {

    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();


      this.platform.resume.subscribe(async () => {
        console.log('on resume');
        this.foreground.stop();
        this.data.startMonitor(60000);
      });
  
      this.platform.pause.subscribe(async () => {
        console.log('on pause');
        if (this.data.getOnlineMode())   {
          console.log('enable background mode');
          this.foreground.start('SML Messenger App', 'Waiting for new orders', 'icon');
          console.log('start monitor', 90000);
          this.data.startMonitor(90000);
        } else {
          this.foreground.stop();
          this.data.stopMonitor();
          this.data.removeSubscriber(this.newOrdersHandler);
        }
      });
  
      this.data.addSubscriber(this.newOrdersHandler.bind(this));
  
      this.localNotifications.on('click').toPromise().then((val: any) => {
        console.log('notification click', val);
      });
  
      console.log('start monitor', 60000);
      this.data.startMonitor(60000);
  

    });
  }
}

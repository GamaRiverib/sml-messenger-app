import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ForegroundService } from '@ionic-native/foreground-service/ngx';
import { DataService } from './services/data.service';

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
    private data: DataService
  ) {
    this.initializeApp();
  }

  initializeApp() {

    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });

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
      }
    });

    console.log('start monitor', 60000);
    this.data.startMonitor(60000);

  }
}

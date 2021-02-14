import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { HOME_PAGE_PATH, KEYS } from '../app.values';
import { DataService } from '../services/data.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  username: string;
  password: string;

  showLogo: boolean = true;

  constructor(
    private data: DataService,
    private toast: ToastService,
    private translate: TranslateService,
    private loadingController: LoadingController,
    private router: Router,
    private platform: Platform) { }

  ngOnInit() {
    this.platform.keyboardDidShow.subscribe(() => {
      this.showLogo = false;
      console.log('keyboard did show');
    });
    this.platform.keyboardDidHide.subscribe(() => {
      this.showLogo = true;
      console.log('keyboard did hide');
    });
    if (this.data.authenticated) {
      this.router.navigate([ HOME_PAGE_PATH ]);
    }
  }

  async login() {
    const keys: string[] = [
      KEYS.LOGIN_PAGE.AUTHENTICATING,
      KEYS.LOGIN_PAGE.AUTH_FAILED
    ];
    const values: { [key: string]: string } = await this.translate.get(keys).toPromise();
    const loading = await this.loadingController.create({
      message: `${values[KEYS.LOGIN_PAGE.AUTHENTICATING]}...`,
      duration: 3000
    });
    await loading.present();
    try {
      const auth: boolean = await this.data.signin(this.username, this.password);
      if (auth) {
        this.router.navigate([ HOME_PAGE_PATH ]);
      } else {
        this.toast.showLongTop(values[KEYS.LOGIN_PAGE.AUTH_FAILED]);
      }
    } catch (error) {
      console.log(error);
      this.toast.showLongTop(values[KEYS.LOGIN_PAGE.AUTH_FAILED]);
    } finally {
      loading.dismiss();
    }
  }

}

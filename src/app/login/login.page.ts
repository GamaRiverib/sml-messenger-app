import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { SERVER_URL } from 'src/environments/environment';
import { HOME_PAGE_PATH, KEYS } from '../app.values';
import { HttpService } from '../services/http.service';
import { AuthData, LocalStorageService } from '../services/local-storage.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  username: string;
  password: string;

  constructor(
    private localStorage: LocalStorageService,
    private toast: ToastService,
    private translate: TranslateService,
    private loadingController: LoadingController,
    private http: HttpService,
    private router: Router) {
      this.http.useWeb = true;
    }

  async ngOnInit() {
    const authData: AuthData = await this.localStorage.getAuthData();
    if (authData && authData.access_token) {
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
      const url = `${SERVER_URL}/login`;
      const body = { username: this.username, password: this.password };
      const response: { token: string } = await this.http.post(url, body);
      await this.localStorage.setAuthData({ access_token: response.token, refresh_at: Date.now() + 6000 * 30 });
      console.log(response);
      this.router.navigate([ HOME_PAGE_PATH ]);
    } catch (error) {
      const values: { [key: string]: string } = await this.translate.get(keys).toPromise();
      this.toast.showLongTop(values[KEYS.LOGIN_PAGE.AUTH_FAILED]);
      console.log(error);
    } finally {
      loading.dismiss();
    }
  }

}

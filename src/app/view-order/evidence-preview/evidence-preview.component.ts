import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { KEYS } from 'src/app/app.values';
import { DeliveryHistoryItem } from 'src/app/model/delivery-history-item';
import { Order } from 'src/app/model/order';
import { SERVER_URL } from 'src/environments/environment';

@Component({
  selector: 'app-evidence-preview',
  templateUrl: './evidence-preview.component.html',
  styleUrls: ['./evidence-preview.component.scss'],
})
export class EvidencePreviewComponent implements OnInit {

  @Input() order: Order | null;
  @Input() status: string;
  @Input() readonly: true;

  public log: DeliveryHistoryItem | null = null;
  public baseUrl: string = SERVER_URL;
  public altText: string = '';

  constructor(
    private translate: TranslateService,
    private modalController: ModalController,
    private alertController: AlertController) {
    
  }

  async ngOnInit() {
    
    if (this.order && this.status) {
      if (this.order.deliveryLog && this.order.deliveryLog.length > 0) {
        this.log = this.order.deliveryLog.find(l => l.currentStatus === this.status);
      }
    }
    const orderText: string = await this.translate.get(KEYS.ORDER).toPromise();
    const evidenceOfText: string = await this.translate.get(KEYS.EVIDENCE_PREVIEW_COMPONENT.EVIDENCE_OF).toPromise();
    const statusText: string = await this.translate.get(KEYS.STATUS[this.status]['SHORT']).toPromise();
    this.altText = `${orderText} #${this.order.id} - ${evidenceOfText} ${statusText || status.toLowerCase()}`;
  }

  dismiss() {
    this.modalController.dismiss({ dismissed: true });
  }

  async remove(): Promise<void> {
    const keys: string[] = [
      KEYS.EVIDENCE_PREVIEW_COMPONENT.REMOVE_EVIDENCE,
      KEYS.EVIDENCE_PREVIEW_COMPONENT.REMOVE_EVIDENCE_QUESTION,
      KEYS.EVIDENCE_PREVIEW_COMPONENT.CANCEL,
      KEYS.EVIDENCE_PREVIEW_COMPONENT.REMOVE
    ];
    const values: { [key: string]: string | any } = await this.translate.get(keys).toPromise();
    const alert = await this.alertController.create({
      header: values[KEYS.EVIDENCE_PREVIEW_COMPONENT.REMOVE_EVIDENCE],
      message: values[KEYS.EVIDENCE_PREVIEW_COMPONENT.REMOVE_EVIDENCE_QUESTION],
      buttons: [
        {
          text: values[KEYS.EVIDENCE_PREVIEW_COMPONENT.CANCEL],
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            // console.log('Confirm Cancel: blah');
          }
        }, {
          text: values[KEYS.EVIDENCE_PREVIEW_COMPONENT.REMOVE],
          cssClass: 'primary',
          handler: async () => {
            this.modalController.dismiss({ }, 'remove');
          }
        }
      ]
    });

    await alert.present();
  }

}

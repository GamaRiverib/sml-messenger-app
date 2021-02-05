import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EVIDENCE_FILE_BASE_PATH } from 'src/app/app.values';
import { DeliveryHistoryItem } from 'src/app/model/delivery-history-item';
import { Order } from 'src/app/model/order';
import { DataService } from 'src/app/services/data.service';
import { EvidencePreviewComponent } from '../evidence-preview/evidence-preview.component';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss'],
})
export class LogComponent implements OnInit {

  public order: Order;

  public basePath: string = EVIDENCE_FILE_BASE_PATH;

  constructor(
    private modalController: ModalController,
    private data: DataService) { }

  ngOnInit() {
    this.order = this.data.getSelectedOrder();
  }

  get progress(): number {
    if (!this.order) {
      return 0;
    }
    return this.data.getOrderProgress(this.order);
  }

  get progressColor(): string {
    if (!this.order) {
      return '';
    }
    return this.data.getOrderProgressColor(this.order);
  }

  async viewEvidenceFile(log: DeliveryHistoryItem) {
    const modal = await this.modalController.create({
      component: EvidencePreviewComponent,
      componentProps: { order: this.order, status: log.currentStatus, readonly: true }
    });
    modal.onWillDismiss().then(async (res: any) => {
    }).catch(reason => console.log(reason))
    .finally(() => {
      // TODO
    });
    return await modal.present();
  }

}

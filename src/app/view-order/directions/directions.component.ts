import { Component, OnInit } from '@angular/core';
import { FileChooser, FileChooserOptions } from '@ionic-native/file-chooser/ngx';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer/ngx';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { EVIDENCE_FILE_BASE_PATH, KEYS, STATUS } from 'src/app/app.values';
import { Order } from 'src/app/model/order';
import { DataService } from 'src/app/services/data.service';
import { SERVER_URL } from 'src/environments/environment';
import { EvidencePreviewComponent } from '../evidence-preview/evidence-preview.component';

@Component({
  selector: 'app-directions',
  templateUrl: './directions.component.html',
  styleUrls: ['./directions.component.scss'],
})
export class DirectionsComponent implements OnInit {

  public order: Order;
  public collectedEvidenceFile: string | null = null;
  public deliveredEvidenceFile: string | null = null;
  public collectedEvidenceFileUploaded: boolean = false;
  public deliveredEvidenceFileUploaded: boolean = false;
  public collectedEvidenceFileUploadProgress: number = 0;
  public deliveredEvidenceFileUploadProgress: number = 0;

  public selectDeliveredEvidenceMessage: string = '';
  public selectCollectedEvidenceMessage: string = '';

  constructor(
    private modalController: ModalController,
    private data: DataService,
    private translate: TranslateService,
    private fileChooser: FileChooser,
    private fileTransfer: FileTransfer) {
      
      const keys = [
        KEYS.DIRECTIONS_COMPONENT.SELECT_COLLECTED_EVIDENCE_FILE,
        KEYS.DIRECTIONS_COMPONENT.SELECT_DELIVERED_EVIDENCE_FILE
      ];
      this.translate.get(keys).toPromise().then(v => {
        this.selectDeliveredEvidenceMessage = v[KEYS.DIRECTIONS_COMPONENT.SELECT_DELIVERED_EVIDENCE_FILE];
        this.selectCollectedEvidenceMessage = v[KEYS.DIRECTIONS_COMPONENT.SELECT_COLLECTED_EVIDENCE_FILE];
      });

  }

  private checkUploadedImages() {
    if (this.order.deliveryLog && this.order.deliveryLog.length > 0) {
      const collectedLog = this.order.deliveryLog.find(l => l.currentStatus === STATUS.COLLECTED);
      this.collectedEvidenceFile = collectedLog ? 
        collectedLog.evidence.replace(EVIDENCE_FILE_BASE_PATH, '') : null;
      if (this.collectedEvidenceFile !== null) {
        this.collectedEvidenceFileUploaded = true;
      }
      const deliveredLog = this.order.deliveryLog.find(l => l.currentStatus === STATUS.DELIVERED);
      this.deliveredEvidenceFile = deliveredLog ? 
        deliveredLog.evidence.replace(EVIDENCE_FILE_BASE_PATH, '') : null;
      if (this.deliveredEvidenceFile !== null) {
        this.deliveredEvidenceFileUploaded = true;
      }
    }
  }

  ngOnInit() {
    this.order = this.data.getSelectedOrder();
    this.checkUploadedImages();
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

  async selectCollectedEvidenceFile(): Promise<void> {
    try {
      const options: FileChooserOptions = { mime: 'image/jpeg' };
      this.collectedEvidenceFile = await this.fileChooser.open(options);
      this.collectedEvidenceFileUploaded = false;
    } catch (error) {
      console.log(error);
    }
  }

  async uploadCollectedEvidenceFile(): Promise<void> {
    const transfer: FileTransferObject = this.fileTransfer.create();
    const url: string = `${SERVER_URL}/orders/${this.order.id}/evidence?deliveryStatus=COLLECTED`;
    
    const options: FileUploadOptions = {
      httpMethod: 'post',
      fileName: `collected-evidence-order-${this.order.id}.jpeg`
    };
    this.collectedEvidenceFileUploadProgress = 0.1;
    try {
      transfer.onProgress((event: ProgressEvent<EventTarget>) => {
        this.collectedEvidenceFileUploadProgress = event.loaded / event.total;
      });
      const r = await transfer.upload(this.collectedEvidenceFile, url, options);
      if (r.responseCode >= 200 && r.responseCode < 300) {
        this.order = await this.data.selectOrderById(this.order.id, true);
        this.checkUploadedImages();
        this.collectedEvidenceFileUploaded = true;
      }
    } catch (error) {
      console.log(error);
      this.collectedEvidenceFileUploadProgress = 0;
      this.collectedEvidenceFile = null;
      this.collectedEvidenceFileUploaded = false;
    }
  }

  async selectDeliveredEvidenceFile(): Promise<void> {
    try {
      const options: FileChooserOptions = { mime: 'image/jpeg' };
      this.deliveredEvidenceFile = await this.fileChooser.open(options);
      this.deliveredEvidenceFileUploaded = false;
    } catch (error) {
      console.log(error);
    }
  }

  async uploadDeliveredEvidenceFile(): Promise<void> {
    const transfer: FileTransferObject = this.fileTransfer.create();
    const url: string = `${SERVER_URL}/orders/${this.order.id}/evidence?deliveryStatus=DELIVERED`;
    const options: FileUploadOptions = {
      httpMethod: 'post',
      fileName: `delivered-evidence-order-${this.order.id}.jpeg`
    };
    this.deliveredEvidenceFileUploadProgress = 0.1;
    try {
      transfer.onProgress((event: ProgressEvent<EventTarget>) => {
        this.deliveredEvidenceFileUploadProgress = event.loaded / event.total;
      });
      const r = await transfer.upload(this.deliveredEvidenceFile, url, options);
      if (r.responseCode >= 200 && r.responseCode < 300) {
        this.order = await this.data.selectOrderById(this.order.id, true);
        this.checkUploadedImages();
        this.deliveredEvidenceFileUploaded = true;
      }
    } catch (error) {
      console.log(error);
      this.deliveredEvidenceFileUploadProgress = 0;
      this.deliveredEvidenceFile = null;
      this.deliveredEvidenceFileUploaded = false;
    }
  }

  async viewCollectedEvidenceFile() {
    const modal = await this.modalController.create({
      component: EvidencePreviewComponent,
      componentProps: { order: this.order, status: STATUS.COLLECTED }
    });
    modal.onWillDismiss().then(async (res: any) => {
      if (res.role === 'remove') {
        // TODO: remove from server
        this.collectedEvidenceFileUploadProgress = 0;
        this.collectedEvidenceFile = null;
        this.collectedEvidenceFileUploaded = false;
      }
    }).catch(reason => console.log(reason))
    .finally(() => {
      // TODO
    });
    return await modal.present();
  }

  async viewDeliveredEvidenceFile() {
    const modal = await this.modalController.create({
      component: EvidencePreviewComponent,
      componentProps: { order: this.order, status: STATUS.DELIVERED }
    });
    modal.onWillDismiss().then(async (res: any) => {
      if (res.role === 'remove') {
        // TODO: remove from server
        this.deliveredEvidenceFileUploadProgress = 0;
        this.deliveredEvidenceFile = null;
        this.deliveredEvidenceFileUploaded = false;
      }
    }).catch(reason => console.log(reason))
    .finally(() => {
      // TODO
    });
    return await modal.present();
  }

}

import { Component, OnInit } from '@angular/core';
import { FileChooser, FileChooserOptions } from '@ionic-native/file-chooser/ngx';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer/ngx';
import { Order } from 'src/app/model/order';
import { DataService } from 'src/app/services/data.service';

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

  constructor(
    private data: DataService,
    private fileChooser: FileChooser,
    private fileTransfer: FileTransfer) { }

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

  async selectCollectedEvidenceFile(): Promise<void> {
    try {
      const options: FileChooserOptions = { mime: 'image/*' };
      this.collectedEvidenceFile = await this.fileChooser.open(options)
    } catch (error) {
      console.log(error);
    }
  }

  async uploadCollectedEvidenceFile(): Promise<void> {
    console.log('uploading collected evidence image file');
    const transfer: FileTransferObject = this.fileTransfer.create();
    const url: string = `http://192.168.0.212:3000/upload?order=${this.order.id}&evidenceType=collected`;
    const options: FileUploadOptions = {
      httpMethod: 'post',
      fileName: `evidence-order-${this.order.id}`
    };
    this.collectedEvidenceFileUploadProgress = 0.1;
    try {
      transfer.onProgress((event: ProgressEvent<EventTarget>) => {
        this.collectedEvidenceFileUploadProgress = event.loaded / event.total;
      });
      const r = await transfer.upload(this.collectedEvidenceFile, url, options)
      console.log(r);
      if (r.response) {
        const data = JSON.parse(r.response);
        if (data.success) {
          this.collectedEvidenceFileUploaded = true;
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async selectDeliveredEvidenceFile(): Promise<void> {
    try {
      const options: FileChooserOptions = { mime: 'image/*' };
      this.deliveredEvidenceFile = await this.fileChooser.open(options)
    } catch (error) {
      console.log(error);
    }
  }

  async uploadDeliveredEvidenceFile(): Promise<void> {
    console.log('uploading evidence image file');
    const transfer: FileTransferObject = this.fileTransfer.create();
    const url: string = `http://192.168.0.212:3000/upload?order=${this.order.id}&evidenceType=delivered`;
    const options: FileUploadOptions = {
      httpMethod: 'post',
      fileName: `evidence-order-${this.order.id}`
    };
    this.deliveredEvidenceFileUploadProgress = 0.1;
    try {
      transfer.onProgress((event: ProgressEvent<EventTarget>) => {
        this.deliveredEvidenceFileUploadProgress = event.loaded / event.total;
      });
      const r = await transfer.upload(this.deliveredEvidenceFile, url, options)
      console.log(r);
      if (r.response) {
        const data = JSON.parse(r.response);
        if (data.success) {
          this.deliveredEvidenceFileUploaded = true;
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

}

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

  public evidenceImageFile: string | null = null;

  public evidenceImageFileUploaded: boolean = false;

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

  async selectEvidenceImageFile(): Promise<void> {
    try {
      const options: FileChooserOptions = { mime: 'image/*' };
      this.evidenceImageFile = await this.fileChooser.open(options)
    } catch (error) {
      console.log(error);
    }
  }

  async uploadEvidenceImageFile(): Promise<void> {
    console.log('uploading evidence image file');
    const transfer: FileTransferObject = this.fileTransfer.create();
    const url: string = 'http://192.168.1.28:3000/upload';
    const options: FileUploadOptions = {
      httpMethod: 'post',
      fileName: `evidence-order-${this.order.id}`
    };
    try {
      const r = await transfer.upload(this.evidenceImageFile, url, options)
      console.log(r);
      if (r.response) {
        const data = JSON.parse(r.response);
        if (data.success) {
          this.evidenceImageFileUploaded = true;
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

}

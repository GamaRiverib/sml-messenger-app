import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss'],
})
export class OptionsComponent implements OnInit {

  constructor(private data: DataService, private popoverCtrl: PopoverController) { }

  ngOnInit() {
  }

  dismissPopover(option: string, data?: any) {
    this.popoverCtrl.dismiss(data || {}, option);
  }

  get online(): boolean {
    return this.data.getOnlineMode();
  }

  set online(val: boolean) {
    this.data.setOnlineMode(val);
  }

  get autoTake(): boolean {
    return this.data.getAutoAcceptOrders();
  }

  set autoTake(val: boolean) {
    this.data.setAutoAcceptOrders(val);
  }

}

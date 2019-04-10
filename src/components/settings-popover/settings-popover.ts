import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
  selector: 'settings-popover',
  templateUrl: 'settings-popover.html'
})
export class SettingsPopoverComponent {

  constructor(public viewCtrl: ViewController) {
    
  }

  close(action){
    this.viewCtrl.dismiss({
      action: action
    });
  }

}

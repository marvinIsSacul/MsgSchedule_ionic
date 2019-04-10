import { Component } from '@angular/core';

import { ViewController, NavParams } from 'ionic-angular';

import { Message } from '../../models/Message';


@Component({
  selector: 'schedule-popover',
  templateUrl: 'schedule-popover.html'
})
export class SchedulePopoverComponent {

  messages: Message[];

  constructor(public viewCtrl: ViewController,
            public navParams: NavParams)
  {
    this.messages = this.navParams.get('messages');
  }

  close(action){
    this.viewCtrl.dismiss({
      action: action
    });
  }

}

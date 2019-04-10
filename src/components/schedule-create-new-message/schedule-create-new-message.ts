import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

import { Message } from '../../models/Message';
import { Settings } from '../../models/Settings';
import { Contacts, Contact } from '@ionic-native/contacts/ngx';


@Component({
  selector: 'schedule-create-new-message',
  templateUrl: 'schedule-create-new-message.html'
})
export class ScheduleCreateNewMessageComponent {

  settings: Settings;

  message: Message;
  startTime: string;
  startDate: string;
  now: Date;

  global: Window = window;

  constructor(public viewCtrl: ViewController, public navParams: NavParams, public contacts: Contacts) {
    this.now = new Date();
    this.message = new Message();

    this.message.message = '';
    this.message.address = '';

    this.startDate = '';
    this.startTime = '';

    this.settings = this.navParams.get('settings');
  }

  onCancel(){
    this.viewCtrl.dismiss();
  }

  onCreate(){
    let date = this.getDate();
    let time = this.getTime();

    this.message.time_scheduled = new Date(date.year, date.month, date.date, time.hours, time.minutes, 0);

    this.viewCtrl.dismiss(this.message);
  }

  pickContact(){
    this.contacts.pickContact()
      .then((contact: Contact) => {
        if (contact.phoneNumbers.length > 0){
          this.message.address = contact.phoneNumbers[0].value;
        }
      });
  }

  // date is like this: YYYY-MM-DD
  private getDate(): {date: number, month: number, year: number}{
    const parts = this.startDate.split('-');
    return {
      date: Number(parts[2]),
      month: Number(parts[1]),
      year: Number(parts[0])
    };
  }

  // time is like this: HH:mm
  private getTime(): {hours: number, minutes: number}{
    const parts = this.startTime.split(':');
    return {
      hours: Number(parts[0]),
      minutes: Number(parts[1])
    };
  }

}

import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { ViewController, NavParams, ToastController, Toast } from 'ionic-angular';
import { Contacts, Contact } from '@ionic-native/contacts/ngx';

import { Message } from '../../models/Message';
import { Settings } from '../../models/Settings';

@Component({
  selector: 'schedule-edit-message',
  templateUrl: 'schedule-edit-message.html'
})
export class ScheduleEditMessageComponent implements OnInit {

  TOAST_SUCCESS: string = 'Success :-)';
  TOAST_FAILURE: string = 'Failure :-(';

  message: Message;
  startTime: string;
  startDate: string;

  @Input()
  settings: Settings;

  now: Date = new Date();
  global: Window = window;

  constructor(public viewCtrl: ViewController,
            public navParams: NavParams,
            public toastCtrl: ToastController,
            public cdr: ChangeDetectorRef,
             public contacts: Contacts)
  {
    this.message = this.navParams.get('message');
    this.settings = this.navParams.get('settings');

    this.startTime = this.message.time_scheduled.toISOString();
    this.startDate =  this.message.time_scheduled.toISOString();
  }

  ngOnInit(){
    
  }

  numberInput(){
    if (this.message.address.length > 15){
      this.message.address = this.message.address.slice(0, 15);
      this.cdr.markForCheck();
    }
  }

  pickContact(){
    this.contacts.pickContact()
      .then((contact: Contact) => {
        if (contact.phoneNumbers.length > 0){
          this.message.address = contact.phoneNumbers[0].value;
        }
      });
  }

  showToast(message, duration = 3000){
    const toast: Toast = this.toastCtrl.create({
      message: message,
      duration: duration
    });
    toast.present();
  }

  onUpdate(){
    this.viewCtrl.dismiss(this.message);
  }

  onCancel(){
    this.viewCtrl.dismiss();
  }

}

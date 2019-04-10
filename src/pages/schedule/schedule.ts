import { Component, OnInit, ChangeDetectorRef, SystemJsNgModuleLoader } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, Popover, ModalController, Modal, ToastController, Toast, AlertController, Alert, LoadingController, Loading, Refresher, Events, SelectPopover } from 'ionic-angular';

import { SchedulePopoverComponent } from '../../components/schedule-popover/schedule-popover';
import { ScheduleCreateNewMessageComponent } from '../../components/schedule-create-new-message/schedule-create-new-message';
import { ScheduleEditMessageComponent } from '../../components/schedule-edit-message/schedule-edit-message';

import { Message } from '../../models/Message';
import { MessageScheduleProvider } from '../../providers/message-schedule/message-schedule';
import { SettingsProvider } from '../../providers/settings/settings';
import { Settings } from '../../models/Settings';



@IonicPage()
@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html',
})
export class SchedulePage implements OnInit{
  messages: Message[] = [];
  settings: Settings;
  currentSegment: string = 'all';

  TOAST_SUCCESS: string = 'Success :-)';
  TOAST_FAILURE: string = 'Failure :-(';

  constructor(public navParams: NavParams,
            public navCtrl: NavController,
            public popOverCtrl: PopoverController,
            public modalCtrl: ModalController,
            public toastCtrl: ToastController,
            public alertCtrl: AlertController,
            public loadingCtrl: LoadingController,
            public msp: MessageScheduleProvider,
            public settingsProvider: SettingsProvider,
            public changeDetectorRef: ChangeDetectorRef,
            public events: Events
            )
  {
    //console.log(new Date().toISOString(), ' <=> ', new Date().getTimezoneOffset());
  }

  ngOnInit(){
    this.loadMessages()
      .then(() => {
        this.loadSettings();
      })
      .catch(() => {
        this.loadSettings();
      });

    this.events.subscribe('schedule_processed', (messages: Message[]) => {
      this.loadMessages()
        .then(() => this.changeDetectorRef.markForCheck());
    })
  }



  loadMessages(): Promise<any>{
    const loading: Loading = this.loadingCtrl.create({
      enableBackdropDismiss: true,
      dismissOnPageChange: true
    });

    loading.present();

    return this.msp.getAllMessages()
      .then((messages: Message[]) => {
        this.messages = messages;
        loading.dismiss();
        this.showToast(this.TOAST_SUCCESS);
        
        return new Promise((resolve, reject) => resolve());
      })
      .catch(() => {
        loading.dismiss();
        this.showAlert('Error Loading Messages',
          'Something went wrong whilst loading messages.');
        
        return new Promise((resolve, reject) => reject());
      });
  }

  loadSettings(){
    /* const loading: Loading = this.loadingCtrl.create({
      enableBackdropDismiss: true,
      dismissOnPageChange: true
    }); */

    //loading.present();

    this.settingsProvider.getSettings()
      .then((settings: Settings) => {
        this.settings = settings;
       // loading.dismiss()
        return new Promise((resolve, reject) => resolve());
      })
      .catch(() => {
        // settingsGetting on fail will return default settings object.
       // loading.dismiss();
        return new Promise((resolve, reject) => reject());
      });
  }

  showAlert(title, subtitle = '') {
    let alert: Alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: ['X']
    });
    return alert.present();
  }

  showConfirm(title, message, resolve?, reject?) {
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            !reject || reject();
          }
        },
        {
          text: 'Yes',
          handler: () => {
            !resolve || resolve();
          }
        }
      ]
    });
    return alert.present();
  }

  showToast(message, duration = 3000){
    let toast: Toast = this.toastCtrl.create({
      message: message,
      duration: duration
    });
    return toast.present();
  }


  showPopover(){
    const popover: Popover = this.popOverCtrl.create(SchedulePopoverComponent, {messages: this.messages});
    popover.present();
    popover.onDidDismiss(data => {
      if (!data) return;
      switch (data.action){
        case 'create-new-message': this.createNewMessage(); break;
        case 'clear-all-messages': this.clearAllMessages(); break;
        case 'refresh-messages': this.refreshMessages(); break;
        default:;
      }
    });
  }

  editMessage(message: Message){
    const editMessageModal: Modal = this.modalCtrl.create(ScheduleEditMessageComponent, {
      message: Object.assign({}, message),   // clone object.
      settings: this.settings
    });
    
    editMessageModal.present()
      .then(() => alert('success'))
      .catch(() => alert('error')) ;


    editMessageModal.onDidDismiss((updatedMessage: Message) => {
      if (!updatedMessage) return;

      this.msp.updateMessage(updatedMessage)
        .then((message: Message) => {
          this.showToast(this.TOAST_SUCCESS);
          
          let foundMsg: Message = this.messages.find(msg => msg.id == message.id);
          
          foundMsg = Object.assign(foundMsg, updatedMessage);   // clone object.
          
          this.changeDetectorRef.markForCheck();
        })
        .catch(() => {
          this.showToast(this.TOAST_FAILURE);
        });
    });
  }

  createNewMessage(){
    const createNewMessageModal: Modal = this.modalCtrl.create(ScheduleCreateNewMessageComponent,
                                                             {settings: this.settings});
    createNewMessageModal.present();

    createNewMessageModal.onDidDismiss((newMessage: Message) => {
      
      // if message is null or undefined, it probably means the input was cancelled
      if (!newMessage || !(newMessage instanceof Message) )
        return;

      newMessage.type = 'sms'; // should not put this here
      
      this.msp.addMessage(newMessage)
        .then((message: Message) => {
          this.showToast(this.TOAST_SUCCESS);
          this.messages.push(message);
          this.changeDetectorRef.markForCheck();
        })
        .catch(() => {
          this.showToast(this.TOAST_FAILURE);
        });
    });
  }

  clearAllMessages(){
    this.showConfirm('Clear All Messages', 'Are you sure you want to clear all of your messages?',
      () => {
        this.msp.clearAll()
          .then(() => {
            this.showToast(this.TOAST_SUCCESS);
            this.messages = []; // force view to update.
            this.changeDetectorRef.markForCheck();
          })
          .catch(() => {
            this.showToast(this.TOAST_FAILURE);
          });
      });
  }

  refreshMessages(refresher?: Refresher){
    this.loadMessages()
      .then(() => {
        !refresher || refresher.complete();
      })
      .catch(() => {
        !refresher || refresher.complete();
      });
  }

  deleteMessage(message: Message){
    this.showConfirm('Delete Message', 'Are you sure you want to delete this message?', () => {
      this.msp.removeMessageById(message.id)
        .then(() => {
          this.showToast(this.TOAST_SUCCESS);
          this.messages = this.messages.filter(msg => msg.id != message.id);
          this.changeDetectorRef.markForCheck();
        })
        .catch(() => {
          this.showToast(this.TOAST_FAILURE);
        });
    });
  }

  pauseMessage(message: Message){
    this.showConfirm('Pause Message',
        `Are you sure you want to pause this message?
        Paused messages will not get sent.`,
        () => {
          message.is_paused = true;
          this.msp.updateMessage(message)
            .then((message: Message) => {
              this.showToast(this.TOAST_SUCCESS);
              this.changeDetectorRef.markForCheck();
            })
            .catch(() => {
              this.showToast(this.TOAST_FAILURE);
              message.is_paused = false;
            });
        });
  }

  resumeMessage(message: Message){
    this.showConfirm('Resume Message',
        `Are you sure you want to resume this message?`,
        () => {
          message.is_paused = false;
          this.msp.updateMessage(message)
            .then((message: Message) => {
              this.showToast(this.TOAST_SUCCESS);
              this.changeDetectorRef.markForCheck();
            })
            .catch(() => {
              this.showToast(this.TOAST_FAILURE);
              message.is_paused = true;
            });
        });
  }

  pressMessage(message: Message){
    //let formCtrlSub: Subscription = ;
    this.showAlert('<ion-icon name="text"></ion-icon>', message.message);
  }
}

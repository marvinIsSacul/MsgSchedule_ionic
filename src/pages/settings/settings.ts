import { Component, OnInit, DoCheck } from '@angular/core';
import { IonicPage, NavController, NavParams, Popover, PopoverController, LoadingController, Loading, ToastController, Toast } from 'ionic-angular';
import { SettingsPopoverComponent } from '../../components/settings-popover/settings-popover';
import { Settings } from '../../models/Settings';
import { SettingsProvider } from '../../providers/settings/settings';


@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage implements OnInit, DoCheck {
  settings: Settings;

  TOAST_SUCCESS: string = 'Success :-)';
  TOAST_FAILURE: string = 'Failure :-(';

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public popOverCtrl: PopoverController, public loadingCtrl: LoadingController,
              public settingsProvider: SettingsProvider, public toastCtrl: ToastController)
  {
    this.settings = settingsProvider.getDefaultSettings();
  }

  ngOnInit(){
    this.loadSettings();
  }

  ngDoCheck(){
   // this.saveSettings();
  }

  createLoader(): Loading{
    const loading: Loading = this.loadingCtrl.create({
      enableBackdropDismiss: true,
      dismissOnPageChange: true
    });

    return loading;
  }

  loadSettings(){
    const loading: Loading = this.createLoader();

    loading.present();

    this.settingsProvider.getSettings()
      .then((settings: Settings) => {
        this.settings = settings;
        loading.dismiss();
        this.showToast(this.TOAST_SUCCESS);
        return new Promise((resolve, reject) => resolve());
      })
      .catch(() => {
        // settingsGetting on fail will return default settings object.
        loading.dismiss();
        this.showToast(this.TOAST_FAILURE);
        return new Promise((resolve, reject) => reject());
      });
  }

  saveSettings(){
    const loading: Loading = this.createLoader();

    loading.present();

    this.settingsProvider.saveSettings(this.settings)
      .then(() => loading.dismiss())
      .catch(() => loading.dismiss());
  }

  setDefaultSettings(){
    const loading: Loading = this.createLoader();

    loading.present();

    this.settingsProvider.setToDefault()
      .then((settings: Settings) => {
        this.settings = settings;
        loading.dismiss();
        this.showToast(this.TOAST_SUCCESS);
      })
      .catch(() => {
        loading.dismiss();
        this.showToast(this.TOAST_FAILURE);
      });
  }

  showToast(message, duration = 3000){
    let toast: Toast = this.toastCtrl.create({
      message: message,
      duration: duration
    });
    return toast.present();
  }

  showPopover(){
    let popover: Popover = this.popOverCtrl.create(SettingsPopoverComponent);
    popover.present();
    popover.onDidDismiss(data => {
      if (!data) return;
      switch (data.action){
        case 'set-default-settings': this.setDefaultSettings(); break;
        //case 'clear-all-messages': this.clearAllMessages(); break;
        default:;
      }
    })
  }

  settingsChanged(){
    this.saveSettings();
  }

}

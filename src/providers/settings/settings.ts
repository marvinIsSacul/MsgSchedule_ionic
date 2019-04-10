
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { Settings, SmsSettings, SystemSettings } from '../../models/Settings';


@Injectable()
export class SettingsProvider {

  KEY = 'settings';
  VERSION = 2;

  constructor(public storage: Storage) {
  }

  getSettings(shouldReturnDefault: boolean = true): Promise<Settings>{
    return this.storage.get(this.KEY)
      .then((settings: Settings) => {
        if (!settings || settings.version != this.VERSION) return this.setToDefault();
        else return new Promise<Settings>((resolve, reject) => resolve(settings));
      })
      .catch(() => {
        if (shouldReturnDefault){
          return this.setToDefault();
        }
        else{
          return new Promise((resolve, reject) => reject());
        }
      });
  }

  saveSettings(settings: Settings): Promise<any>{
    return this.storage.set(this.KEY, settings);
  }

  getDefaultSettings(): Settings{
    const system: SystemSettings = {
      shouldAutoCheckUpdates: false,
      shouldShowNotifications: true,
      shouldShowMessageFailedNotifications: true,
      shouldShowMessageSentNotifications: true,
    };
    const sms: SmsSettings = {
      maxSmsCount: 4,
    };
    const settings: Settings = {
      version: this.VERSION,
      system: system,
      sms: sms,
    };

    return settings;
  }

  setToDefault(): Promise<Settings>{
    const settings: Settings = this.getDefaultSettings();

    return this.storage.set(this.KEY, settings);
  }

}

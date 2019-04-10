import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, Platform } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { Contacts } from '@ionic-native/contacts/ngx';
import { SMS } from '@ionic-native/sms/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { SettingsPage } from '../pages/settings/settings';
import { SchedulePage } from '../pages/schedule/schedule';
import { SchedulePopoverComponent } from '../components/schedule-popover/schedule-popover';
import { ScheduleCreateNewMessageComponent } from '../components/schedule-create-new-message/schedule-create-new-message';
import { ScheduleEditMessageComponent } from '../components/schedule-edit-message/schedule-edit-message';
import { SettingsPopoverComponent } from '../components/settings-popover/settings-popover';
import { ScheduleListComponent } from '../components/schedule-list/schedule-list';

import { MessageProvider } from '../providers/message/message';
import { MessageScheduleProvider } from '../providers/message-schedule/message-schedule';
import { SettingsProvider } from '../providers/settings/settings';



@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SettingsPage,
    SettingsPopoverComponent,
    SchedulePage,
    SchedulePopoverComponent,
    ScheduleCreateNewMessageComponent,
    ScheduleEditMessageComponent,
    ScheduleListComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SettingsPage,
    SettingsPopoverComponent,
    SchedulePage,
    SchedulePopoverComponent,
    ScheduleCreateNewMessageComponent,
    ScheduleEditMessageComponent,
    ScheduleListComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
   // Platform,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SMS,
    BackgroundMode,
   // AndroidPermissions,
    Contacts,
    MessageProvider,
    MessageScheduleProvider,
    SettingsProvider,
  ]
})
export class AppModule {}

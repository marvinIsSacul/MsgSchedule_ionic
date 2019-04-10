import { Component, ViewChild, OnInit } from '@angular/core';
import { Platform, MenuController, Nav, ViewController, Events, App } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { SMS } from '@ionic-native/sms/ngx';


import { HomePage } from '../pages/home/home';
import { SchedulePage } from '../pages/schedule/schedule';
import { SettingsPage } from '../pages/settings/settings';

import { Message } from '../models/Message';
import { MessageScheduleProvider } from '../providers/message-schedule/message-schedule';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions';


@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit {
  rootPage: any ;
  currentPage: any;
  pages: Array<{title: string, icon: string, component: any}>;
  @ViewChild('nav') nav: Nav;

  constructor(public platform: Platform, statusBar: StatusBar,
            public app: App,
              splashScreen: SplashScreen,
              public menuCtrl: MenuController,
              public msp: MessageScheduleProvider,
              public events: Events,
              public sms: SMS,
              public bgm: BackgroundMode,
              /* public droidPerm: AndroidPermissions */)
  {
    this.rootPage = SchedulePage;
    this.currentPage = SchedulePage;

    // set our app's pages
    this.pages = [
     // { title: 'Home', icon: 'home', component: HomePage },
      { title: 'Schedule', icon: 'list', component: SchedulePage },
      { title: 'Settings', icon: 'settings', component: SettingsPage },      
    ];

   // this.initApp();

    this.platform.ready().then(() => {
      statusBar.styleLightContent()
      splashScreen.hide();

      this.initApp();
    });

  }

  
  ngOnInit(){
    this.nav.viewDidEnter.subscribe((viewCtrl: ViewController) => {
      this.currentPage = viewCtrl.component;
    });
  }

  initApp(){
    this.app.setTitle('Msg Schedule');

    this.bgm.enable();
    if (this.bgm.isEnabled())
      this.bgm.configure({
        title: 'Msg Schedule',
        text: 'App is still running in the background to process the schedule.',
        silent: true
      });
   // this.bgm.overrideBackButton();

  //  setInterval(() => this.processSchedule(), 5000);

 /*  setTimeout(() => {
    const message: Message = new Message();
    this.sms.send('911', 'Hi to you.')
              .then(() => {
                alert('sent');
              })
              .catch(() => {
                alert('failed');
              });
  }, 1000) */

    this.sms.hasPermission()
      .then(value => {
        if (!value){
          /* this.droidPerm.requestPermission(this.droidPerm.PERMISSION.SEND_SMS)
            .then((value: any) => {
              alert("permission requested: ")
              alert(value);
            }); */
        }
      });

     this.platform.registerBackButtonAction(() => {
      if (!this.nav.canGoBack()){
        this.bgm.moveToBackground();
      }
    });
  }

  openPage(page){
    this.closeMenu();
    this.nav.setRoot(page.component);
  }

  closeMenu(){
    this.menuCtrl.close();
  }

  processSchedule(){

    return;
    
    this.msp.getAllMessages()
      .then((messages: Message[]) => {
        let isChanged: boolean = false;

        for (let i = 0; i < messages.length; ++i){
          let message: Message = messages[i];
        
          if (true || (!message.is_paused && message.status == 'pending' &&
              message.time_scheduled.getTime() >= new Date().getTime()))
          {
            this.sms.send(message.address, message.message)
              .then(() => {
                message.status = 'sent';
                isChanged = true;
              })
              .catch(() => {
                message.status = 'failed';
                isChanged = true;
              });
          }
        }

        if (isChanged){
          this.msp.createOrUpdateMessages(messages)
            .then(() => this.events.publish('schedule_processed', messages));
        }
      });
  }
}


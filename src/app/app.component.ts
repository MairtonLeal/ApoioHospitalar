import { Component } from '@angular/core';
// import { OneSignal } from '@awesome-cordova-plugins/onesignal/ngx';

import { Platform } from '@ionic/angular';
import { Keys } from './core/Keys';
import { OnSignalAdminService } from './services/onsignalAdmin.service';
import {SplashScreen} from '@capacitor/splash-screen';
import OneSignal from 'onesignal-cordova-plugin';
import { register } from 'swiper/element/bundle';
register();
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private onesignalAdmin: OnSignalAdminService,
  ) {
    SplashScreen.hide().then();
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      OneSignal.setAppId('50ecfea1-c0ba-495b-bf11-1052d652e122');
      OneSignal.setNotificationOpenedHandler(function (jsonData) {
        console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
      });
      OneSignal.promptForPushNotificationsWithUserResponse(function (accepted) {
        console.log("User accepted notifications: " + accepted);
      });
      OneSignal.getDeviceState((resp) => {
        localStorage.setItem(Keys.playerId, resp.userId);
      });


    });
  }

}

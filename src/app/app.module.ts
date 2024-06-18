
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import {environment} from '../environments/environment';


import {Validator} from './helpers/validation.helpers';
import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';
import { OneSignal } from '@awesome-cordova-plugins/onesignal/ngx';
import { HttpClientModule } from '@angular/common/http';

import {LOCALE_ID} from '@angular/core';
import localePt from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';
import { NativeGeocoder } from '@awesome-cordova-plugins/native-geocoder/ngx';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
registerLocaleData(localePt);

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireAuthModule,
        AngularFirestoreModule,
        HttpClientModule,
    AppRoutingModule],
  providers: [
    Validator,ImagePicker, OneSignal, NativeGeocoder,
    {
      provide: LOCALE_ID,
      useValue: "pt-BR"
    },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
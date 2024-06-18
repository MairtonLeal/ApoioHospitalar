import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailEstadiaPageRoutingModule } from './detail-estadia-routing.module';

import { DetailEstadiaPage } from './detail-estadia.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailEstadiaPageRoutingModule
  ],
  declarations: [DetailEstadiaPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class DetailEstadiaPageModule {}

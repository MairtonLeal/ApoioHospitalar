import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddEstadiaPageRoutingModule } from './add-estadia-routing.module';

import { AddEstadiaPage } from './add-estadia.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddEstadiaPageRoutingModule
  ],
  declarations: [AddEstadiaPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AddEstadiaPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelecionarProfPageRoutingModule } from './selecionar-prof-routing.module';

import { SelecionarProfPage } from './selecionar-prof.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelecionarProfPageRoutingModule
  ],
  declarations: [SelecionarProfPage]
})
export class SelecionarProfPageModule {}

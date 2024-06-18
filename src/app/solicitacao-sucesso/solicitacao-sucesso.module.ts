import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SolicitacaoSucessoPageRoutingModule } from './solicitacao-sucesso-routing.module';

import { SolicitacaoSucessoPage } from './solicitacao-sucesso.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SolicitacaoSucessoPageRoutingModule
  ],
  declarations: [SolicitacaoSucessoPage]
})
export class SolicitacaoSucessoPageModule {}

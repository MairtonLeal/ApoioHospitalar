import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatAtendimentoPageRoutingModule } from './chat-atendimento-routing.module';

import { ChatAtendimentoPage } from './chat-atendimento.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatAtendimentoPageRoutingModule
  ],
  declarations: [ChatAtendimentoPage]
})
export class ChatAtendimentoPageModule {}

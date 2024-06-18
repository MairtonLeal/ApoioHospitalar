import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatAtendimentoPage } from './chat-atendimento.page';

const routes: Routes = [
  {
    path: '',
    component: ChatAtendimentoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatAtendimentoPageRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SolicitacaoSucessoPage } from './solicitacao-sucesso.page';

const routes: Routes = [
  {
    path: '',
    component: SolicitacaoSucessoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SolicitacaoSucessoPageRoutingModule {}

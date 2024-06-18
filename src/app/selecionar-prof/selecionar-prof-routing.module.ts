import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelecionarProfPage } from './selecionar-prof.page';

const routes: Routes = [
  {
    path: '',
    component: SelecionarProfPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelecionarProfPageRoutingModule {}

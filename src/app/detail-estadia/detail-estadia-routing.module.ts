import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailEstadiaPage } from './detail-estadia.page';

const routes: Routes = [
  {
    path: '',
    component: DetailEstadiaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailEstadiaPageRoutingModule {}

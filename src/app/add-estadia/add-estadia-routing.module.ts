import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddEstadiaPage } from './add-estadia.page';

const routes: Routes = [
  {
    path: '',
    component: AddEstadiaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddEstadiaPageRoutingModule {}

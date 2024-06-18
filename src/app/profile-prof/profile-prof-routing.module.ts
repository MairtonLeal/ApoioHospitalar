import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileProfPage } from './profile-prof.page';

const routes: Routes = [
  {
    path: '',
    component: ProfileProfPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  
  exports: [RouterModule],
})
export class ProfileProfPageRoutingModule {}

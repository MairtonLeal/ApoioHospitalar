import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileProfPageRoutingModule } from './profile-prof-routing.module';

import { ProfileProfPage } from './profile-prof.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfileProfPageRoutingModule,
  ],
  declarations: [ProfileProfPage]
})
export class ProfileProfPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListviajesPageRoutingModule } from './listviajes-routing.module';

import { ListviajesPage } from './listviajes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListviajesPageRoutingModule
  ],
  declarations: [ListviajesPage]
})
export class ListviajesPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicSelectableModule } from 'ionic-selectable';
import { IonicModule } from '@ionic/angular';

import { ResponsablesPageRoutingModule } from './responsables-routing.module';

import { ResponsablesPage } from './responsables.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicSelectableModule,
    ResponsablesPageRoutingModule
  ],
  declarations: [ResponsablesPage]
})
export class ResponsablesPageModule {}

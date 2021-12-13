import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { IonicSelectableModule } from 'ionic-selectable';
import { ReportetransmaterPageRoutingModule } from './reportetransmater-routing.module';

import { ReportetransmaterPage } from './reportetransmater.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicSelectableModule,
    ReportetransmaterPageRoutingModule
  ],
  declarations: [ReportetransmaterPage]
})
export class ReportetransmaterPageModule {}

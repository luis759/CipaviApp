import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicSelectableModule } from 'ionic-selectable';
import { IonicModule } from '@ionic/angular';

import { ReportgenePageRoutingModule } from './reportgene-routing.module';

import { ReportgenePage } from './reportgene.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicSelectableModule,
    ReportgenePageRoutingModule
  ],
  declarations: [ReportgenePage]
})
export class ReportgenePageModule {}

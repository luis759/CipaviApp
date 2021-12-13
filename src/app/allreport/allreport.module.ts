import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IonicSelectableModule } from 'ionic-selectable';
import { AllreportPageRoutingModule } from './allreport-routing.module';

import { AllreportPage } from './allreport.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicSelectableModule,
    AllreportPageRoutingModule
  ],
  declarations: [AllreportPage]
})
export class AllreportPageModule {}

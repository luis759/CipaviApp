import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MenuPageRoutingModule } from './menu-routing.module';

import { MenuPage } from './menu.page';
import { NuevoviajePage } from '../modal/nuevoviaje/nuevoviaje.page';
import { NuevoviajePageModule } from '../modal/nuevoviaje/nuevoviaje.module';
import { ListviajesPage } from '../modal/listviajes/listviajes.page';
import { ListviajesPageModule } from '../modal/listviajes/listviajes.module';

@NgModule({
  entryComponents:[
    NuevoviajePage,
    ListviajesPage
    ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NuevoviajePageModule,
    ListviajesPageModule, 
    MenuPageRoutingModule
  ],
  declarations: [MenuPage]
})
export class MenuPageModule {}

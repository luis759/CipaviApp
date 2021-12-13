import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportetransmaterPage } from './reportetransmater.page';

const routes: Routes = [
  {
    path: '',
    component: ReportetransmaterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportetransmaterPageRoutingModule {}

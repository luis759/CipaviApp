import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AllreportPage } from './allreport.page';

const routes: Routes = [
  {
    path: '',
    component: AllreportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllreportPageRoutingModule {}

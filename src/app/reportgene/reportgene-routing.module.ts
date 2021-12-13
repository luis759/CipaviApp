import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportgenePage } from './reportgene.page';

const routes: Routes = [
  {
    path: '',
    component: ReportgenePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportgenePageRoutingModule {}

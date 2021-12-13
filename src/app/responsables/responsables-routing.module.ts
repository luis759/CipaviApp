import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResponsablesPage } from './responsables.page';

const routes: Routes = [
  {
    path: '',
    component: ResponsablesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResponsablesPageRoutingModule {}

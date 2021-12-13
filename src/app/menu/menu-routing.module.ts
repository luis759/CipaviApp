import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuPage } from './menu.page';

const routes: Routes = [
  {
    path:'',
    redirectTo:'/menu/home',
    pathMatch:'full'
  },
  {
    path: '',
    component: MenuPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then( m => m.HomePageModule)
      },
      {
        path: 'reportlist',
        loadChildren: () => import('../reportlist/reportlist.module').then( m => m.ReportlistPageModule)
      },
      {
        path: 'reportgene',
        loadChildren: () => import('../reportgene/reportgene.module').then( m => m.ReportgenePageModule)
      },
      {
        path: 'allreport',
        loadChildren: () => import('../allreport/allreport.module').then( m => m.AllreportPageModule)
      },
      {
        path: 'responsables',
        loadChildren: () => import('../responsables/responsables.module').then( m => m.ResponsablesPageModule)
      },
      {
        path: 'reportetransmater',
        loadChildren: () => import('../reportetransmater/reportetransmater.module').then( m => m.ReportetransmaterPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPageRoutingModule {}

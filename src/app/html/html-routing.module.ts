import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HtmlPage } from './html.page';

const routes: Routes = [
  {
    path: '',
    component: HtmlPage
  },
  {
    path: 'leccion',
    loadChildren: () => import('./leccion/leccion.module').then( m => m.LeccionPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HtmlPageRoutingModule {}

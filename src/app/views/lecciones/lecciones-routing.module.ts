import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LeccionesPage } from './lecciones.page';

const routes: Routes = [
  {
    path: '',
    component: LeccionesPage
  },
  {
    path: 'leccion',
    loadChildren: () => import('../leccion-detalle/leccion-detalle.module').then( m => m.LeccionDetallePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeccionesPageRoutingModule {}

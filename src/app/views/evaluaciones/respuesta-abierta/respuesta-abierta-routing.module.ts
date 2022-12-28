import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RespuestaAbiertaPage } from './respuesta-abierta.page';

const routes: Routes = [
  {
    path: '',
    component: RespuestaAbiertaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RespuestaAbiertaPageRoutingModule {}

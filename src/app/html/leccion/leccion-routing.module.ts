import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LeccionPage } from './leccion.page';

const routes: Routes = [
  {
    path: '',
    component: LeccionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeccionPageRoutingModule {}

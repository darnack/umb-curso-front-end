import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrdenamientoPage } from './ordenamiento.page';

const routes: Routes = [
  {
    path: '',
    component: OrdenamientoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdenamientoPageRoutingModule {}

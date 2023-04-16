import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FinalizadaPage } from './finalizada.page';

const routes: Routes = [
  {
    path: '',
    component: FinalizadaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinalizadaPageRoutingModule {}

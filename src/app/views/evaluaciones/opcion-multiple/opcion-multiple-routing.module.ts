import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OpcionMultiplePage } from './opcion-multiple.page';

const routes: Routes = [
  {
    path: '',
    component: OpcionMultiplePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OpcionMultiplePageRoutingModule {}

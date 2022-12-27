import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LeccionDetallePageRoutingModule } from './leccion-detalle-routing.module';

import { LeccionDetallePage } from './leccion-detalle.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LeccionDetallePageRoutingModule
  ],
  declarations: [LeccionDetallePage]
})
export class LeccionDetallePageModule {}

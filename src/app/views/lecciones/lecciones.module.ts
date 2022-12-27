import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LeccionesPageRoutingModule } from './lecciones-routing.module';

import { LeccionesPage } from './lecciones.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LeccionesPageRoutingModule
  ],
  declarations: [LeccionesPage]
})
export class LeccionesPageModule {}

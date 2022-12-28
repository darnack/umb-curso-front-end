import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RespuestaAbiertaPageRoutingModule } from './respuesta-abierta-routing.module';

import { RespuestaAbiertaPage } from './respuesta-abierta.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RespuestaAbiertaPageRoutingModule
  ],
  declarations: [RespuestaAbiertaPage]
})
export class RespuestaAbiertaPageModule {}

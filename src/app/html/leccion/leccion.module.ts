import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LeccionPageRoutingModule } from './leccion-routing.module';

import { LeccionPage } from './leccion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LeccionPageRoutingModule
  ],
  declarations: [LeccionPage]
})
export class LeccionPageModule {}

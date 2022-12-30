import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrdenamientoPageRoutingModule } from './ordenamiento-routing.module';

import { OrdenamientoPage } from './ordenamiento.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrdenamientoPageRoutingModule
  ],
  declarations: [OrdenamientoPage]
})
export class OrdenamientoPageModule {}

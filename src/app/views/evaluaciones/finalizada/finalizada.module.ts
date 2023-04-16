import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FinalizadaPageRoutingModule } from './finalizada-routing.module';

import { FinalizadaPage } from './finalizada.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FinalizadaPageRoutingModule
  ],
  declarations: [FinalizadaPage]
})
export class FinalizadaPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OpcionMultiplePageRoutingModule } from './opcion-multiple-routing.module';

import { OpcionMultiplePage } from './opcion-multiple.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OpcionMultiplePageRoutingModule
  ],
  declarations: [OpcionMultiplePage]
})
export class OpcionMultiplePageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HtmlPageRoutingModule } from './html-routing.module';

import { HtmlPage } from './html.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HtmlPageRoutingModule
  ],
  declarations: [HtmlPage]
})
export class HtmlPageModule {}

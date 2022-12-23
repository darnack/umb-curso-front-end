import { Component, OnInit } from '@angular/core';
import { HtmlService } from '../services/html.service';
import { LeccionModel } from '../models/leccion.model'

@Component({
  selector: 'app-html',
  templateUrl: './html.page.html',
  styleUrls: ['./html.page.scss'],
})
export class HtmlPage implements OnInit {
  public title: string = 'Lecciones HTML';

  lecciones: LeccionModel[] = []

  constructor(private htmlService: HtmlService) { }

  ngOnInit() {
    this.lecciones = this.htmlService.getLecciones()
  }

}

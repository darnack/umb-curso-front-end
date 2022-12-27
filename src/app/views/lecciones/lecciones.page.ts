import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HtmlService } from '../../services/html.service';
import { LeccionModel } from '../../models/leccion.model'

@Component({
  selector: 'app-lecciones',
  templateUrl: './lecciones.page.html',
  styleUrls: ['./lecciones.page.scss'],
})
export class LeccionesPage implements OnInit {
  public title: string = 'Lecciones';

  lecciones: LeccionModel[] | undefined = []

  constructor(private route: ActivatedRoute, private htmlService: HtmlService) { }

  ngOnInit() {

    this.route.paramMap
      .subscribe(paramMap => {
        //console.log('parametros query string: ', params); // { order: "popular" }
        //console.log('parametros por url: ', paramMap); // { order: "popular" }

        const module = paramMap.get('module') || '';        

        this.lecciones = this.htmlService.getLecciones(module);

        this.title = "Módulo " + module.toUpperCase()
      }
    );
    
  }
}

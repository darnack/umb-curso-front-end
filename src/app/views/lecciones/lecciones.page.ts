import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LeccionesService } from '../../services/lecciones.service';
import { LeccionModel } from '../../models/leccion.model'

@Component({
  selector: 'app-lecciones',
  templateUrl: './lecciones.page.html',
  styleUrls: ['./lecciones.page.scss'],
})
export class LeccionesPage implements OnInit {
  public titulo: string = 'Lecciones';

  lecciones: LeccionModel[] | undefined = []

  constructor(private route: ActivatedRoute, private leccionesService: LeccionesService) { }

  ngOnInit() {

    this.route.paramMap
      .subscribe(paramMap => {
        //console.log('parametros query string: ', params); // { order: "popular" }
        //console.log('parametros por url: ', paramMap); // { order: "popular" }

        const module = paramMap.get('module') || '';        

        this.lecciones = this.leccionesService.getLecciones(module);

        this.titulo = "Módulo " + module.toUpperCase()
      }
    );
    
  }
}

import { Injectable } from '@angular/core';
import { LeccionModel } from '../models/leccion.model'
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LeccionesService {

  private lecciones: LeccionModel[]  

  constructor(private httpClient: HttpClient, private router: Router) {        
    this.lecciones = []
   
    this.loadData();
  }

  loadData() {
    this.httpClient.get<LeccionModel[]>("assets/data/lecciones.html.json").subscribe(response => {      
      this.lecciones = this.lecciones.concat(response);
    });

    this.httpClient.get<LeccionModel[]>("assets/data/lecciones.css.json").subscribe(response => {      
      this.lecciones = this.lecciones.concat(response);
    });

    this.httpClient.get<LeccionModel[]>("assets/data/lecciones.javascript.json").subscribe(response => {      
      this.lecciones = this.lecciones.concat(response);
    });
  }

  getLecciones(module: string) : LeccionModel[] | undefined {
    var output =  this.lecciones?.filter(leccion => {
      return leccion.modulo === module
    })

    output.forEach(function(item, index){
      item.numero = String(index + 1);
    });

    return output
  }

  getLeccion(module: string, id: string) : LeccionModel {
    var output = this.lecciones?.find(leccion => {
        return leccion.modulo === module && leccion.numero === id
      }) 

    return { 
      numero: output === undefined ? '' : output.numero,
      modulo: output === undefined ? '' : output.modulo,
      titulo: output === undefined ? '' : output.titulo,
      contenido: output === undefined ? '' : output.contenido,
      habilitada: output === undefined ? false : output.habilitada,
      evaluaciones: output?.evaluaciones
    };
  }

  deleteLeccion(number: string) {
    this.lecciones = this.lecciones?.filter(leccion => {
      return leccion.numero !== number
    })
  }

  siguienteLeccion(modulo:string, numero:string )  {
    var lecciones = this.getLecciones(modulo);
    var siguiente = Number(numero) + 1

    if(Number(lecciones?.length) < siguiente)
    {
      this.router.navigate(['/finalizada'])
    }
    else {
      this.router.navigate(['/lecciones', modulo, siguiente])
    }
  }
}
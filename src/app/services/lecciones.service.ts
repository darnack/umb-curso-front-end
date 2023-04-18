import { Injectable } from '@angular/core';
import { LeccionModel } from '../models/leccion.model'
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class LeccionesService {

  private lecciones: Array<LeccionModel>

  constructor(private httpClient: HttpClient, private router: Router, private storage: Storage) {        
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

  getLecciones(module: string) : LeccionModel[] {
    var output =  this.lecciones?.filter(leccion => {
      return leccion.modulo === module
    })

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
      desabilitado: output === undefined ? true : output.desabilitado,
      evaluaciones: output?.evaluaciones
    };
  }

  deleteLeccion(number: string) {
    this.lecciones = this.lecciones?.filter(leccion => {
      return leccion.numero !== number
    })
  }

  async siguienteLeccion(modulo:string, numero:string )  {
    var lecciones = this.getLecciones(modulo);
    var siguiente = Number(numero) + 1

    if(Number(lecciones?.length) < siguiente)
    {
      var next_module = "";
      if(modulo == "html") next_module = "css";
      else if (modulo == "css") next_module = "javascript";

      if(next_module !== "")
        await this.storage.set(next_module.concat("_1"), false)

      this.router.navigate(['/finalizada'])
    }
    else {
      this.router.navigate(['/lecciones', modulo, siguiente])
    }
  }
}

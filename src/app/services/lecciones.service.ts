import { Injectable } from '@angular/core';
import { LeccionModel } from '../models/leccion.model'
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LeccionesService {

  private lecciones: LeccionModel[]
  private uri: string

  constructor(private httpClient: HttpClient) {    
    this.uri = "assets/data/lecciones.json"
    this.lecciones = []
   
    this.loadData();
  }

  loadData() {
    this.httpClient.get<LeccionModel[]>(this.uri).subscribe(response => {
      
      this.lecciones = response
      
    });
  }

  getLecciones(module: string) : LeccionModel[] | undefined {
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
      evaluaciones: output?.evaluaciones
    };
  }

  deleteLeccion(number: string) {
    this.lecciones = this.lecciones?.filter(leccion => {
      return leccion.numero !== number
    })
  }
}
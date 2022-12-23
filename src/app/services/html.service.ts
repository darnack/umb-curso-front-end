import { Injectable } from '@angular/core';
import { LeccionModel } from '../models/leccion.model'

@Injectable({
  providedIn: 'root'
})
export class HtmlService {

  private lecciones: LeccionModel[] = [
    { 
     number:'1',
     title: 'Lección Tags',
     content:'<p>Parrafo</p> <img src="data:image/png;base64,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" />',
     evaluation: {
      type: 'opcion-multiple',
      result: 'A'
     }
    },
    { 
      number:'2',
      title: 'Lección propiedades',
      content:'<h1>Título H1</h1>',
      evaluation: {
        type: 'ordenamiento',
        result: '-'
       }
     }
   ]

  constructor() { }

  getLecciones() : LeccionModel[] {
    return this.lecciones
  }

  getLeccion(id: string) : LeccionModel {
    var output =  this.lecciones.find(leccion => {
        return leccion.number === id
      }) 

      return { 
        number: output === undefined ? '' : output.number,
        title: output === undefined ? '' : output.title,
        content: output === undefined ? '' : output.content,
        evaluation: 
        { 
          type: output === undefined ? '' : output.evaluation.type,
          result: output === undefined ? '' : output.evaluation.result,
        }
       };
  }

  deleteLeccion(number: string) {
    this.lecciones = this.lecciones.filter(leccion => {
      return leccion.number !== number
    })
  }
}
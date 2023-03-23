import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LeccionesService } from '../../../services/lecciones.service';
import { EvaluacionModel } from 'src/app/models/evaluacion-model';
import { TipoEvaluacion } from 'src/app/models/tipo-evaluacion';

@Component({
  selector: 'app-respuesta-abierta',
  templateUrl: './respuesta-abierta.page.html',
  styleUrls: ['./respuesta-abierta.page.scss'],
})
export class RespuestaAbiertaPage implements OnInit {

  titulo: string = 'Evaluación';
  evaluacion: EvaluacionModel;
  aprobado: boolean;
  isModalOpen = false;
  numero: string;
  modulo: string;
  currentTimeOut: NodeJS.Timeout | undefined

  constructor(private activateRoute: ActivatedRoute, private leccionesService: LeccionesService, private router: Router) {
    this.evaluacion = {
      tipo: TipoEvaluacion.Default,
      pregunta: '',
      contenido: '',
      items: [],
      respuesta: ''
    }
    this.aprobado = false;
    this.numero = ''
    this.modulo = ''
  }

  ngOnInit() {
    this.activateRoute.paramMap
      .subscribe(paramMap => {
        //console.log('parametros query string: ', params); // { order: "popular" }
        //console.log('parametros por url: ', paramMap); // { order: "popular" }

        const id = paramMap.get('id') || '0';
        const module = paramMap.get('module') || '0';
        const evaluation = Number(paramMap.get('evaluation') || 0);

        const leccion = this.leccionesService.getLeccion(module, id);

        this.modulo = module
        this.numero = (Number(id) + 1).toString()

        if(leccion.evaluaciones && leccion.evaluaciones.length > 0)
          this.evaluacion = leccion.evaluaciones[evaluation];
      }
    );
  }

  evaluate(answer: HTMLInputElement) 
  {
    if (answer.value && answer.value?.toString().trim() !== '')
    {
      if(this.currentTimeOut !== undefined)
        clearTimeout(this.currentTimeOut);

      this.setOpen(true);

      if(answer.value?.toString().trim().toUpperCase() == this.evaluacion.respuesta.trim().toUpperCase()) {
        this.aprobado = true          
        this.currentTimeOut = setTimeout(() => {            
          this.siguiente();
        }, 3000);
      }
      else {
        answer.value = '';
        this.aprobado = false
        this.currentTimeOut = setTimeout(() => {
          this.setOpen(false);
        }, 4000);
      }
    }
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  siguiente()  {
    this.setOpen(false);
    this.currentTimeOut = setTimeout(() => {      
      this.router.navigate(['/lecciones', this.modulo, this.numero])    
    }, 10);    
  }

}

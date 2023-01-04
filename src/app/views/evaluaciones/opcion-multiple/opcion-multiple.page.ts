import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LeccionesService } from '../../../services/lecciones.service';
import { EvaluacionModel } from 'src/app/models/evaluacion-model';
import { TipoEvaluacion } from 'src/app/models/tipo-evaluacion';
import { IonRadioGroup } from '@ionic/angular';

@Component({
  selector: 'app-opcion-multiple',
  templateUrl: './opcion-multiple.page.html',
  styleUrls: ['./opcion-multiple.page.scss'],
})
export class OpcionMultiplePage implements OnInit {

  titulo: string = 'Evaluación';
  evaluacion: EvaluacionModel;
  aprobado: boolean;
  isModalOpen = false;
  currentTimeOut: NodeJS.Timeout | undefined

  constructor(private activateRoute: ActivatedRoute, private leccionesService: LeccionesService) { 
    this.evaluacion = {
      tipo: TipoEvaluacion.Default,
      pregunta: '',
      contenido: '',
      items: [],
      respuesta: ''
    }
    this.aprobado = false 
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

        if(leccion.evaluaciones && leccion.evaluaciones.length > 0)
          this.evaluacion = leccion.evaluaciones[evaluation];
      }
    );
  }

  ionViewWillEnter() 
  {
    const newList = [...this.evaluacion.items];
    newList.sort(() => Math.random() - 0.5);
    this.evaluacion.items = newList;
  }

  evaluate(answer: IonRadioGroup) 
  {
    if (answer.value && answer.value?.toString().trim() !== '')
    {
      if(this.currentTimeOut !== undefined)
        clearTimeout(this.currentTimeOut);

      this.setOpen(true);

      if(answer.value?.toString().trim() == this.evaluacion.respuesta)
        this.aprobado = true
      else {
        this.aprobado = false
        this.currentTimeOut = setTimeout(() => {
          this.setOpen(false);
        }, 5000);
      }
    }
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

}

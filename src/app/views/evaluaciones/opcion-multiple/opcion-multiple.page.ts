import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HtmlService } from '../../../services/html.service';
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
  resultado: string;
  isModalOpen = false;
  currentTimeOut: NodeJS.Timeout | undefined

  constructor(private activateRoute: ActivatedRoute, private htmlService: HtmlService) { 
    this.evaluacion = {
      tipo: TipoEvaluacion.Default,
      pregunta: '',
      contenido: '',
      items: [],
      respuesta: ''
    }
    this.resultado = ''
  }

  ngOnInit() {
    this.activateRoute.paramMap
      .subscribe(paramMap => {
        //console.log('parametros query string: ', params); // { order: "popular" }
        //console.log('parametros por url: ', paramMap); // { order: "popular" }

        const id = paramMap.get('id') || '0';
        const module = paramMap.get('module') || '0';
        const evaluation = Number(paramMap.get('evaluation') || 0);

        const leccion = this.htmlService.getLeccion(module, id);

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
        this.resultado = "¡Has acertado!"
      else {
        this.resultado = "No, no lo has entendido, intenta otra vez"
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

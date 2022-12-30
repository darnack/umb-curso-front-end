import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HtmlService } from '../../../services/html.service';
import { EvaluacionModel } from 'src/app/models/evaluacion-model';
import { TipoEvaluacion } from 'src/app/models/tipo-evaluacion';
import { IonReorderGroup, ItemReorderEventDetail } from '@ionic/angular';

@Component({
  selector: 'app-ordenamiento',
  templateUrl: './ordenamiento.page.html',
  styleUrls: ['./ordenamiento.page.scss'],
})
export class OrdenamientoPage implements OnInit {

  titulo: string = 'Evaluación';
  evaluacion: EvaluacionModel;
  viewItemList: string[];
  logicItemsList: string[];
  aprobado: boolean;  
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
    this.viewItemList = [];
    this.logicItemsList = [];
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

        const leccion = this.htmlService.getLeccion(module, id);

        if(leccion.evaluaciones && leccion.evaluaciones.length > 0)
          this.evaluacion = leccion.evaluaciones[evaluation];
      }
    );

    this.randomize()
  }

  ionViewWillEnter() 
  {
    this.randomize()
  }

  randomize()
  {
    const newList = [...this.evaluacion.items];
    newList.sort(() => Math.random() - 0.5);

    if(this.evaluacion.items.length > 1 && JSON.stringify(newList) === JSON.stringify(this.evaluacion.items))
      this.randomize()
    else {
      this.viewItemList = newList;    
      this.logicItemsList = this.viewItemList;
    }
  }

  evaluate(answer: IonReorderGroup) 
  {
    if(this.currentTimeOut !== undefined)
      clearTimeout(this.currentTimeOut);

    this.setOpen(true);

    if(JSON.stringify(this.logicItemsList) === JSON.stringify(this.evaluacion.items))
      this.aprobado = true    
    else {
      this.aprobado = false;
      this.currentTimeOut = setTimeout(() => {
        this.setOpen(false);
      }, 5000);
    }    
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    // The `from` and `to` properties contain the index of the item
    // when the drag started and ended, respectively
    //console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to);

    const draggedItem = this.logicItemsList.splice(ev.detail.from, 1)[0];  
    this.logicItemsList.splice(ev.detail.to, 0, draggedItem); 

    // Finish the reorder and position the item in the DOM based on
    // where the gesture ended. This method can also be called directly
    // by the reorder group
    ev.detail.complete();
  }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HtmlService } from '../../services/html.service';
import { LeccionModel } from '../../models/leccion.model'
import { DomSanitizer} from '@angular/platform-browser';
import { TipoEvaluacion } from 'src/app/models/tipo-evaluacion';

@Component({
  selector: 'app-leccion-detalle',
  templateUrl: './leccion-detalle.page.html',
  styleUrls: ['./leccion-detalle.page.scss'],
})
export class LeccionDetallePage implements OnInit {
 
  trustedHTML: object;
  leccion: LeccionModel;
  routeEvaluationType: string;

  constructor(private activateRoute: ActivatedRoute, private htmlService: HtmlService, private sanitizer: DomSanitizer) { 

    this.trustedHTML = this.sanitizer.bypassSecurityTrustHtml('');
    this.leccion = { 
      numero:'',
      modulo: '',
      titulo: '',
      contenido:'',
      evaluaciones: undefined
    };

    this.routeEvaluationType = '';
  }

  ngOnInit() {
    this.activateRoute.paramMap
      .subscribe(paramMap => {
        //console.log('parametros query string: ', params); // { order: "popular" }
        //console.log('parametros por url: ', paramMap); // { order: "popular" }

        const id = paramMap.get('id') || '0';
        const module = paramMap.get('module') || '0';

        this.leccion = this.htmlService.getLeccion(module, id) 
        
        this.trustedHTML = this.sanitizer.bypassSecurityTrustHtml(this.leccion.contenido);
      }
    );

    const evaluationIndex = 0;

    this.routeEvaluationType = this.getEvaluationTypeRoute(evaluationIndex);
  }

  getEvaluationTypeRoute(evaluationIndex: number) : string
  {
    var enumType = TipoEvaluacion.Default;

    if(this.leccion.evaluaciones && this.leccion.evaluaciones.length > 0)
    {
      enumType = this.leccion.evaluaciones[evaluationIndex].tipo;
    }

    switch(enumType)
    {
      case TipoEvaluacion.RespuestaAbierta: return '/respuesta-abierta';
      case TipoEvaluacion.Ordenamiento: return '/ordenamiento';
      case TipoEvaluacion.OpcionMultiple: return '/opcion-multiple';
      default: return 'default';      
    }
  }

}

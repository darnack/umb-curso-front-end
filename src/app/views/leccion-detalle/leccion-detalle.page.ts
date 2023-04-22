import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LeccionesService } from '../../services/lecciones.service';
import { LeccionModel } from '../../models/leccion.model'
import { DomSanitizer} from '@angular/platform-browser';
import { TipoEvaluacion } from 'src/app/models/tipo-evaluacion';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-leccion-detalle',
  templateUrl: './leccion-detalle.page.html',
  styleUrls: ['./leccion-detalle.page.scss'],
})
export class LeccionDetallePage implements OnInit {
 
  trustedHTML: object;
  leccion: LeccionModel;
  routeEvaluationType: string;
  evaluationIndex: number;

  constructor(
    private activateRoute: ActivatedRoute, 
    private leccionesService: LeccionesService, 
    private sanitizer: DomSanitizer,
    private httpClient: HttpClient,
    private router: Router) 
  {
    this.trustedHTML = this.sanitizer.bypassSecurityTrustHtml('');
    this.leccion = { 
      numero:'',
      modulo: '',
      titulo: '',
      contenido:'',
      deshabilitado: true,
      evaluaciones: undefined
    };

    this.routeEvaluationType = '';
    this.evaluationIndex = 0;
  }

  ngOnInit() {
    this.activateRoute.paramMap
      .subscribe(paramMap => {
        //console.log('parametros query string: ', params); // { order: "popular" }
        //console.log('parametros por url: ', paramMap); // { order: "popular" }

        const id = paramMap.get('id') || '0';
        const module = paramMap.get('module') || '0';

        this.leccion = this.leccionesService.getLeccion(module, id) 

        const uri = "assets/data/" + this.leccion.modulo + "/" + this.leccion.contenido
        const httpOptions = {headers: {'Content-Type': 'text/html; charset=utf-8'}, responseType: 'text' as 'json'}

        this.httpClient.get<string>(uri, httpOptions).subscribe(htmlBody => {

          this.leccion.contenido = htmlBody
          this.trustedHTML = this.sanitizer.bypassSecurityTrustHtml(this.leccion.contenido);
        })
        
      }
    );    
  }

  ionViewWillEnter() {
    if(this.leccion.evaluaciones && this.leccion.evaluaciones.length > 0)
    {    
      this.evaluationIndex = this.getRandomInt(0, this.leccion.evaluaciones?.length - 1);
      this.routeEvaluationType = this.getEvaluationTypeRoute(this.evaluationIndex);
    }
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

  getRandomInt(min: number, max: number) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  goBack() {
    this.router.navigate(['/lecciones', this.leccion.modulo])
  }
}

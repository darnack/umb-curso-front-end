import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HtmlService } from '../../services/html.service';
import { LeccionModel } from '../../models/leccion.model'
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-leccion-detalle',
  templateUrl: './leccion-detalle.page.html',
  styleUrls: ['./leccion-detalle.page.scss'],
})
export class LeccionDetallePage implements OnInit {
 
  leccion: LeccionModel = { 
    number: '', 
    module: '',
    title: '', 
    content: '', 
      evaluation: {
      type: '',
      result: ''
    }
  };  
  trustedHTML: object;
  sanitizer;

  constructor(private route: ActivatedRoute, private htmlService: HtmlService, private _sanitizer: DomSanitizer) { 
    this.sanitizer = _sanitizer;
    this.trustedHTML = this.sanitizer.bypassSecurityTrustHtml('');
  }

  ngOnInit() {
    this.route.paramMap
      .subscribe(paramMap => {
        //console.log('parametros query string: ', params); // { order: "popular" }
        //console.log('parametros por url: ', paramMap); // { order: "popular" }

        const id = paramMap.get('id') || '0';
        const module = paramMap.get('module') || '0';

        this.leccion = this.htmlService.getLeccion(module, id) 
        
        this.trustedHTML = this.sanitizer.bypassSecurityTrustHtml(this.leccion.content);
      }
    );
  }

  goToEvaluation()
  {
    alert('goToEvaluation()')
  }

}

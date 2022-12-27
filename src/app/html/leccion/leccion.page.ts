import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HtmlService } from '../../services/html.service';
import { LeccionModel } from '../../models/leccion.model'
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-leccion',
  templateUrl: './leccion.page.html',
  styleUrls: ['./leccion.page.scss'],
})
export class LeccionPage implements OnInit {
  id: string = '';
  leccion: LeccionModel = { 
    number: '', 
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
    this.route.queryParams
      .subscribe(params => {
        //console.log('parametros query string: ', params); // { order: "popular" }

        this.id = params['id'];

        this.leccion = this.htmlService.getLeccion(this.id)
        
        this.trustedHTML = this.sanitizer.bypassSecurityTrustHtml(this.leccion.content);
      }
    );
  }

  goToEvaluation()
  {
    alert('goToEvaluation()')
  }

}

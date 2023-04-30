import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LeccionesService } from '../../services/lecciones.service';
import { LeccionModel } from '../../models/leccion.model'
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-lecciones',
  templateUrl: './lecciones.page.html',
  styleUrls: ['./lecciones.page.scss'],
})
export class LeccionesPage implements OnInit {
  public titulo: string = 'Lecciones';

  lecciones: LeccionModel[]

  constructor(private route: ActivatedRoute, private leccionesService: LeccionesService, private storage: Storage) {
    this.lecciones = []
   }

  ngOnInit() {

    this.route.paramMap
      .subscribe(paramMap => {
        //console.log('parametros query string: ', params); // { order: "popular" }
        //console.log('parametros por url: ', paramMap); // { order: "popular" }

        const module = paramMap.get('module') || '';        

        this.lecciones = this.leccionesService.getLecciones(module);

        var n = this.lecciones.findIndex(x => x.modulo == "html" && x.numero == "1");

        if(n >= 0) {          
          this.lecciones[n].deshabilitado = false
        }

        var el = this;

        this.storage.forEach(function(value, key, index) {       
    
          if(key != "editor") {
            var modulo = String(key).split('_')[0]
            var numero = String(key).split('_')[1]
            
            var i = el.lecciones.findIndex(x => x.modulo == modulo && x.numero == numero);
    
            if(i >= 0) {              
              el.lecciones[i].deshabilitado = Boolean(value);
              //console.log("modulo:", el.lecciones[i].modulo, "numero:", el.lecciones[i].numero, "deshabilitado:", value)
            } 
          }
        });

        this.titulo = "Módulo " + module.toUpperCase()

        if(module == "javascript")
          this.titulo = "Módulo JavaScript";
      }
    );    
  }

}

import { Component } from '@angular/core';
import { LeccionesService } from './services/lecciones.service';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  public home = { title: 'Home', url: '/main', icon: 'home', color:'#CE3030' }
  public modules = [    
    { title: 'HTML', url: '/lecciones/html', icon: 'logo-html5', color: '#F75421' },
    { title: 'CSS', url: '/lecciones/css', icon: 'logo-css3', color: '#2091EB' },
    { title: 'JavaScript', url: '/lecciones/javascript', icon: 'logo-javascript', color: '#FFDF00' },
  ];  
  public editor = { title: 'Editor', url: '/editor', icon: 'terminal', color: '#333' }

  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  
  // Se inyecta servicio para que carge las lecciones desde el arranque de la app con suficiente tiempo para evitar pantallas blancas por falta de datos
  constructor(private leccionesService: LeccionesService, private storage: Storage) {}

  async ngOnInit() {
    // If using a custom driver:
    // await this.storage.defineDriver(MyCustomDriver)
    await this.storage.create();
  }
}

import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [    
    { title: 'Home', url: '/main', icon: 'home', color:'#CE3030' },
    { title: 'HTML', url: '/html', icon: 'logo-html5', color: '#F75421' },
    { title: 'CSS', url: '/css', icon: 'logo-css3', color: '#2091EB' },
    { title: 'JavaScript', url: '/javascript', icon: 'logo-javascript', color: '#FFDF00' },    
    //{ title: 'Trash', url: '/folder/Trash', icon: 'trash' },
    //{ title: 'Spam', url: '/folder/Spam', icon: 'warning' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor() {}
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  public folder!: string;
  
  constructor(private router: Router) { }

  ngOnInit() {
  }

  navigate(module: string)
  {
    this.router.navigate(['/lecciones', module])
  }

}

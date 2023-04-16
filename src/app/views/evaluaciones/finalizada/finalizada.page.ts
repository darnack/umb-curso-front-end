import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-finalizada',
  templateUrl: './finalizada.page.html',
  styleUrls: ['./finalizada.page.scss'],
})
export class FinalizadaPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  salir(){
    this.router.navigate(['/main'])
  }

}

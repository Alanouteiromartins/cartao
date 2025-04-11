import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-conta',
  standalone: true,
  imports: [],
  templateUrl: './conta.component.html',
  styleUrl: './conta.component.css'
})
export class ContaComponent {


  router: Router = new Router();

  sair(){
    setTimeout(() =>{
      this.router.navigate(['login']);
      localStorage.removeItem('usuario');
    }, 500);
  }

}

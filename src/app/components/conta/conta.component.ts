import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingComponent } from '../loading/loading.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-conta',
  standalone: true,
  imports: [LoadingComponent, CommonModule],
  templateUrl: './conta.component.html',
  styleUrl: './conta.component.css'
})
export class ContaComponent {

  constructor(private router: Router){}

  loading = false;

  sair(){

    this.loading = true;

    setTimeout(() =>{
      localStorage.removeItem('usuario');
      this.loading = false;
      this.router.navigate(['login']); 
    }, 500);
  }

}

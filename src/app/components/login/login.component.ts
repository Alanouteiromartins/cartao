import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AlertaService } from '../../services/alerta.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(private alertaService: AlertaService, private router: Router){}
  confirmar = false;

  inputEmail: string = '';
  inputPassword: string = '';

  logar(){
    if(this.inputEmail === 'admin' && this.inputPassword === '12345'){
      this.router.navigate(['pessoas']);
      localStorage.setItem('usuario', JSON.stringify({nome: 'Teste'}));
    }else{
      this.confirmar = true;
    }
  }

  criarConta(){
    this.router.navigate(['registro']);
  }



}

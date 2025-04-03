import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AlertaService } from '../../services/alerta.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(private alertaService: AlertaService, private router: Router, private authService: AuthService){}
  confirmar = false;

  inputEmail: string = '';
  inputPassword: string = '';

  logar(){
    return this.authService.logar(this.inputEmail, this.inputPassword).subscribe((sucesso)=>{
      this.confirmar = !sucesso;
    })
  }

  criarConta(){
    this.router.navigate(['registro']);
  }
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AlertaService } from '../../services/alerta.service';
import { AuthService } from '../../services/auth.service';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, LoadingComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(private alertaService: AlertaService, private router: Router, private authService: AuthService){}
  confirmar = false;
  loading = false;

  inputEmail: string = '';
  inputPassword: string = '';

  logar(){
    this.loading = true;

     this.authService.logar(this.inputEmail, this.inputPassword).subscribe({
      next: (sucesso) => {
        this.loading = false;
        this.confirmar = !sucesso;
      },
      error: (erro) => {
        this.loading = false;
        console.error('Erro ao logar', erro);
      }
    })
  }

  criarConta(){
    this.router.navigate(['registro']);
  }
}

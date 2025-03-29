import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  serviceRouter: Router = new Router;

  inputEmail: string = '';
  inputPassword: string = '';

  logar(){
    if(this.inputEmail === 'admin' && this.inputPassword === '12345'){
      this.serviceRouter.navigate(['pessoas']);
    }else{
      alert('Usuário ou senha inválidos');
    }
  }



}

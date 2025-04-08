import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsuarioService } from './usuario.service';
import { Router } from '@angular/router';
import { AlertaService } from './alerta.service';
import { Usuario } from '../interfaces/usuario.interface';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private usuarioService: UsuarioService, private router: Router, private alertaService: AlertaService) { }


  logar(email: string, senha: string): Observable<boolean> {
    return this.usuarioService.getUsuarios().pipe(
      map(usuarios => {
        const usuario = usuarios.find(user => user.email === email && user.senha === senha);
        if (usuario) {
          sessionStorage.setItem('usuario', JSON.stringify(usuario));
          this.router.navigate(['pessoas']);
          console.log('chegou aqui');
          return true;  // Login bem-sucedido
        }
        return false;  // Login falhou
      })
    );
  }
  getUsuarioLogado(): Usuario | null {
    const usuario = sessionStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  }

  deslogar(){
    sessionStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }
}

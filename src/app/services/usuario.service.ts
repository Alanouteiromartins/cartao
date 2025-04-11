import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '../interfaces/usuario.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) {}

  getUsuarios(){
    return this.http.get<Usuario[]>(`${environment.apiUrl}`);
  }

  addUsuario(usuario: Usuario){
    return this.http.post<Usuario>(`${environment.apiUrl}`, usuario);
  }

}

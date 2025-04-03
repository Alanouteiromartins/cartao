import { Injectable } from '@angular/core';
import { Pessoa } from '../interfaces/pessoa.interface';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, map } from 'rxjs';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class PessoaService {

  constructor(private http: HttpClient, private authService: AuthService){}

  getUsuarioId(): string | null{
    const usuario = this.authService.getUsuarioLogado();
    return usuario ? usuario.id || null : null;
  }

  getPessoas(){
    const id = this.getUsuarioId();
    return this.http.get<Pessoa[]>(`${environment.apiUrl}/${id}/pessoas`);
  }

  addPessoa(pessoa: Pessoa){
    const id = this.getUsuarioId();
    return this.http.post<Pessoa>(`${environment.apiUrl}/${id}/pessoas`, pessoa);
  }

  editPessoa(pessoa: Pessoa){
    const id = this.getUsuarioId();
    return this.http.put<Pessoa>(`${environment.apiUrl}/${id}/pessoas/${pessoa.id}`, pessoa);
  }

  deletePessoa(id: string){
    const idUser = this.getUsuarioId();
    return this.http.delete(`${environment.apiUrl}/${idUser}/pessoas/${id}`);
  }

  encontrarDevedor(id: string): Observable<Pessoa | undefined> {
    return this.http.get<Pessoa[]>(`${environment.apiUrl}/${id}/pessoas`).pipe(
      map(pessoas => pessoas.find(pessoa => pessoa.id === id))
    );
  }
  
}

import { Injectable } from '@angular/core';
import { Pessoa } from '../interfaces/pessoa.interface.';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PessoaService {

  id = 1;

  constructor(private http: HttpClient){}

  getPessoas(){
    return this.http.get<Pessoa[]>(`${environment.apiUrl}/${this.id}/pessoas`);
  }

  addPessoa(pessoa: Pessoa){
    return this.http.post<Pessoa>(`${environment.apiUrl}/${this.id}/pessoas`, pessoa);
  }

  editPessoa(pessoa: Pessoa){
    return this.http.put<Pessoa>(`${environment.apiUrl}/${this.id}/pessoas/${pessoa.id}`, pessoa);
  }

  deletePessoa(id: string){
    return this.http.delete(`${environment.apiUrl}/${this.id}/pessoas/${id}`);
  }

  encontrarDevedor(id: string): Observable<Pessoa | undefined> {
    return this.http.get<Pessoa[]>(`${environment.apiUrl}/${this.id}/pessoas`).pipe(
      map(pessoas => pessoas.find(pessoa => pessoa.id === id))
    );
  }
  
}

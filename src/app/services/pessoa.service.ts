import { Injectable } from '@angular/core';
import { Pessoa } from '../interfaces/pessoa.interface.';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class PessoaService {

  constructor(private http: HttpClient){}

  getPessoas(){
    return this.http.get<Pessoa[]>(`${environment.apiUrl}/pessoas`);
  }

  addPessoa(pessoa: Pessoa){
    return this.http.post<Pessoa>(`${environment.apiUrl}/pessoas`, pessoa);
  }

  editPessoa(pessoa: Pessoa){
    return this.http.put<Pessoa>(`${environment.apiUrl}/pessoas/${pessoa.id}`, pessoa);
  }
  
}

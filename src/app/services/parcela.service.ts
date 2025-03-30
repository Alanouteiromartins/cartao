import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Parcela } from '../interfaces/parcela.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ParcelaService {

  constructor(private http: HttpClient) { }


  getParcelas(){
    return this.http.get<Parcela[]>(`${environment.apiUrl}/parcelas`);
  }
}

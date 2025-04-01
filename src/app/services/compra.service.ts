import { Injectable } from '@angular/core';
import { Compra } from '../interfaces/compra.interface';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Parcela } from '../interfaces/parcela.interface';

@Injectable({
  providedIn: 'root'
})
export class CompraService {

  id = 1;

  constructor(private http: HttpClient){}

  getCompras(){
    return this.http.get<Compra[]>(`${environment.apiUrl}/${this.id}/compras`);
  }

  addCompra(compra: Compra){
    return this.http.post<Compra>(`${environment.apiUrl}/${this.id}/compras`, compra);
  }

}

import { Injectable } from '@angular/core';
import { Compra } from '../interfaces/compra.interface';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Parcela } from '../interfaces/parcela.interface';

@Injectable({
  providedIn: 'root'
})
export class CompraService {

  constructor(private http: HttpClient){}

  getCompras(){
    return this.http.get<Compra[]>(`${environment.apiUrl}/compras`);
  }

  addCompra(compra: Compra){
    const parcelas: Parcela[] = [];
    const valorParcela = compra.valor / compra.qtdParcelas;

  }

}

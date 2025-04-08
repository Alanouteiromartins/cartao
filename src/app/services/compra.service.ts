import { Injectable } from '@angular/core';
import { Compra } from '../interfaces/compra.interface';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Parcela } from '../interfaces/parcela.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CompraService {

  constructor(private http: HttpClient, private authService: AuthService){}

  private getUsuarioId(): string | null{
    const usuario = this.authService.getUsuarioLogado();
    return usuario ? usuario.id || null : null;
  }

  getCompras(){
    const id = this.getUsuarioId();
    return this.http.get<Compra[]>(`${environment.apiUrl}/${id}/compras`);
  }

  getCompraById(id: string){
    const idUser = this.getUsuarioId();
    return this.http.get<Compra>(`${environment.apiUrl}/${idUser}/compras/${id}`);
  }

  addCompra(compra: Compra){
    const id = this.getUsuarioId();
    return this.http.post<Compra>(`${environment.apiUrl}/${id}/compras`, compra);
  }

  editCompra(compra: Compra){
    const id = this.getUsuarioId();
    return this.http.put<Compra>(`${environment.apiUrl}/${id}/compras/${compra.id}`, compra);
  }

  deleteCompra(id: string){
    const idUser = this.getUsuarioId();
    return this.http.delete(`${environment.apiUrl}/${idUser}/compras/${id}`);
  }

}

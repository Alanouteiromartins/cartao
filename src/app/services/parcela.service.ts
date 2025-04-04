import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Parcela } from '../interfaces/parcela.interface';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ParcelaService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getUsuarioId(): string | null{
    const usuario = this.authService.getUsuarioLogado();
    return usuario ? usuario.id || null : null;
  }

  getParcelas(idCompra: string){
    const usuarioId = this.getUsuarioId();
    return this.http.get<Parcela[]>(`${environment.apiUrl}/${usuarioId}/compras/${idCompra}/parcelas`);
  }

  addParcela(idCompra:string, parcela: Parcela){
    const usuarioId = this.authService.getUsuarioLogado();
    return this.http.post<Parcela>(`${environment.apiUrl}/${usuarioId}/compras/${idCompra}/parcelas`, parcela);
  }
}

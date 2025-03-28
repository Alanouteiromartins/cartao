import { Injectable } from '@angular/core';
import { Compra } from '../interfaces/compra.interface';
import { PessoaService } from './pessoa.service';
import { Pessoa } from '../interfaces/pessoa.interface.';

@Injectable({
  providedIn: 'root'
})
export class CompraService {

  pessoaService: PessoaService = new PessoaService();

  pessoas: Pessoa[] = this.pessoaService.getPessoas();

  compras: Compra[] = [
      {descricao: 'Tenis', valor: 299,data: new Date('2025-02-21T00:00:00'), parcelas: 6, devedor: this.pessoas[0]},
      {descricao: 'Anel', valor: 89.90,data: new Date('2025-03-20T00:00:00'), parcelas: 2, devedor: this.pessoas[1]},
      {descricao: 'Óleo carro', valor: 249, parcelas: 5,devedor: this.pessoas[3]},
      {descricao: 'Spotify', valor: 6, parcelas: 1, devedor: this.pessoas[0]}
    ];

    getCompras(){
      return this.compras;
    }

}

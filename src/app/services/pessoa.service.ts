import { Injectable } from '@angular/core';
import { Pessoa } from '../interfaces/pessoa.interface.';

@Injectable({
  providedIn: 'root'
})
export class PessoaService {

  pessoas: Pessoa[] = [
      {nome: 'Alan', telefone: '(51)99346-1726', email: 'alanoutmartins@gmail.com'},
      {nome: 'Tiffani', telefone: '(51)99370-3500', email: 'tiffani.avila@outlook.com'},
      {nome: 'Valdemar', telefone: '(51)99366-2284', email: 'valdo.65@hotmail.com'},
      {nome: 'Alcione', telefone: '(51)0000-0000', email: 'avila_sl@outlook.com'},
      {nome: 'Davi', telefone: '(51)0000-0000', email: 'avila_sl@outlook.com'}
    ];

    getPessoas(){
      return this.pessoas;
    }

  
}

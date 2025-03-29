import { Component, OnInit } from '@angular/core';
import { Pessoa } from '../../interfaces/pessoa.interface.';
import { CommonModule } from '@angular/common';
import { PessoaService } from '../../services/pessoa.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-pessoa',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pessoa.component.html',
  styleUrl: './pessoa.component.css'
})
export class PessoaComponent implements OnInit{
  pessoas: Pessoa[] = [];
  nome: string = '';
  telefone: string = '';
  email: string = '';


  constructor(private pessoaService: PessoaService){}

  ngOnInit(): void {
      this.getPessoas();
  }

  getPessoas(){
    this.pessoaService.getPessoas().subscribe((pessoas) =>{
      this.pessoas = pessoas;
    })
  }

  addPessoa(){
    const novaPessoa = {
      nome: this.nome,
      telefone: this.telefone,
      email: this.email
    }

    this.pessoaService.addPessoa(novaPessoa).subscribe((pessoa)=>{
      this.pessoas.push(pessoa);
    })

    this.nome = '';
    this.telefone = '';
    this.email = '';
  }

  editPessoa(){

  }

  abrirModal(pessoaSelecionada: Pessoa) {
    this.nome = pessoaSelecionada.nome;
    this.telefone = pessoaSelecionada.telefone;
    this.email = pessoaSelecionada.email;
  }

  
}

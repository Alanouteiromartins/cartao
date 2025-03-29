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
  pessoaParaEditar!: Pessoa; 
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

    if (!this.pessoaParaEditar || !this.pessoaParaEditar.id) {
      console.error('Erro: ID da pessoa não encontrado');
      return;
    }

    this.pessoaParaEditar = {
      id: this.pessoaParaEditar.id,
      nome: this.nome,
      telefone: this.telefone,
      email: this.email
    }
    this.pessoaService.editPessoa(this.pessoaParaEditar).subscribe(()=>{
      console.log('pessoa editada com sucesso');
    });
  }

  abrirModal(pessoaSelecionada: Pessoa){
    this.pessoaParaEditar = {...pessoaSelecionada};
    this.nome = pessoaSelecionada.nome;
    this.telefone = pessoaSelecionada.telefone;
    this.email = pessoaSelecionada.email;
    
  }

  
}

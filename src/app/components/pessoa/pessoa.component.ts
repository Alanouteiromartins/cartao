import { Component, OnInit } from '@angular/core';
import { Pessoa } from '../../interfaces/pessoa.interface.';
import { CommonModule } from '@angular/common';
import { PessoaService } from '../../services/pessoa.service';
import { FormsModule } from '@angular/forms';
import { AlertaService } from '../../services/alerta.service';


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

  constructor(private pessoaService: PessoaService, private alertaService: AlertaService){}

  ngOnInit(): void {
      this.getPessoas();
  }

  getPessoas(){
    this.pessoaService.getPessoas().subscribe((pessoas) =>{
      this.pessoas = pessoas;
    })
  }

  limparModal(){
    this.nome = '';
    this.telefone = '';
    this.email = '';
  }

  removerPessoaModal(){
    this.pessoaParaEditar = {
      id: undefined,
      nome: '',
      telefone: '',
      email: ''
    }
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

    this.limparModal();
  }

  editPessoa(){

    if (!this.pessoaParaEditar || !this.pessoaParaEditar.id) {
      this.alertaService.erro("Pessoa não encontrada");
      return;
    }

    this.pessoaParaEditar = {
      id: this.pessoaParaEditar.id,
      nome: this.nome,
      telefone: this.telefone,
      email: this.email
    }
    this.pessoaService.editPessoa(this.pessoaParaEditar).subscribe(()=>{
      this.alertaService.sucesso("Pessoa editada com sucesso!");
      this.getPessoas();
      this.limparModal();
    });

  }

  deletePessoa(){
    if (!this.pessoaParaEditar || !this.pessoaParaEditar.id) {
      this.alertaService.erro("Pessoa não encontrada");
      return;
    }

    this.pessoaParaEditar = {
      id: this.pessoaParaEditar.id,
      ...this.pessoaParaEditar
    }
    if(this.pessoaParaEditar.id){
      this.pessoaService.deletePessoa(this.pessoaParaEditar.id).subscribe(()=>{
        this.alertaService.sucesso(`Pessoa com id ${this.pessoaParaEditar.id} excluída com sucesso`);
        this.getPessoas();
        this.limparModal();
      })
    }
    
  }

  abrirModal(pessoaSelecionada: Pessoa){
    this.pessoaParaEditar = {...pessoaSelecionada};
    this.nome = pessoaSelecionada.nome;
    this.telefone = pessoaSelecionada.telefone;
    this.email = pessoaSelecionada.email;
  }

  
}

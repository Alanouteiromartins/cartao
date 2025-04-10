import { Component, OnInit } from '@angular/core';
import { Compra } from '../../interfaces/compra.interface';
import { Pessoa } from '../../interfaces/pessoa.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PessoaService } from '../../services/pessoa.service';
import { CompraService } from '../../services/compra.service';
import { Parcela } from '../../interfaces/parcela.interface';
import { ParcelaService } from '../../services/parcela.service';
import { AlertaService } from '../../services/alerta.service';


@Component({
  selector: 'app-compras',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './compras.component.html',
  styleUrl: './compras.component.css'
})
export class ComprasComponent implements OnInit {

  constructor(private compraService: CompraService,
              private pessoaService: PessoaService,
              private parcelaService: ParcelaService,
              private alertaService: AlertaService
  ){}

  compras: Compra[] = [];
  pessoas: Pessoa[] = [];

  compraParaEditar!: Compra;


  descricao: string = '';
  valor?: number;
  data!: Date;
  qtdparcelas?: number;
  Devedor: Pessoa | null = null;

  ngOnInit(): void {
      this.getCompras();
      this.getPessoas();
  }

  getCompras(){
    this.compraService.getCompras().subscribe((compras) =>{
      compras.forEach((compra)=>{
        if(compra.idDevedor){
          this.pessoaService.encontrarDevedor(compra.idDevedor).subscribe((pessoa)=>{
            compra.devedor = pessoa;
          })
        }
      });
      this.compras = compras;
      this.compras.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
    })
  }

  getPessoas(){
    this.pessoaService.getPessoas().subscribe((pessoas)=>{
      this.pessoas = pessoas;
    })
  }

  editCompra(){
    if(!this.compraParaEditar || !this.compraParaEditar.id){
      this.alertaService.erro("Compra não encontrada");
      return;
    }

    this.compraParaEditar = {
      id: this.compraParaEditar.id,
      descricao: this.descricao,
      valor: this.valor!,
      data: this.data,
      qtdParcelas: this.qtdparcelas!,
      devedor: this.Devedor!,
      idDevedor: this.Devedor?.id
    }

    console.log('Esse é o devedor antes de atualizar a compra', this.compraParaEditar.devedor);

    this.compraService.editCompra(this.compraParaEditar).subscribe(()=>{
      this.alertaService.sucesso("Compra atualizada com sucesso");
      this.getCompras();
      this.limparModal();
    })
  }

  async deleteCompra(){
    if(!this.compraParaEditar || !this.compraParaEditar.id){
      this.alertaService.erro("Compra não encontrada");
      return;
    }

    const confirmar = await this.alertaService.confirmar("Tem certeza que deseja excluir a compra selecionada?");
    if(confirmar){
      const id = this.compraParaEditar.id;

      this.compraService.deleteCompra(id).subscribe(()=>{
      this.alertaService.sucesso("Compra excluída com sucesso");
      this.getCompras();
      this.limparModal();
    })
    }
  }

  abrirModal(compraSelecionada: Compra){

    this.compraParaEditar = {...compraSelecionada};
    console.log('Esse é o devedor da compraParaEditar recem atribuido: ', this.compraParaEditar.devedor);

    this.descricao = compraSelecionada.descricao;
    this.valor = compraSelecionada.valor;
    this.data = compraSelecionada.data;
    this.qtdparcelas = compraSelecionada.qtdParcelas;
    this.Devedor = this.pessoas.find(pessoa => pessoa.id === compraSelecionada.devedor?.id) ?? null;


    const btnSalvar = document.getElementById('btnSalvar') as HTMLButtonElement;
    const btnAtualizar = document.getElementById('btnAtualizar') as HTMLButtonElement;
    const btnExcluir = document.getElementById('btnExcluir') as HTMLButtonElement;

    btnSalvar.style.display = 'none';
    btnAtualizar.style.display = 'inline-block';
    btnExcluir.style.display = 'inline-block';

  }

  limparModal(){

    this.descricao = '';
    delete this.valor;
    this.data = '' as any;
    delete this.qtdparcelas;
    this.Devedor = null;

    const btnSalvar = document.getElementById('btnSalvar') as HTMLButtonElement;
    const btnAtualizar = document.getElementById('btnAtualizar') as HTMLButtonElement;
    const btnExcluir = document.getElementById('btnExcluir') as HTMLButtonElement;

    btnSalvar.style.display = 'block';
    btnAtualizar.style.display = 'none';
    btnExcluir.style.display = 'none';
  }

  addCompra(){

    if(this.descricao === null || this.valor === null || this.data === null || this.qtdparcelas === null || this.Devedor ===null){
      this.alertaService.erro("Preencha todos os campos");
    }
    if(this.Devedor){
      const novaCompra= {
        descricao: this.descricao,
        valor: this.valor!,
        data:this.data,
        qtdParcelas: this.qtdparcelas!,
        idDevedor: this.Devedor?.id,
        devedor: this.Devedor
      }

      this.compraService.addCompra(novaCompra).subscribe((compra) =>{
        this.compras.push(compra);

        //parcelas
        const parcelas: Parcela[] = [];
        const datainicial = new Date(this.data);
        const valorParcela = compra.valor / compra.qtdParcelas;

        for(let i = 0; i < compra.qtdParcelas; i++){
          const vencimento = new Date(datainicial);
          vencimento.setMonth(vencimento.getMonth() + i + 1);
          vencimento.setDate(10);

          const parcela: Parcela = {
            valor: parseFloat(valorParcela.toFixed(2)),
            dataVencimento: vencimento,
            parcela: i + 1,
            idCompra: compra.id!
          };

          console.log('Enviando parcela:', parcela);
          this.parcelaService.addParcela(compra.id!, parcela).subscribe(() => {
          console.log(`Parcela ${i + 1} adicionada`);
          });

          parcelas.push(parcela);
        }
        compra.parcelas = parcelas;
      })
      this.alertaService.sucesso("Compra cadastrada com sucesso!");
      this.getCompras();
    }
  }
}

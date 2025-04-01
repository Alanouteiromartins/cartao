import { Component, OnInit } from '@angular/core';
import { Compra } from '../../interfaces/compra.interface';
import { Pessoa } from '../../interfaces/pessoa.interface.';
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
  

  descricao: string = '';
  valor!: number;
  data!: Date;
  qtdparcelas!: number;
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
    })
  }

  getPessoas(){
    this.pessoaService.getPessoas().subscribe((pessoas)=>{
      this.pessoas = pessoas;
    })
  }

  addCompra(){

    if(this.descricao === null || this.valor === null || this.data === null || this.qtdparcelas === null || this.Devedor ===null){
      this.alertaService.erro("Preencha todos os campos");
    }
    if(this.Devedor){
      const novaCompra= {
        descricao: this.descricao,
        valor: this.valor,
        data:this.data,
        qtdParcelas: this.qtdparcelas,
        idDevedor: this.Devedor?.id,
        devedor: this.Devedor
      }
      this.compraService.addCompra(novaCompra).subscribe((compra) =>{
        this.compras.push(compra);
      })
      this.alertaService.sucesso("Compra cadastrada com sucesso!");
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { Compra } from '../../interfaces/compra.interface';
import { Pessoa } from '../../interfaces/pessoa.interface.';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PessoaService } from '../../services/pessoa.service';
import { CompraService } from '../../services/compra.service';
import { Parcela } from '../../interfaces/parcela.interface';
import { ParcelaService } from '../../services/parcela.service';


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
              private parcelaService: ParcelaService){}

  compras: Compra[] = [];
  pessoas: Pessoa[] = [];
  parcelas: Parcela[] = [];

  descricao: string = '';
  valor!: number;
  data!: Date;
  qtdparcelas!: number;
  Devedor: Pessoa | null = null;

  ngOnInit(): void {
      this.getCompras();
      this.getPessoas();
      this.getParcelas();
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

  getParcelas(){
    this.parcelaService.getParcelas().subscribe((parcelas) =>{
      this.parcelas = parcelas;
      console.log(parcelas);
    })
  }

  getPessoas(){
    this.pessoaService.getPessoas().subscribe((pessoas)=>{
      this.pessoas = pessoas;
    })
  }
}

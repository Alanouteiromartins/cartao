import { Component, OnInit } from '@angular/core';
import { ParcelaService } from '../../services/parcela.service';
import { FormsModule } from '@angular/forms';
import { Parcela } from '../../interfaces/parcela.interface';
import { CommonModule } from '@angular/common';
import { CompraService } from '../../services/compra.service';
import { Pessoa } from '../../interfaces/pessoa.interface';

@Component({
  selector: 'app-relatorio',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './relatorio.component.html',
  styleUrl: './relatorio.component.css'
})
export class RelatorioComponent implements OnInit{

  ano = 2025;
  mes = 4;
  usuarioId = '';

  //inputs
  totalParcelas: number = 0;
  totalPessoa: number = 0;

  //parcelas
  parcelas: Parcela[]= [];
  parcelasPorPessoa:Parcela[] =[];
  resultados: { devedor: Pessoa, total: number }[] = [];

  constructor(private parcelaService: ParcelaService, private compraService: CompraService){}

  ngOnInit(): void {
      this.getParcelasMes();
      this.getIds();
  }

  getIds() {
    this.compraService.getCompras().subscribe((compras) => {
      const devedoresMap = new Map<string, Pessoa>();
      const idsUnicos = new Set<string>();
  
      compras.forEach((compra) => {
        if (compra.devedor && compra.idDevedor) {
          idsUnicos.add(compra.idDevedor);
          devedoresMap.set(compra.idDevedor, compra.devedor);
        }
      });
  
      const ids = Array.from(idsUnicos);
      const resultados: { devedor: Pessoa, total: number }[] = [];
  
      let count = 0;
      ids.forEach((id) => {
        this.parcelaService.getParcelasMesByPessoas(String(id), this.ano, this.mes).subscribe((parcelas) => {
          const total = parcelas.reduce((acc, parcela) => acc + parcela.valor, 0);
          const devedor = devedoresMap.get(id);
  
          if (devedor) {
            resultados.push({ devedor, total });
          }
  
          count++;
          if (count === ids.length) {
            // Todos os devedores foram processados
            console.log('Valores por devedor:', resultados);
            this.resultados = resultados;
          }
        });
      });
    });
  }
  
  abrirModal(pessoa: Pessoa){
    if(pessoa && pessoa.id) this.parcelaService.getParcelasMesByPessoas(pessoa.id, this.ano, this.mes).subscribe((parcelas)=>{
      this.parcelasPorPessoa = parcelas;
    })

  }


  getParcelasMes(){
    this.parcelaService.getParcelasMes(this.ano, this.mes).subscribe((parcelas)=>{
      this.parcelas = parcelas;
      this.totalParcelas = parcelas.reduce((total, p) => total + p.valor, 0);
    })
  }

}

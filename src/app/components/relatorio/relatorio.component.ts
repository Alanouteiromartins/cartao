import { Component } from '@angular/core';
import { ParcelaService } from '../../services/parcela.service';
import { FormsModule } from '@angular/forms';
import { Parcela } from '../../interfaces/parcela.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-relatorio',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './relatorio.component.html',
  styleUrl: './relatorio.component.css'
})
export class RelatorioComponent {

  ano = 2025;
  mes = 4;
  usuarioId = '';
  totalParcelas: number = 0;
  parcelas: Parcela[]= [];
  parcelasPessoas: Parcela[] = [];

  constructor(private parcelaService: ParcelaService){}

  getParcelasMes(){
    this.parcelaService.getParcelasMes(this.ano, this.mes).subscribe((parcelas)=>{
      this.parcelas = parcelas;
      this.totalParcelas = parcelas.reduce((total, p) => total + p.valor, 0);
    })
  }

  getParcelasByUsuario(){
    this.parcelaService.getParcelasMesByPessoas(this.usuarioId, this.ano, this.mes).subscribe((parcelas)=>{
      this.parcelasPessoas = parcelas;
    })
  }

}

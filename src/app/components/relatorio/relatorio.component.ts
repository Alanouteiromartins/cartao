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
  parcelas: Parcela[]= [];

  constructor(private parcelaService: ParcelaService){}

  getParcelasMes(){
    this.parcelaService.getParcelasMes(this.ano, this.mes).subscribe((parcelas)=>{
      this.parcelas = parcelas;
      console.log(parcelas);
    })
  }

}

import { Component, OnInit } from '@angular/core';
import { Compra } from '../../interfaces/compra.interface';
import { Pessoa } from '../../interfaces/pessoa.interface.';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PessoaService } from '../../services/pessoa.service';
import { CompraService } from '../../services/compra.service';


@Component({
  selector: 'app-compras',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './compras.component.html',
  styleUrl: './compras.component.css'
})
export class ComprasComponent implements OnInit {

  constructor(private compraService: CompraService){}

  compras: Compra[] = [];

  descricao: string = '';
  valor!: number;
  data!: Date;
  parcelas!: number;
  devedor!: Pessoa;

  ngOnInit(): void {
      this.getCompras();
  }

  getCompras(){
    this.compraService.getCompras().subscribe((compras) =>{
      this.compras = compras;
    })
  }
}

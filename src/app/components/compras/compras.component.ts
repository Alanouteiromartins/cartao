import { Component } from '@angular/core';
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
export class ComprasComponent {

  pessoaService: PessoaService = new PessoaService;
  compraService: CompraService = new CompraService;
  

  descricao: string = '';
  valor!: number;
  data!: Date;
  parcelas!: number;
  devedor!: Pessoa;

  pessoas: Pessoa[] = this.pessoaService.getPessoas();
  compras: Compra[] = this.compraService.getCompras();

  salvar(){
    const modal = document.getElementById('modalCompra');
    const backdrop = document.querySelector('.modal-backdrop');
  

    const novacompra = {
      descricao: this.descricao,
      valor: this.valor,
      data: this.data,
      parcelas: this.parcelas,
      devedor: this.devedor
    }

    this.compras.push(novacompra);
  }



}

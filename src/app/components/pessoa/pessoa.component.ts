import { Component } from '@angular/core';
import { Pessoa } from '../../interfaces/pessoa.interface.';
import { CommonModule } from '@angular/common';
import { PessoaService } from '../../services/pessoa.service';

@Component({
  selector: 'app-pessoa',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pessoa.component.html',
  styleUrl: './pessoa.component.css'
})
export class PessoaComponent {

  service: PessoaService = new PessoaService();

  pessoas: Pessoa[] = this.service.getPessoas();
}

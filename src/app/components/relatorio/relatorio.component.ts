import { Component, OnInit } from '@angular/core';
import { ParcelaService } from '../../services/parcela.service';
import { FormsModule } from '@angular/forms';
import { Parcela } from '../../interfaces/parcela.interface';
import { CommonModule } from '@angular/common';
import { CompraService } from '../../services/compra.service';
import { Pessoa } from '../../interfaces/pessoa.interface';
import { map, forkJoin } from 'rxjs';
import html2pdf from 'html2pdf.js';



@Component({
  selector: 'app-relatorio',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './relatorio.component.html',
  styleUrl: './relatorio.component.css'
})
export class RelatorioComponent implements OnInit{

  usuarioId = '';
  pessoaSelecionada!: Pessoa;

  meses: { nome: string, valor: number }[] = [
    { nome: 'Janeiro', valor: 1 },
    { nome: 'Fevereiro', valor: 2 },
    { nome: 'Março', valor: 3 },
    { nome: 'Abril', valor: 4 },
    { nome: 'Maio', valor: 5 },
    { nome: 'Junho', valor: 6 },
    { nome: 'Julho', valor: 7 },
    { nome: 'Agosto', valor: 8 },
    { nome: 'Setembro', valor: 9 },
    { nome: 'Outubro', valor: 10 },
    { nome: 'Novembro', valor: 11 },
    { nome: 'Dezembro', valor: 12 }
  ];

  mesSelecionado: number = new Date().getMonth() + 1;
  anoSelecionado: number = new Date().getFullYear();

  //inputs
  totalParcelas: number = 0;
  totalPessoa: number = 0;
  totalParcelasPessoa: number = 0;

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
        this.parcelaService.getParcelasMesByPessoas(String(id), this.anoSelecionado, this.mesSelecionado).subscribe((parcelas) => {
          const total = parcelas.reduce((acc, parcela) => acc + parcela.valor, 0);
          const devedor = devedoresMap.get(id);
  
          if (devedor) {
            resultados.push({ devedor, total });
          }
  
          count++;
          if (count === ids.length) {
            this.resultados = resultados.sort((a,b)=> a.devedor.nome.localeCompare(b.devedor.nome));
          }
        });
      });
    });
  }
  
  abrirModal(pessoa: Pessoa){
    this.pessoaSelecionada = pessoa;
    if (pessoa && pessoa.id) {
      this.parcelaService.getParcelasMesByPessoas(pessoa.id, this.anoSelecionado, this.mesSelecionado).subscribe((parcelas) => {
        const observables = parcelas.map(parcela =>
          this.compraService.getCompraById(parcela.idCompra).pipe(
            map((compra) => ({
              ...parcela,
              descricaoCompra: compra.descricao
            }))
          )
        );
  
        forkJoin(observables).subscribe((parcelasComDescricao) => {
          this.parcelasPorPessoa = parcelasComDescricao;
  
          // calcula o total aqui
          this.totalParcelasPessoa = parcelasComDescricao.reduce((total, p) => total + p.valor, 0);
        });
      });
    }
  }


  getParcelasMes(){
    this.parcelaService.getParcelasMes(this.anoSelecionado, this.mesSelecionado).subscribe((parcelas)=>{
      this.parcelas = parcelas;
      this.totalParcelas = parcelas.reduce((total, p) => total + p.valor, 0);
    })
  }

  exportarModalParaPDF() {
    const elemento = document.getElementById('conteudoModalPDF');
    if (elemento) {
      const opcoes = {
        margin: [10, 10, 10, 10], // margem top, right, bottom, left
        filename: `compras-${this.pessoaSelecionada.nome}-${this.mesSelecionado}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 1.5, // não exagerado pra não cortar
          useCORS: true,
          allowTaint: true,
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait'
        },
        pagebreak: {
          mode: ['avoid-all', 'css', 'legacy']
        }
      };
  
      html2pdf().from(elemento).set(opcoes).save();
    }
  }
  

  aoAlterarMesOuAno() {
    this.getParcelasMes();
    this.getIds();        
  }

  
}

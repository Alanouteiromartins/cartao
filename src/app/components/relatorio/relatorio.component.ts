import { Component, OnInit } from '@angular/core';
import { ParcelaService } from '../../services/parcela.service';
import { CompraService } from '../../services/compra.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Parcela } from '../../interfaces/parcela.interface';
import { Pessoa } from '../../interfaces/pessoa.interface';
import { map, forkJoin } from 'rxjs';
import html2pdf from 'html2pdf.js';
import { AlertaService } from '../../services/alerta.service';

@Component({
  selector: 'app-relatorio',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './relatorio.component.html',
  styleUrls: ['./relatorio.component.css']
})
export class RelatorioComponent implements OnInit {

  usuarioId = '';
  pessoaSelecionada!: Pessoa;
  termoBusca: string = '';

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

  totalParcelas: number = 0;
  totalPessoa: number = 0;
  totalParcelasPessoa: number = 0;
  listaFiltrada: { devedor: Pessoa, total: number }[] = [];

  parcelas: Parcela[] = [];
  parcelasPorPessoa: Parcela[] = [];
  resultados: { devedor: Pessoa, total: number }[] = [];

  constructor(private parcelaService: ParcelaService, private compraService: CompraService, private alertaService: AlertaService) {}

  ngOnInit(): void {
    this.getParcelasMes();
    this.getIds();
    this.getTotalPorMes();
    this.atualizarFiltro();
  }

  atualizarFiltro() {

    const resultadosComValor = this.resultados.filter(r => r.total !== 0);

    if (!this.termoBusca) {
      this.listaFiltrada = resultadosComValor; // Se termoBusca estiver vazio, mostra todos
    } else {
      const termo = this.termoBusca.toLowerCase();
      this.listaFiltrada = resultadosComValor.filter(r =>
        r.devedor.nome.toLowerCase().includes(termo)
      );
    }
  }

  aoAlterarMesOuAno() {
    this.getParcelasMes();
    this.getIds();    
    this.getTotalPorMes();    
  }

  getParcelasMes() {
    this.parcelaService.getParcelasMes(this.anoSelecionado, this.mesSelecionado).subscribe((parcelas) => {
      this.parcelas = parcelas;
      this.totalParcelas = parcelas.reduce((total, p) => total + p.valor, 0);
    });
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
            this.resultados = resultados.sort((a, b) => a.devedor.nome.localeCompare(b.devedor.nome));
            this.atualizarFiltro();
          }
        });
      });
    });
  }

  abrirModal(pessoa: Pessoa) {
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
          this.totalParcelasPessoa = parcelasComDescricao.reduce((total, p) => total + p.valor, 0);
        });
      });
    }
  }

  getTotalPorMes() {
    const observables = this.meses.map(mes =>
      this.parcelaService.getParcelasMes(this.anoSelecionado, mes.valor).pipe(
        map(parcelas => ({
          mes: mes.nome,
          total: parcelas.reduce((acc, p) => acc + p.valor, 0)
        }))
      )
    );

    forkJoin(observables).subscribe((resultados) => {
      // Aqui você pode usar os resultados para algum processamento, se necessário
    });
  }

  exportarModalParaPDF() {
    const elemento = document.getElementById('conteudoModalPDF');
    if (elemento) {
      const opcoes = {
        margin: [10, 10, 10, 10],
        filename: `compras-${this.pessoaSelecionada.nome}-${this.mesSelecionado}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 1.5, useCORS: true, allowTaint: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      html2pdf().from(elemento).set(opcoes).save();
    }
  }

  exportarECompartilharPDF() {
    const elemento = document.getElementById('conteudoModalPDF');
    if (!elemento) return;

    const nomeArquivo = `compras-${this.pessoaSelecionada.nome}-${this.mesSelecionado}.pdf`;

    const opcoes = {
      margin: [10, 10, 10, 10],
      filename: nomeArquivo,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 1.5, useCORS: true, allowTaint: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    html2pdf().from(elemento).set(opcoes).outputPdf('blob').then((blob: Blob) => {
      const file = new File([blob], nomeArquivo, { type: 'application/pdf' });

      if ((navigator as any).canShare && (navigator as any).canShare({ files: [file] })) {
        (navigator as any).share({
          title: 'Relatório de Compras',
          text: 'Segue o relatório de compras em PDF.',
          files: [file]
        }).catch((err: any) => console.error('Erro ao compartilhar:', err));
      } else {
        html2pdf().from(elemento).set(opcoes).save();
        alert('Seu navegador não suporta compartilhamento direto. PDF foi baixado.');
      }
    });
  }




}

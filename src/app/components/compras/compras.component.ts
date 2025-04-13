import { Component, OnInit } from '@angular/core';
import { Compra } from '../../interfaces/compra.interface';
import { Pessoa } from '../../interfaces/pessoa.interface';
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

  compraParaEditar!: Compra;

  // Propriedades existentes
  descricao: string = '';
  valor?: number;
  data!: Date;
  qtdparcelas?: number;
  Devedor: Pessoa | null = null;
  filtroBusca: string = '';
  isRecorrente: boolean = false;
  recorrenciaMeses: number = 1;
  dataFinal?: Date;
  tipoBusca: string = 'descricao'; // Valor padrão

  // Novas propriedades
  isValorTotal: boolean = true; // Se true, valor é o total da compra; se false, valor é de uma parcela
  isMultiplosDevedores: boolean = false; // Se true, múltiplos devedores
  pessoaSelecionada: boolean[] = []; // Array para controlar checkboxes dos devedores
  pessoaProporcao: number[] = []; // Array para controlar proporção de cada devedor
  totalProporcao: number = 0; // Soma das proporções

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
      this.compras.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
    })
  }

  getPessoas(){
    this.pessoaService.getPessoas().subscribe((pessoas)=>{
      this.pessoas = pessoas;
      // Inicializa arrays de controle com o tamanho correto
      this.pessoaSelecionada = new Array(pessoas.length).fill(false);
      this.pessoaProporcao = new Array(pessoas.length).fill(0);
    })
  }

  atualizarOpcoesDivisao() {
    if (!this.isMultiplosDevedores) {
      // Resetar opções de múltiplos devedores
      this.pessoaSelecionada = new Array(this.pessoas.length).fill(false);
      this.pessoaProporcao = new Array(this.pessoas.length).fill(0);
      this.totalProporcao = 0;
    } else {
      // Resetar devedor único
      this.Devedor = null;
    }
  }

  atualizarValoresDivisao() {
    // Calcular o total das proporções
    this.totalProporcao = 0;
    for (let i = 0; i < this.pessoas.length; i++) {
      if (this.pessoaSelecionada[i]) {
        this.totalProporcao += this.pessoaProporcao[i] || 0;
      } else {
        this.pessoaProporcao[i] = 0;
      }
    }
    
    // Arredondar para evitar problemas de ponto flutuante
    this.totalProporcao = parseFloat(this.totalProporcao.toFixed(2));
  }

  editCompra(){
    if(!this.compraParaEditar || !this.compraParaEditar.id){
      this.alertaService.erro("Compra não encontrada");
      return;
    }

    this.compraParaEditar = {
      id: this.compraParaEditar.id,
      descricao: this.descricao,
      valor: this.valor!,
      data: this.data,
      qtdParcelas: this.qtdparcelas!,
      devedor: this.Devedor!,
      idDevedor: this.Devedor?.id
    }

    this.compraService.editCompra(this.compraParaEditar).subscribe(()=>{
      this.alertaService.sucesso("Compra atualizada com sucesso");
      this.getCompras();
      this.limparModal();
    })
  }

  async deleteCompra(){
    if(!this.compraParaEditar || !this.compraParaEditar.id){
      this.alertaService.erro("Compra não encontrada");
      return;
    }

    const confirmar = await this.alertaService.confirmar("Tem certeza que deseja excluir a compra selecionada?");
    if(confirmar){
      const id = this.compraParaEditar.id;

      this.compraService.deleteCompra(id).subscribe(()=>{
      this.alertaService.sucesso("Compra excluída com sucesso");
      this.getCompras();
      this.limparModal();
    })
    }
  }

  abrirModal(compraSelecionada: Compra){
    this.compraParaEditar = {...compraSelecionada};
    
    this.descricao = compraSelecionada.descricao;
    this.valor = compraSelecionada.valor;
    this.data = compraSelecionada.data;
    this.qtdparcelas = compraSelecionada.qtdParcelas;
    this.Devedor = this.pessoas.find(pessoa => pessoa.id === compraSelecionada.devedor?.id) ?? null;
    
    // Resetar opções de múltiplos devedores ao editar
    this.isMultiplosDevedores = false;
    this.isValorTotal = true;
    this.pessoaSelecionada = new Array(this.pessoas.length).fill(false);
    this.pessoaProporcao = new Array(this.pessoas.length).fill(0);
    this.totalProporcao = 0;

    const btnSalvar = document.getElementById('btnSalvar') as HTMLButtonElement;
    const btnAtualizar = document.getElementById('btnAtualizar') as HTMLButtonElement;
    const btnExcluir = document.getElementById('btnExcluir') as HTMLButtonElement;

    btnSalvar.style.display = 'none';
    btnAtualizar.style.display = 'inline-block';
    btnExcluir.style.display = 'inline-block';
  }

  limparModal(){
    this.descricao = '';
    delete this.valor;
    this.data = '' as any;
    delete this.qtdparcelas;
    this.Devedor = null;
    
    // Resetar novas propriedades
    this.isValorTotal = true;
    this.isMultiplosDevedores = false;
    this.pessoaSelecionada = new Array(this.pessoas.length).fill(false);
    this.pessoaProporcao = new Array(this.pessoas.length).fill(0);
    this.totalProporcao = 0;

    const btnSalvar = document.getElementById('btnSalvar') as HTMLButtonElement;
    const btnAtualizar = document.getElementById('btnAtualizar') as HTMLButtonElement;
    const btnExcluir = document.getElementById('btnExcluir') as HTMLButtonElement;

    btnSalvar.style.display = 'block';
    btnAtualizar.style.display = 'none';
    btnExcluir.style.display = 'none';

    this.isRecorrente = false;
    this.recorrenciaMeses = 1;
    delete this.dataFinal;
  }

  adicionarCompraUnicoDevedor() {
    if (!this.Devedor) return;

    // Determinar valor correto baseado na opção selecionada
    let valorTotal = this.isValorTotal ? this.valor! : this.valor! * this.qtdparcelas!;

    const novaCompra = {
      descricao: this.descricao,
      valor: valorTotal,
      data: this.data,
      qtdParcelas: this.qtdparcelas!,
      idDevedor: this.Devedor.id,
      devedor: this.Devedor
    };

    this.compraService.addCompra(novaCompra).subscribe((compra) => {
      this.compras.push(compra);
      this.criarParcelas(compra, this.Devedor!);
      this.alertaService.sucesso("Compra cadastrada com sucesso!");
      this.getCompras();
      this.limparModal();
    });
  }

adicionarCompraMultiplosDevedores() {
  // Calcular valor total da compra
  let valorTotal = this.isValorTotal ? this.valor! : this.valor! * this.qtdparcelas!;
  let comprasAdicionadas = 0;
  let totalDevedores = this.pessoaSelecionada.filter(selecionado => selecionado).length;
  
  // Para cada devedor selecionado, criar uma compra proporcional
  for (let i = 0; i < this.pessoas.length; i++) {
    if (this.pessoaSelecionada[i]) {
      const devedor = this.pessoas[i];
      const proporcao = this.pessoaProporcao[i] / 100;
      const valorDevedor = parseFloat((valorTotal * proporcao).toFixed(2));
      
      // Criar uma compra para este devedor
      const compraDevedor = {
        descricao: this.descricao,
        valor: valorDevedor,
        data: this.data,
        qtdParcelas: this.qtdparcelas!,
        idDevedor: devedor.id,
        devedor: devedor
      };
      
      this.compraService.addCompra(compraDevedor).subscribe((compra) => {
        // Criar parcelas normais para esta compra específica
        const valorParcela = valorDevedor / compra.qtdParcelas;
        const datainicial = new Date(this.data);
        
        for (let j = 0; j < compra.qtdParcelas; j++) {
          const vencimento = new Date(datainicial);
          vencimento.setMonth(vencimento.getMonth() + j + 1);
          vencimento.setDate(10);

          const parcela: Parcela = {
            valor: parseFloat(valorParcela.toFixed(2)),
            dataVencimento: vencimento,
            parcela: j + 1,
            idCompra: compra.id!,
            idDevedor: devedor.id
          };

          this.parcelaService.addParcela(compra.id!, parcela).subscribe(() => {
            console.log(`Parcela ${j + 1} adicionada para ${devedor.nome}`);
          });
        }
        
        comprasAdicionadas++;
        if (comprasAdicionadas === totalDevedores) {
          this.alertaService.sucesso("Compra compartilhada cadastrada com sucesso!");
          this.getCompras();
          this.limparModal();
        }
      });
    }
  }
}

  criarParcelas(compra: Compra, devedor: Pessoa) {
    const datainicial = new Date(this.data);
    const valorParcela = this.isValorTotal ? 
      compra.valor / compra.qtdParcelas : 
      this.valor!;
    
    for (let i = 0; i < compra.qtdParcelas; i++) {
      const vencimento = new Date(datainicial);
      vencimento.setMonth(vencimento.getMonth() + i + 1);
      vencimento.setDate(10);

      const parcela: Parcela = {
        valor: parseFloat(valorParcela.toFixed(2)),
        dataVencimento: vencimento,
        parcela: i + 1,
        idCompra: compra.id!,
        idDevedor: devedor.id // Associa a parcela ao devedor
      };

      this.parcelaService.addParcela(compra.id!, parcela).subscribe(() => {
        console.log(`Parcela ${i + 1} adicionada para ${devedor.nome}`);
      });
    }
  }

  criarParcelasProporcionais(compra: Compra, devedor: Pessoa, valorTotal: number) {
    const datainicial = new Date(this.data);
    const valorParcela = valorTotal / compra.qtdParcelas;
    
    for (let i = 0; i < compra.qtdParcelas; i++) {
      const vencimento = new Date(datainicial);
      vencimento.setMonth(vencimento.getMonth() + i + 1);
      vencimento.setDate(10);

      const parcela: Parcela = {
        valor: parseFloat(valorParcela.toFixed(2)),
        dataVencimento: vencimento,
        parcela: i + 1,
        idCompra: compra.id!,
        idDevedor: devedor.id // Associa a parcela ao devedor específico
      };

      this.parcelaService.addParcela(compra.id!, parcela).subscribe(() => {
        console.log(`Parcela ${i + 1} adicionada para ${devedor.nome}`);
      });
    }
  }

  get comprasFiltradas() {
    if (!this.filtroBusca || this.filtroBusca.trim() === '') {
      return this.compras;
    }
    
    const busca = this.filtroBusca.toLowerCase().trim();
    
    return this.compras.filter(c => {
      // Busca por descrição
      if (this.tipoBusca === 'descricao') {
        return c.descricao.toLowerCase().includes(busca);
      } 
      // Busca por devedor
      else if (this.tipoBusca === 'devedor') {
        return c.devedor?.nome?.toLowerCase().includes(busca);
      } 
      // Busca em ambos (todos)
      else {
        return c.descricao.toLowerCase().includes(busca) || 
               c.devedor?.nome?.toLowerCase().includes(busca);
      }
    });
  }
  
  // Adicione esta função para criar compras recorrentes
criarComprasRecorrentes() {
  if (!this.dataFinal) {
    this.alertaService.erro("Por favor, defina uma data final para a recorrência");
    return;
  }

  // Data inicial e final
  const dataInicial = new Date(this.data);
  const dataFim = new Date(this.dataFinal);
  
  if (dataFim <= dataInicial) {
    this.alertaService.erro("A data final deve ser posterior à data inicial");
    return;
  }

  // Lista para armazenar as compras criadas
  const comprasCriadas: Compra[] = [];
  let contadorCompras = 0;
  
  // Calcular quantas compras precisamos criar
  const mesesDiferenca = (dataFim.getFullYear() - dataInicial.getFullYear()) * 12 + 
                         dataFim.getMonth() - dataInicial.getMonth();
  const totalCompras = Math.floor(mesesDiferenca / this.recorrenciaMeses) + 1;
  
  // Para cada período de recorrência
  for (let i = 0; i < totalCompras; i++) {
    const dataCompra = new Date(dataInicial);
    dataCompra.setMonth(dataInicial.getMonth() + (i * this.recorrenciaMeses));
    
    // Se ultrapassar a data final, pare
    if (dataCompra > dataFim) break;
    
    // Se for único devedor
    if (!this.isMultiplosDevedores && this.Devedor) {
      this.criarCompraRecorrenteUnicoDevedor(dataCompra, i, totalCompras);
    } 
    // Se for múltiplos devedores
    else if (this.isMultiplosDevedores) {
      this.criarCompraRecorrenteMultiplosDevedores(dataCompra, i, totalCompras);
    }
  }
}

// Método para criar compra recorrente para único devedor
criarCompraRecorrenteUnicoDevedor(dataCompra: Date, indice: number, total: number) {
  if (!this.Devedor) return;
  
  let valorTotal = this.isValorTotal ? this.valor! : this.valor! * this.qtdparcelas!;

  const compraRecorrente = {
    descricao: this.descricao,
    valor: valorTotal,
    data: dataCompra,
    qtdParcelas: this.qtdparcelas!,
    idDevedor: this.Devedor.id,
    devedor: this.Devedor
  };

  this.compraService.addCompra(compraRecorrente).subscribe((compra) => {
    // Criar parcelas
    const datainicial = new Date(dataCompra);
    const valorParcela = this.isValorTotal ? 
      compra.valor / compra.qtdParcelas : this.valor!;
    
    for (let j = 0; j < compra.qtdParcelas; j++) {
      const vencimento = new Date(datainicial);
      vencimento.setMonth(vencimento.getMonth() + j + 1);
      vencimento.setDate(10);

      const parcela: Parcela = {
        valor: parseFloat(valorParcela.toFixed(2)),
        dataVencimento: vencimento,
        parcela: j + 1,
        idCompra: compra.id!,
        idDevedor: this.Devedor!.id
      };

      this.parcelaService.addParcela(compra.id!, parcela).subscribe();
    }
    
    if (indice === total - 1) {
      this.alertaService.sucesso(`${total} compras recorrentes cadastradas com sucesso!`);
      this.getCompras();
      this.limparModal();
    }
  });
}

// Método para criar compra recorrente para múltiplos devedores
criarCompraRecorrenteMultiplosDevedores(dataCompra: Date, indice: number, total: number) {
  let valorTotal = this.isValorTotal ? this.valor! : this.valor! * this.qtdparcelas!;
  let comprasAdicionadas = 0;
  let totalDevedores = this.pessoaSelecionada.filter(selecionado => selecionado).length;
  
  for (let i = 0; i < this.pessoas.length; i++) {
    if (this.pessoaSelecionada[i]) {
      const devedor = this.pessoas[i];
      const proporcao = this.pessoaProporcao[i] / 100;
      const valorDevedor = parseFloat((valorTotal * proporcao).toFixed(2));
      
      const compraDevedor = {
        descricao: this.descricao,
        valor: valorDevedor,
        data: dataCompra,
        qtdParcelas: this.qtdparcelas!,
        idDevedor: devedor.id,
        devedor: devedor
      };
      
      this.compraService.addCompra(compraDevedor).subscribe((compra) => {
        const valorParcela = valorDevedor / compra.qtdParcelas;
        const datainicial = new Date(dataCompra);
        
        for (let j = 0; j < compra.qtdParcelas; j++) {
          const vencimento = new Date(datainicial);
          vencimento.setMonth(vencimento.getMonth() + j + 1);
          vencimento.setDate(10);

          const parcela: Parcela = {
            valor: parseFloat(valorParcela.toFixed(2)),
            dataVencimento: vencimento,
            parcela: j + 1,
            idCompra: compra.id!,
            idDevedor: devedor.id
          };

          this.parcelaService.addParcela(compra.id!, parcela).subscribe();
        }
        
        comprasAdicionadas++;
        // Se for a última compra do último mês
        if (indice === total - 1 && comprasAdicionadas === totalDevedores) {
          this.alertaService.sucesso(`${total * totalDevedores} compras recorrentes cadastradas com sucesso!`);
          this.getCompras();
          this.limparModal();
        }
      });
    }
  }
}

// Modifique o método addCompra() para verificar se é recorrente
addCompra() {
  // Validações básicas
  if(this.descricao === null || this.valor === null || this.data === null || this.qtdparcelas === null) {
    this.alertaService.erro("Preencha todos os campos");
    return;
  }

  // Verificações específicas para cada modo
  if (!this.isMultiplosDevedores && !this.Devedor) {
    this.alertaService.erro("Selecione um devedor");
    return;
  }

  if (this.isMultiplosDevedores && this.totalProporcao !== 100) {
    this.alertaService.erro("A soma das proporções deve ser 100%");
    return;
  }
  
  // Se for compra recorrente
  if (this.isRecorrente) {
    if (!this.dataFinal) {
      this.alertaService.erro("Defina uma data final para a recorrência");
      return;
    }
    this.criarComprasRecorrentes();
  } 
  // Se não for recorrente
  else {
    if (!this.isMultiplosDevedores && this.Devedor) {
      this.adicionarCompraUnicoDevedor();
    } else if (this.isMultiplosDevedores) {
      this.adicionarCompraMultiplosDevedores();
    }
  }
}
}
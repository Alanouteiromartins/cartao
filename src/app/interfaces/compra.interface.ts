import { Parcela } from "./parcela.interface";
import { Pessoa } from "./pessoa.interface.";

export interface Compra {
    id?: string;
    descricao: string;
    valor: number;
    data: Date;
    qtdParcelas: number;
    idDevedor?: string;
    devedor?: Pessoa;
    parcelas?: Parcela[];
  }
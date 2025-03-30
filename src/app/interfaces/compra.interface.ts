import { Pessoa } from "./pessoa.interface.";

export interface Compra {
    id?: string;
    descricao: string;
    valor?: number;
    data?: Date;
    parcelas?: number;
    devedor?: Pessoa;
  }
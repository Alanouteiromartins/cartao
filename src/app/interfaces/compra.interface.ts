import { Pessoa } from "./pessoa.interface.";

export interface Compra {
    descricao: string;
    valor?: number;
    data?: Date;
    parcelas?: number;
    devedor?: Pessoa;
  }
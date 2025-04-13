export interface Parcela {
    valor: number;
    dataVencimento: Date;
    parcela: number,
    idCompra: string,
    idDevedor?: string;
    id?: string
    descricaoCompra?: string;
}

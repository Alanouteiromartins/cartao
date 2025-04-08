export interface Parcela {
    valor: number;
    dataVencimento: Date;
    parcela: number,
    idCompra: string,
    id?: string
    descricaoCompra?: string;
}

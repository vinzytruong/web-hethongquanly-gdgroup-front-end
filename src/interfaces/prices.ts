export interface Prices
 {
    priceId: number,
    priceCode: string,
    priceName: string,
}
export const prices: Prices[] = [
    { priceId: 1, priceCode: 'giaDaiLy',priceName:'Giá đại lý' },
    { priceId: 2, priceCode: 'giaTTR',priceName:'Giá TTR' },
    { priceId: 3, priceCode: 'giaTH_TT',priceName:'Giá TH_TT' },
    { priceId: 4, priceCode: 'giaCDT',priceName:'Giá CĐT' },
];

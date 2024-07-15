export interface CostWork {
    id: number,
    hangMuc: string,
    soLuong: number,
    donGia: number,
    thanhTien: number,
    ghiChu: string,
    loaiChiPhiID: number,
    hangMucChiPhiID: number,
    ngayID: number,
    khcT_LoaiChiPhi: {
        id: number,
        tenLoaiChiPhi: string
    },
    khcT_HangMucChiPhi: {
        id: number,
        tenHangMuc: string
    }
}
export interface CostOtherWork {
    id: number,
    hangMuc: string,
    soLuong: number,
    donGia: number,
    thanhTien: number,
    ghiChu: string,
    ngayID: number,
}
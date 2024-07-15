export interface Work {
    congViecID?: number,
    tenCongViec?: string,
    moTa?: string,
    ngayBatDau: string,
    ngayKetThuc: string,
    uuTienID?: number,
    congTyID?: number,
    phongBanID: number,
    chuVuID: number,
    nguoiThucHienID: number
    tenDoUuTien?: string,
    tenCongTy?: string,
    tenPhongBan?: string,
    tenChucVu?: string,
    nguoiTaoID?: number,
    tenNguoiTao?: string,
    tenNguoiThucHien?: string,
    trangThaiID?: number,
    tenTrangThai?: number,
    thoiGian?: string,
    nhomCongViecID?: string,
    nguoiThucHienTen?: string,
    tenNhomCongViec?: string,
    fileCongViec: CreateWorkFileDto[],
    lichSuCongViec: listLichSuCongViec[],

}
export interface CreateWorkDto {
    congViecDto: Work
    fileCongViecDto: CreateWorkFileDto[]
}
export interface CreateWorkFileDto {
    fileID?: number | null,
    fileName: string,
    fileType: string,
    fileUrl: string,
    loai?: number
}

export interface listLichSuCongViec {
    lsid: number,
    moTa: string,
    trangThaiID: number,
}
export interface User {
    uid?: string | null,
    displayName?: string | null,
    email?: string | null,
    photoURL?: string | null
}
export interface Staff {
    nhanVienID: number,
    tenNhanVien: string,
    gioiTinh: boolean,
    ngaySinh: Date,
    soDienThoai: string,
    email: string,
    trangThai: boolean,
    userID: string,
    user: any,
    fileDinhKem?: any,
    tuongTac?: any,
    lichSuDuToan?: any,
    chucVu: string,
    lsGiaoViec?: any,
    lsThucHienCongViec?: any 
}

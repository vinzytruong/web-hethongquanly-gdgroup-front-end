export interface User {
    uid?: string | null,
    displayName?: string | null,
    email?: string | null,
    photoURL?: string | null
}
export interface Staff {
    nhanVienID: number,
    tenNhanVien: string,
    gioiTinh: any,
    ngaySinh: Date,
    ngayKyHopDong: Date,
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
    lsThucHienCongViec?: any,
    avartar: any,
    role: string[],
    lstChucVuView?: [
        {
            lstChucVu: {
                chucVuID: number,
                tenChucVu: string,
                chiTiet: string,
                phongBanID: number
            },
            lstPhongBan: {
                phongBanID: number,
                tenPhongBan: string,
                chiTiet: string,
                congTyID: number
            },
            lstCongTy: {
                congTyID: number,
                tenCongTy: string,
                maSoThue: string,
                tinhID: number,
                diaChi: string
            }
        }
    ]
}

export interface StaffDetail {
    nhanVienID: number,
    tenNhanVien: string,
    gioiTinh?: any,
    ngaySinh?: string,
    ngayKyHopDong?: string,
    soDienThoai?: string,
    email?: string,
    diaChi?: string,
    lstFile?: [],
    lstChucVuView?: [
        {
            lstChucVu: {
                chucVuID: number,
                tenChucVu: string,
                chiTiet: string,
                phongBanID: number
            },
            lstPhongBan: {
                phongBanID: number,
                tenPhongBan: string,
                chiTiet: string,
                congTyID: number
            },
            lstCongTy: {
                congTyID: number,
                tenCongTy: string,
                maSoThue: string,
                tinhID: number,
                diaChi: string
            }
        }
    ]
}

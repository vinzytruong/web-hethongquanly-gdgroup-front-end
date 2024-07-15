//export const apiPort = 'https://localhost:44382'
// export const apiPort = 'https://testhtqlapi.gdgroup.vn'
export const apiPort = 'https://htqlapi.gdgroup.vn'
// 
//Hannet
export const getCheckinByPlaceIdInTimestamp = "https://partner.hanet.ai/person/getCheckinByPlaceIdInTimestamp"
export const getCheckinByPlaceIdInDay = "https://partner.hanet.ai/person/getCheckinByPlaceIdInDay"
export const getUserInfoByPersonID = "https://partner.hanet.ai/person/getUserInfoByPersonID"
export const getTokenHannet = "https://oauth.hanet.com/token"

// Nguoi dung
export const authDangNhap = apiPort + "/api/NguoiDung/DangNhap"
export const authDangKy = apiPort + "/api/NguoiDung/DangKy"
export const authDoiMatKhau = apiPort + "/api/NguoiDung/DoiMatKhau"
export const datLaiMatKhau = apiPort + "/api/NguoiDung/DatLaiMatKhau"
export const editTenDangNhap = apiPort + "/api/NguoiDung/EditTenDangNhap"
export const deleteNguoiDung = apiPort + "/api/NguoiDung/Delete"
export const khoaNguoiDung = apiPort + "/api/NguoiDung/KhoaNguoiDung"
export const moKhoaNguoiDung = apiPort + "/api/NguoiDung/MoKhoaNguoiDung"

// Nghi phep
export const addNghiPhep = apiPort + "/api/NghiPhep/Add"
export const getAllNghiPhep = apiPort + "/api/NghiPhep/GetAll"
export const deleteNghiPhep = apiPort + "/api/NghiPhep/Delete"
export const capNhatTrangThaiNghiPhep = apiPort + "/api/NghiPhep/CapNhatTrangThai"
export const getAllTrangThaiNghiPhep = apiPort + "/api/NghiPhep/GetTrangThai"
export const getAllLoaiNghiPhep = apiPort + "/api/NghiPhep/GetLoai"
export const getTrangThaiNgayNghiTaiKhoan = apiPort + "/api/NghiPhep/GetByNhanVien"

//Tinh
export const getTinh = apiPort + "/api/Tinh/GetTinh"

//Huyen
export const getHuyenByTinhID = apiPort + "/api/Huyen/GetHuyenByTinhID"
export const getHuyenByID = apiPort + "/api/Huyen/GetHuyenById"

//Xa
export const getXaByHuyenID = apiPort + "/api/Xa/GetXaByHuyenID"
export const getXaByID = apiPort + "/api/Xa/GetXaById"

// Nhan vien
export const getNhanVien = apiPort + "/api/NhanVien/GetNhanVien"
export const getNhanVienChiTiet = apiPort + "/api/NhanVien/GetDetail"
export const getNhanVienByID = apiPort + "/api/NhanVien/GetNhanVienById"
export const getNhanVienChiTietByChucVuID = apiPort + "/api/NhanVien/GetByChucVu"
export const updateNhanVienByID = apiPort + "/api/NhanVien/UpdateNhanVien"
export const deleteNhanVien = apiPort + "/api/NhanVien/DeleteNhanVien"
export const addNhanVienChucVu = apiPort + "/api/NhanVien/ThemChucVu"
export const deleteNhanVienChucVu = apiPort + "/api/NhanVien/XoaChucVu"

//Import file
export const importKhachHang = apiPort + "/api/Import/importKhachHang"
export const importNhaThau = apiPort + "/api/Import/importNhaThau"
export const importDaiLy = apiPort + "/api/Import/importDaiLy"
export const importNhaCungCap = apiPort + "/api/Import/importNhaCungCap"
export const importTacGia = apiPort + "/api/Import/importTacGia"
export const importBaoCaoTiepXuc = apiPort + "/api/Import/importBaoCaoTiepXuc"
export const importDuToan = apiPort + "/api/Import/importDuToan"

//Tac gia
export const getTacGia = apiPort + "/api/TacGia/GetTacGia"
export const addTacGia = apiPort + "/api/TacGia/AddTacGia"
export const updateTacGia = apiPort + "/api/TacGia/UpdateTacGia"
export const deleteTacGia = apiPort + "/api/TacGia/DeleteTacGia"

//Nha thau
export const getNhaThau = apiPort + "/api/NhaThau/getDanhSach"
export const addNhaThau = apiPort + "/api/NhaThau/AddNhaThau"
export const updateNhaThau = apiPort + "/api/NhaThau/UpdateNhaThau"
export const deleteNhaThau = apiPort + "/api/NhaThau/DeleteNhaThau"
export const sendMailContractor = apiPort + "/api/NhaThau/SendMailContractor"

//Loai Nha thau
export const getLoaiNhaThau = apiPort + "/api/LoaiNhaThau/GetAll"

//Dai Ly
export const getDaiLy = apiPort + "/api/DaiLy/GetAll"
export const addDaiLy = apiPort + "/api/DaiLy/Add"
export const updateDaiLy = apiPort + "/api/DaiLy/Update"
export const deleteDaiLy = apiPort + "/api/DaiLy/Delete"

//Loai Dai Ly
export const getLoaiDaiLy = apiPort + "/api/LoaiDaiLy/GetAll"

//Nha cung cap
export const getNhaCungCap = apiPort + "/api/NhaCungCap/GetNhaCungCap"
export const addNhaCungCap = apiPort + "/api/NhaCungCap/AddNhaCungCap"
export const updateNhaCungCap = apiPort + "/api/NhaCungCap/UpdateNhaCungCap"
export const deleteNhaCungCap = apiPort + "/api/NhaCungCap/DeleteNhaCungCap"

//Loai Nha cung cap
export const getLoaiNhaCungCap = apiPort + "/api/LoaiNhaCungCap/GetAll"

//Can bo
export const getCanBo = apiPort + "/api/NSCanBo/GetCanBo"
export const getCanBoByCoQuanID = apiPort + "/api/NSCanBo/GetNSCanBoByCoQuan"
export const addCanBo = apiPort + "/api/NSCanBo/AddCanBo"
export const updateCanBo = apiPort + "/api/NSCanBo/UpdateCanBo"
export const deleteCanBo = apiPort + "/api/NSCanBo/DeleteNSCanBo"

//Co quan
export const getCoQuan = apiPort + "/api/NSCoQuan/GetDanhSach"
export const addCoQuan = apiPort + "/api/NSCoQuan/AddCoQuan"
export const updateCoQuan = apiPort + "/api/NSCoQuan/UpdateCoQuan"
export const deleteCoQuan = apiPort + "/api/NSCoQuan/DeleteCoQuan"
export const getReportCoQuan = apiPort + "/api/NSCoQuan/GetBaoCao"

//Quan ly tuong tac
export const getChiTietQuanLyTuongTac = apiPort + "/api/QuanLyTuongTac/GetDetails"
export const getQuanLyTuongTac = apiPort + "/api/QuanLyTuongTac/GetQuanLyTuongTac"
export const getByCoQuan = apiPort + "/api/QuanLyTuongTac/GetByCoQuan"
export const getByNhanVien = apiPort + "/api/QuanLyTuongTac/GetbyNhanVien"
export const getByBuocThiTruong = apiPort + "/api/QuanLyTuongTac/GetbyBuocThiTruong"
export const addQuanLyTuongTac = apiPort + "/api/QuanLyTuongTac/AddQuanLyTuongTac"
export const updateQuanLyTuongTac = apiPort + "/api/QuanLyTuongTac/UpdateQuanLyTuongTac"
export const deleteQuanLyTuongTac = apiPort + "/api/QuanLyTuongTac/DeleteQuanLyTuongTac"
export const getBuocThiTruong = apiPort + "/api/QuanLyTuongTac/GetBuocThiTruong"
export const getNguonVon = apiPort + "/api/QuanLyTuongTac/GetNguonVon"

//Quan ly tuong tac du toan
export const getChiTietNSDuToan = apiPort + "/api/NSDuToan/GetAll"
export const getNSDuToan = apiPort + "/api/NSDuToan/GetbyCoQuanID"
export const addNSDuToan = apiPort + "/api/NSDuToan/Add"
export const updateNSDuToan = apiPort + "/api/NSDuToan/Update"
export const deleteNSDuToan = apiPort + "/api/NSDuToan/Delete"
export const getBuocThiTruongDuToan = apiPort + "/api/NSDuToan/GetBuocThiTruong"

// Roles
export const getRole = apiPort + "/api/Roles/GetRole"
export const getRoleOfUser = apiPort + "/api/Roles/GetAllRoleOfUser"
export const getUserOfRole = apiPort + "/api/Roles/GetAllUserOfRole"
export const addRoleNhanVien = apiPort + "/api/Roles/AddUserToRole"
export const removeRoleNhanVien = apiPort + "/api/Roles/RemoveUserToRole"

//role tinh
export const addRoleNhanVienToTinh = apiPort + "/api/TinhNhanVien/Add"
export const updateRoleNhanVienToTinh = apiPort + "/api/TinhNhanVien/Update"
export const getRoleProvinceOfUser = apiPort + "/api/TinhNhanVien/GetByNhanVien"
export const removeRoleNhanVienToTinh = apiPort + "/api/TinhNhanVien/Delete"

//Products
export const getProduct = apiPort + "/api/SanPham/GetAll"
export const addProduct = apiPort + "/api/SanPham/Add"
export const updateProduct = apiPort + "/api/SanPham/Update"
export const deleteProduct = apiPort + "/api/SanPham/Delete"

export const getProductListByName = apiPort + "/api/SanPham/GetByTuKhoa"






//ProductTypes
export const getProductType = apiPort + "/api/LoaiSanPham/GetAll"
export const addProductType = apiPort + "/api/LoaiSanPham/Add"
export const updateProductType = apiPort + "/api/LoaiSanPham/Update"
export const deleteProductType = apiPort + "/api/LoaiSanPham/Delete"


//Grades
export const getGrade = apiPort + "/api/KhoiLop/GetKhoiLop"
export const addGrade = apiPort + "/api/KhoiLop/AddKhoiLop"
export const updateGrade = apiPort + "/api/KhoiLop/UpdateKhoiLop"
export const deleteGrade = apiPort + "/api/KhoiLop/DeleteKhoiLop"


//Subjects
export const getSubject = apiPort + "/api/MonHoc/GetMonHoc"
export const addSubject = apiPort + "/api/MonHoc/AddMonHoc"
export const updateSubject = apiPort + "/api/MonHoc/UpdateMonHoc"
export const deleteSubject = apiPort + "/api/MonHoc/DeleteMonHoc"




//ThongTu
export const getCircular = apiPort + "/api/ThongTu/GetListDetails"
export const addCircular = apiPort + "/api/ThongTu/Add"
export const updateCircular = apiPort + "/api/ThongTu/Update"
export const deleteCircular = apiPort + "/api/ThongTu/Delete"
export const addList = apiPort + "/api/ThongTu/AddListSanPham"

export const getProductByThongTuId = apiPort + "/api/SanPham/GetByThongTu"
export const addListSubjects = apiPort + "/api/ThongTu/AddListMonHoc"
export const getListProductByName = apiPort + "/api/ThongTu/FindSanPham"

//Đơn vị tính
export const getUnit = apiPort + "/api/DonViTinh/GetAll"
export const addUnit = apiPort + "/api/DonViTinh/Add"
export const updateUnit = apiPort + "/api/DonViTinh/Update"
export const deleteUnit = apiPort + "/api/DonViTinh/Delete"



// CongTy
export const getCompanys = apiPort + "/api/CongTy/GetAll"
export const getCompany = apiPort + "/api/CongTy/GetById"
export const updateCompanys = apiPort + "/api/CongTy/Update"
export const addCompanys = apiPort + "/api/CongTy/Add"
export const deleteCompanys = apiPort + "/api/CongTy/Delete"

// Phong ban
export const getDepartment = apiPort + "/api/PhongBan/GetAll"
export const getDepartmentById = apiPort + "/api/PhongBan/GetById"
export const getCoQuanByUserRole = apiPort + "/api/KHCT_NoiDung/GetCoQuan"
export const getDepartmentOfCompany = apiPort + "/api/PhongBan/GetByCty"
export const addDepartmentOfCompany = apiPort + "/api/PhongBan/Add"
export const updateDepartmentOfCompany = apiPort + "/api/PhongBan/Update"
export const deleteDepartmentOfCompany = apiPort + "/api/PhongBan/Delete"


// Chuc vu
export const getPosition = apiPort + "/api/ChucVu/GetAll"
export const getPositionOfDepartment = apiPort + "/api/ChucVu/GetByPhongBan"
export const getPositionOfDepartmenById = apiPort + "/api/ChucVu/GetById"
export const addPositionOfDepartment = apiPort + "/api/ChucVu/Add"
export const updatePositionOfDepartment = apiPort + "/api/ChucVu/Update"
export const deletePositionOfCompany = apiPort + "/api/ChucVu/Delete"

//Cong Viec
export const getCongViec = apiPort + "/api/CongViec/GetDanhSach"
export const getCongViecDuocGiao = apiPort + "/api/CongViec/GetDSNhanViec"
export const getCongViecGiao = apiPort + "/api/CongViec/GetDSGiaoViec"
export const addCongViec = apiPort + "/api/CongViec/Add"
export const updateCongViec = apiPort + "/api/CongViec/Update"
export const deleteCongViec = apiPort + "/api/CongViec/Delete"

// Ke hoach thang
export const getKeHoachThang = apiPort + "/api/KHCT_Thang/GetAll"
export const addKeHoachThang = apiPort + "/api/KHCT_Thang/Add"
export const updateKeHoachThang = apiPort + "/api/KHCT_Thang/Update"
export const deleteKeHoachThang = apiPort + "/api/KHCT_Thang/Delete"
export const confirmKeHoachThang = apiPort + "/api/KHCT_Thang/Duyet"

// Ke hoach tuan
export const getKeHoachTuan = apiPort + "/api/KHCT_Tuan/GetAll"
export const addKeHoachTuan = apiPort + "/api/KHCT_Tuan/Add"
export const updateKeHoachTuan = apiPort + "/api/KHCT_Tuan/Update"
export const deleteKeHoachTuan = apiPort + "/api/KHCT_Tuan/Delete"
export const confirmKeHoachTuan = apiPort + "/api/KHCT_Tuan/Duyet"

// Ke hoach ngay
export const getKeHoachNgay = apiPort + "/api/KHCT_Ngay/GetAll"
export const getTrangThaiDuyetKeHoachNgay = apiPort + "/api/KHCT_Ngay/GetTrangThai"
export const getKeHoachNgayByID = apiPort + "/api/KHCT_Ngay/GetDetailsById"
export const getHangMucKeHoachNgay = apiPort + "/api/KHCT_ChiPhi/GetDsHangMuc"
export const addKeHoachNgay = apiPort + "/api/KHCT_Ngay/Add"
export const updateKeHoachNgay = apiPort + "/api/KHCT_Ngay/Update"
export const deleteKeHoachNgay = apiPort + "/api/KHCT_Ngay/Delete"
export const confirmKeHoachNgay = apiPort + "/api/KHCT_Ngay/TrangThai"

export const addNguoiDiCungKeHoachNgay = apiPort + "/api/KHCT_NguoiDiCung/Add"
export const addNoiDungKeHoachNgay = apiPort + "/api/KHCT_NoiDung/Add"
export const addChiPhiKeHoachNgay = apiPort + "/api/KHCT_ChiPhi/Add"
export const addChiPhiKhacKeHoachNgay = apiPort + "/api/KHCT_ChiPhiKhac/Add"
export const addXeKeHoachNgay = apiPort + "/api/KHCT_Xe/Add"




//Dự toán
export const getEstimate = apiPort + "/api/DuToan/GetDanhSach"
export const addEstimate = apiPort + "/api/DuToan"
export const updateEtsmate = apiPort + "/api/DuToan/Update"
export const deleteEstimate = apiPort + "/api/DuToan/Delete"
export const getStatusEstimate = apiPort + "/api/DuToan/GetDsTrangThai"

export const changeStatusEstimate = apiPort + "/api/DuToan/TrangThai"




//CongtyDuToan

export const getCompanyEstimate = apiPort + "/api/CtyDuToan/GetAll"
export const addCompanyEstimate = apiPort + "/api/CtyDuToan/Add"
export const updateCompanyEstimate = apiPort + "/api/CtyDuToan/Update"
export const deleteCompanyEstimate = apiPort + "/api/CtyDuToan/Delete"



//NT_GiaTriCoHoi

export const getContractorInteraction = apiPort + "/api/NT_GiaTriCoHoi/GetDetails"
export const addContractorInteraction = apiPort + "/api/NT_GiaTriCoHoi/Add"
export const updateContractorInteraction = apiPort + "/api/NT_GiaTriCoHoi/Update"
export const deleteContractorInteraction = apiPort + "/api/NT_GiaTriCoHoi/Delete"

export const getAllNguonVon = apiPort + "/api/NhaThau/GetDsNguonVon"

export const getAllThe = apiPort + "/api/NhaThau/GetDsThe"

export const getAllContractorInteractionsByContractor = apiPort + "/api/NT_GiaTriCoHoi/GetByNhaThau"
export const getAllStaffsInContractorInteraction = apiPort + "/api/NT_GiaTriCoHoi/GetNhanVien"


//Địa bàn hoạt động

export const getAllAreaOfOperation = apiPort + "/api/NhaThau/GetDsDiaBan"

//Loại hợp tac
export const getAllTypeOfCooperation = apiPort + "/api/NhaThau/GetDsLoaiHopTac"
//Nhà thầu dự toán 
export const getAllNhaThauDuToanStatus = apiPort + "/api/NT_DuToan/GetTrangThai"

export const getAllNhaThauDuToan = apiPort + "/api/NT_DuToan/GetAll"

export const addContractorEstimate = apiPort + "/api/NT_DuToan/Add"
export const deleteContractorEstimate = apiPort + "/api/NT_DuToan/Delete"

export const getAllNhaThauDuToanByNhaThau = apiPort + "/api/NT_DuToan/GetbyNhaThauID"


//contractorEstimate
export const updateContractorEstimate = apiPort + "/api/NT_DuToan/Update"

export const getAllContractorEstimates = apiPort + "/api/NT_DuToan/GetAll"

//assignment

export const getAllStatusAssignments = apiPort + "/api/TrangThaiCongViec/GetAll"

export const updateProgress = apiPort + "/api/CongViec/UpdateProgress"

export const deleteProgress = apiPort + "/api/CongViec/DeleteLichSu"
//


export const getAllTypeOfWorks = apiPort + "/api/NhomCongViec/GetAll"


export const getAllStaffs = apiPort + "/api/NhanVien/GetNhanVien"

export const addMultipleStaffToManageStaff = apiPort + "/api/QuanLyNhanVien/AddMulti"

export const gellAllStaffbyManageStaff = apiPort + "/api/QuanLyNhanVien/GetNhanVien"


//confignotification
export const addConfigNotification = apiPort + "/api/ThongBaoCauHinh/Add"
export const updateConfigNotification = apiPort + "/api/ThongBaoCauHinh/Update"
export const gellAllConfigNotification = apiPort + "/api/ThongBaoCauHinh/GetAll"
export const deleteConfigNotification = apiPort + "/api/ThongBaoCauHinh/Delete"
export const changeStatusConfigNotification = apiPort + "/api/ThongBaoCauHinh/changeActive"




export const addMultiStaffsInGroupTelegram = apiPort + "/api/ThongBaoNhanVien/AddMulti"
export const getStaffsByGroupTelegram = apiPort + "/api/ThongBaoNhanVien/GetNhanVien"


export const sendCodeTelegram = apiPort + "/api/Telegram/SetCode"

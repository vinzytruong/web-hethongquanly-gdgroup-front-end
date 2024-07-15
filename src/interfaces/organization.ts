import { District } from "./district";
import { Officers } from "./officers";
import { Province } from "./province";

export interface Organization{
    coQuanID: number,
    tenCoQuan: string,
    maSoThue: string,
    huyenID: number,
    tinhID: number,
    diaChi: string,
    xaID:number,
    nhanVienID:number,
    huyen:District,
    tinh:Province,
    nsCanBo: Officers[]
}
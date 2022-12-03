import { StringGradients } from "antd/lib/progress/progress";

export interface ITrackingAndTracing {
  riceTransaction: {
    name: string;
    buyer: string;
    saler: string;
    quantity: number;
    time: string;
  };
  riceSeedTransaction: {
    name: string;
    buyer: string;
    saler: string;
    quantity: number;
    time: string;
  };
}

export interface IHTX {
  id_hoptacxa: number;
  thumbnail: string | null;
  phone_number: string;
  address: string;
  description: string;
  active: number;
  name_hoptacxa: string;
}

export interface ILoHang {
  id_giaodichmuaban_lua: number;
  name_lohang: string;
  name_xavien: string;
  name_thuonglai: string;
  img_lohang: string | null;
  soluong: number;
  price: number;
  updated_at: string;
}

export interface ILichMuaVu {
  id_lichmuavu: number;
  name_lichmuavu: string;
  date_start: string;
  date_end: string;
  name_gionglua: string;
}

export interface IVatTu {
  id_vattusudung: number;
  id_nhatkydongruong: number;
  id_giaodichmuaban_vattu: number;
  soluong: number;
  timeuse: string;
  created_at: string;
  updated_at: string;
  name_category_vattu: string;
}

export interface IProduct {
  name_lohang: string;
  img_lohang: string | null;
  name_gionglua: string;
  name_hoptacxa: string;
  name_thuonglai: string;
  name_xavien: string;
  price: number;
  soluong: number;
  description_giaodich: string;
  updated_at: string;
  hoatdongnhatky?: IHoatDongNhatKy[]
}

export interface IGiongLua {
  updated_at: string;
  name_gionglua: string;
  soluong: number;
  price: number;
  description_giaodich: string;
  name_xavien: string;
  nhacungcapvattu_name: string;
}

export interface IHoatDongNhatKy {
  id_nhatkydongruong: number;
  id_thuadat: number;
  address: string;
  name_hoatdong: string;
  date_start: string;
  date_end: string;
  vattusudung: IVatTu[];
}

export interface ITruyXuatNguonGoc {
  giaodichmubanlua: IProduct,
  giaodichmubanluagiong: IGiongLua
}

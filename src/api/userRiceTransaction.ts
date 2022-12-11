import { ListParams } from "../model";
import axiosClient from "./axiosClient";

const userRiceTransactionApi = {
  getAll(params: ListParams) {
    const url = "giaodichmuabanlua/get-list";
    return axiosClient.get(url, { params });
  },

  getAllChairman(params: ListParams) {
    const url = "giaodichmuabanlua/get-list/all";
    return axiosClient.get(url, { params });
  },

  getDetail(id: string | number | undefined) {
    const url = `giaodichmuabanlua/get-detail/${id}`;
    return axiosClient.get(url);
  },

  update(data: any, id: string | number) {
    const url = `giaodichmuabanlua/update/${id}`;
    return axiosClient.post(url, data);
  },

  confirm(id: any) {
    const url = `giaodichmuabanlua/confirm/${id}`;
    return axiosClient.put(url);
  },

  approve(data: any, id: any) {
    const url = `giaodichmuabanlua/approve/${id}`;
    return axiosClient.put(url, data);
  },
};

export default userRiceTransactionApi;

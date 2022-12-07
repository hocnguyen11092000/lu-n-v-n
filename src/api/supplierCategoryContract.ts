import { ListParams } from "../model";
import axiosClient from "./axiosClient";

const supplierCategoryContractApi = {
  getAll(params: ListParams) {
    const url = "giaodichmuabanvattu/get-list";
    return axiosClient.get(url, { params });
  },

  getAllChairman(params: ListParams) {
    const url = "giaodichmuabanvattu/get-list/all";
    return axiosClient.get(url, { params });
  },

  searchUser(data: any) {
    const url = "xavien/search-by-phone-number";
    return axiosClient.post(url, data);
  },

  create(data: any) {
    const url = "giaodichmuabanvattu/create";
    return axiosClient.post(url, data);
  },

  update(data: any, id: string | number) {
    const url = `giaodichmuabanvattu/update/${id}`;
    return axiosClient.post(url, data);
  },

  getDetail(id: string | number) {
    const url = `giaodichmuabanvattu/get-detail/${id}`;
    return axiosClient.get(url);
  },

  confirm(id: string | number) {
    const url = `giaodichmuabanvattu/confirm/${id}`;
    return axiosClient.put(url);
  },

  approve(data: any, id: string | number) {
    const url = `giaodichmuabanvattu/approve/${id}`;
    return axiosClient.put(url, data);
  },
};

export default supplierCategoryContractApi;

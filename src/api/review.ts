import { ListParams } from "./../model/common";
import axiosClient from "./axiosClient";

const reviewApi = {
  getAll(params: ListParams) {
    const url = "danhgiacuoimua/get-list";
    return axiosClient.get(url, { params });
  },

  getDetail(id: any) {
    const url = `danhgiacuoimua/get-detail/${id}`;
    return axiosClient.get(url);
  },

  create(data: any) {
    const url = "danhgiacuoimua/create";
    return axiosClient.post(url, data);
  },

  update(data: any, id: any) {
    const url = `danhgiacuoimua/update/${id}`;
    return axiosClient.post(url, data);
  },

  delete(id: any) {
    const url = `danhgiacuoimua/delete/${id}`;
    return axiosClient.delete(url);
  },
};

export default reviewApi;

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
};

export default reviewApi;

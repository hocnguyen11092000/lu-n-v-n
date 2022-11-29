import { ListParams } from "./../model/common";
import axiosClient from "./axiosClient";

const tracingApi = {
  getAll(params: any) {
    const url = `/auto-complete/blockchain/search-htx`;
    return axiosClient.get(url, {
      params
    });
  },
  
  getLichMuaVu(id_htx: string, params: any) {
    const url = `/auto-complete/blockchain/search-lmv/${id_htx}`;
    return axiosClient.get(url, {
      params
    });
  },

  getLohang(id: string, params: any) {
    const url = `/auto-complete/blockchain/get-list-lohang/${id}`;
    return axiosClient.get(url, {
      params
    });
  }
};

export default tracingApi;

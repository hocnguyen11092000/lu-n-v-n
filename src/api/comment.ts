import { ListParams } from "./../model/common";
import axiosClient from "./axiosClient";

const commentApi = {
  create(data: any) {
    const url = "comment/create";
    return axiosClient.post(url, data);
  },

  delete(id: any) {
    const url = `comment/delete/${id}`;
    return axiosClient.delete(url);
  },
};

export default commentApi;

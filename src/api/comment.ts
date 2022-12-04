import { ListParams } from "./../model/common";
import axiosClient from "./axiosClient";

const commentApi = {
  create(data: any) {
    const url = "comment/create";
    return axiosClient.post(url, data);
  },
};

export default commentApi;

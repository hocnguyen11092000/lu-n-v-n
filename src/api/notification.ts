import { ListParams } from "./../model/common";
import axiosClient from "./axiosClient";

const notificationApi = {
  getAll(params: ListParams) {
    const url = "notification";
    return axiosClient.get(url, { params });
  },

  readed(id: number | undefined | string) {
    const url = `notification/make-read/${id}`;
    return axiosClient.put(url);
  },
};

export default notificationApi;

import { ListParams } from "./../model/common";
import { ADDNEWUSER } from "./../model/user";
import { ADDHTX } from "../model";
import axiosClient from "./axiosClient";

const htxApi = {
  createHTX(data: ADDHTX) {
    const url = "/htx/create";
    return axiosClient.post(url, data);
  },

  update(data: any) {
    const url = "htx/update";
    return axiosClient.post(url, data);
  },

  searchUser(data: any) {
    const url = "xavien/search-by-phone-number";
    return axiosClient.post(url, data);
  },

  addNewMember(data: ADDNEWUSER) {
    const url = "htx/add-new-member";
    return axiosClient.post(url, data);
  },

  deleteUser(id: number) {
    const url = `htx/delete-member/${id}`;
    return axiosClient.delete(url);
  },

  toggleActive(id: string | number) {
    const url = `htx/update-active/${id}`;
    return axiosClient.put(url);
  },

  getDetail() {
    const url = "htx/get-detail";
    return axiosClient.get(url);
  },

  storyOfUser(params: ListParams) {
    const url = "nhatkydongruong/get-list-all";
    return axiosClient.get(url, { params });
  },

  htxConfirm(id: string | number, data: any) {
    const url = `nhatkydongruong/htx-accept/${id}`;
    return axiosClient.put(url, data);
  },
};

export default htxApi;

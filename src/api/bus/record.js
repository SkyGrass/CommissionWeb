import axios from "@/libs/api.request";

export const genBillNo = data => {
  return axios.request({
    url: "bus/bill/genbillno",
    method: "post",
    data
  });
};

export const createRecord = data => {
  return axios.request({
    url: "bus/bill/create",
    method: "post",
    data
  });
};

export const deleteRecord = ids => {
  return axios.request({
    url: "bus/bill/delete/" + ids,
    method: "get"
  });
};

export const getRecordList = data => {
  return axios.request({
    url: "bus/bill/list",
    method: "post",
    data
  });
};


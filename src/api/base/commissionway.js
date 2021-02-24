import axios from "@/libs/api.request";

export const getCommissionWayList = data => {
  return axios.request({
    url: "base/commisionway/list",
    method: "post",
    data
  });
};

export const getCommisionSelectList = data => {
  return axios.request({
    url: "base/commisionway/selectall",
    method: "post",
    data
  });
};

// createCommission
export const createCommissionWay = data => {
  return axios.request({
    url: "base/commisionway/create",
    method: "post",
    data
  });
};

//loadCommission
export const loadCommissionWay = data => {
  return axios.request({
    url: "base/commisionway/edit/" + data.id,
    method: "get"
  });
};

// editCommission
export const editCommissionWay = data => {
  return axios.request({
    url: "base/commisionway/edit",
    method: "post",
    data
  });
};

// delete commisionway
export const deleteCommissionWay = ids => {
  return axios.request({
    url: "base/commisionway/delete/" + ids,
    method: "get"
  });
};

// batch command
export const batchCommand = data => {
  return axios.request({
    url: "base/commisionway/batch",
    method: "get",
    params: data
  });
};

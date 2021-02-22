import axios from "@/libs/api.request";

export const getSoftWareList = data => {
  return axios.request({
    url: "base/software/list",
    method: "post",
    data
  });
};

export const getSoftWareSelectList = data => {
  return axios.request({
    url: "base/software/selectall",
    method: "post",
    data
  });
};

// createSoftWaren
export const createSoftWare = data => {
  return axios.request({
    url: "base/software/create",
    method: "post",
    data
  });
};

//loadSoftWaren
export const loadSoftWare = data => {
  return axios.request({
    url: "base/software/edit/" + data.id,
    method: "get"
  });
};

// editSoftWaren
export const editSoftWare = data => {
  return axios.request({
    url: "base/software/edit",
    method: "post",
    data
  });
};

// delete software
export const deleteSoftWare = ids => {
  return axios.request({
    url: "base/software/delete/" + ids,
    method: "get"
  });
};

// batch command
export const batchCommand = data => {
  return axios.request({
    url: "base/software/batch",
    method: "get",
    params: data
  });
};

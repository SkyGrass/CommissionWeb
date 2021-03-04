import axios from "@/libs/api.request";

export const getCustomList = data => {
  return axios.request({
    url: "base/custom/list",
    method: "post",
    data
  });
};

export const getAllCustom = data => {
  return axios.request({
    url: "base/custom/select",
    method: "post",
    data
  });
};

export const genCode = data => {
  return axios.request({
    url: "base/custom/genCode",
    method: "post",
    data
  });
};

// createCustom
export const createCustom = data => {
  return axios.request({
    url: "base/custom/create",
    method: "post",
    data
  });
};

//loadCustom
export const loadCustom = data => {
  return axios.request({
    url: "base/custom/edit/" + data.id,
    method: "get"
  });
};

// editCustom
export const editCustom = data => {
  return axios.request({
    url: "base/custom/edit",
    method: "post",
    data
  });
};

// delete custom
export const deleteCustom = ids => {
  return axios.request({
    url: "base/custom/delete/" + ids,
    method: "get"
  });
};

// batch command
export const batchCommand = data => {
  return axios.request({
    url: "base/custom/batch",
    method: "get",
    params: data
  });
};

import axios from "@/libs/api.request";

export const getSalesManList = data => {
  return axios.request({
    url: "base/salesman/list",
    method: "post",
    data
  });
};

export const getAllSalesman = data => {
  return axios.request({
    url: "base/salesman/selectall",
    method: "post",
    data
  });
};


export const getSalesManSelectList = data => {
  return axios.request({
    url: "base/salesman/selectbind",
    method: "post",
    data
  });
};

// createSaleMan
export const createSaleMan = data => {
  return axios.request({
    url: "base/salesman/create",
    method: "post",
    data
  });
};

//loadSaleMan
export const loadSaleMan = data => {
  return axios.request({
    url: "base/salesman/edit/" + data.id,
    method: "get"
  });
};

// editSaleMan
export const editSaleMan = data => {
  return axios.request({
    url: "base/salesman/edit",
    method: "post",
    data
  });
};

// delete salesman
export const deleteSaleMan = ids => {
  return axios.request({
    url: "base/salesman/delete/" + ids,
    method: "get"
  });
};

// batch command
export const batchCommand = data => {
  return axios.request({
    url: "base/salesman/batch",
    method: "get",
    params: data
  });
};

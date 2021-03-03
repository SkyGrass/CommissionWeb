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

export const auditRecord = id => {
  return axios.request({
    url: "bus/bill/audit/" + id,
    method: "get"
  });
};

export const unAuditRecord = id => {
  return axios.request({
    url: "bus/bill/unaudit/" + id,
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

export const getRecordChooseList = data => {
  return axios.request({
    url: "bus/bill/calclist",
    method: "post",
    data
  });
};


export const loadRecord = data => {
  return axios.request({
    url: "bus/bill/edit/" + data.id,
    method: "get"
  });
};

export const loadRecordEntry = data => {
  return axios.request({
    url: "bus/bill/editentry/" + data.id,
    method: "get"
  });
};

export const exportData = data => {
  return axios.request({
    url: "bus/bill/exportexcel",
    method: "post",
    data
  });
};
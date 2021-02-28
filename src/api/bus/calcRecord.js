import axios from "@/libs/api.request";

export const genBillNo = data => {
  return axios.request({
    url: "bus/calcbill/genbillno",
    method: "post",
    data
  });
};

export const createRecord = data => {
  return axios.request({
    url: "bus/calcbill/create",
    method: "post",
    data
  });
};

export const deleteCalcRecord = ids => {
  return axios.request({
    url: "bus/calcbill/delete/" + ids,
    method: "get"
  });
};

export const auditCalcRecord = id => {
  return axios.request({
    url: "bus/calcbill/audit/" + id,
    method: "get"
  });
};


export const getCalcRecordList = data => {
  return axios.request({
    url: "bus/calcbill/list",
    method: "post",
    data
  });
};


export const getCalcRecordEntry = ids => {
  return axios.request({
    url: "bus/bill/calclistentry/" + ids,
    method: "get"
  });
};

export const loadRecord = data => {
  return axios.request({
    url: "bus/calcbill/edit/" + data.id,
    method: "get"
  });
};

export const loadRecordEntry = data => {
  return axios.request({
    url: "bus/calcbill/editentry/" + data.id,
    method: "get"
  });
};

export const exportData = data => {
  return axios.request({
    url: "bus/calcbill/exportexcel",
    method: "post",
    data
  });
};


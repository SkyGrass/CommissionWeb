import axios from "@/libs/api.request";

export const getUserSalesmanMappingList = data => {
  return axios.request({
    url: "base/usersalesmanmapping/list",
    method: "post",
    data
  });
};

// delete software
export const deleteUserSalesmanMapping = ids => {
  return axios.request({
    url: "base/usersalesmanmapping/delete/" + ids,
    method: "get"
  });
};

// batch command
export const batchCommand = data => {
  return axios.request({
    url: "base/usersalesmanmapping/batch",
    method: "get",
    params: data
  });
};

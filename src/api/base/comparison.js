import axios from "@/libs/api.request";

export const getComparisonList = data => {
  return axios.request({
    url: "base/comparison/list",
    method: "post",
    data
  });
};

// createComparison
export const createComparison = data => {
  return axios.request({
    url: "base/comparison/create",
    method: "post",
    data
  });
};

//loadComparison
export const loadComparison = data => {
  return axios.request({
    url: "base/comparison/edit/" + data.id,
    method: "get"
  });
};

// editComparison
export const editComparison = data => {
  return axios.request({
    url: "base/comparison/edit",
    method: "post",
    data
  });
};

// delete comparison
export const deleteComparison = ids => {
  return axios.request({
    url: "base/comparison/delete/" + ids,
    method: "get"
  });
};

// batch command
export const batchCommand = data => {
  return axios.request({
    url: "base/comparison/batch",
    method: "get",
    params: data
  });
};

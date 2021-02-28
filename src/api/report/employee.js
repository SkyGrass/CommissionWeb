import axios from "@/libs/api.request";

export const getReportList = data => {
    return axios.request({
        url: "report/report/employeelist",
        method: "post",
        data
    });
};


export const exportData = data => {
    return axios.request({
        url: "report/report/exportexcelforemp",
        method: "post",
        data
    });
};

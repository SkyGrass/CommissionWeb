import axios from "@/libs/api.request";

export const getReportList = data => {
    return axios.request({
        url: "report/report/pointlist",
        method: "post",
        data
    });
};

export const exportData = data => {
    return axios.request({
        url: "report/report/exportexcelforcus",
        method: "post",
        data
    });
};
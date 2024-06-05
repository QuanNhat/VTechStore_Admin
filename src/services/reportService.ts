import axiosClient from "./axiosClient";

const reportService = {
  getDataReport: (dateBegin: string, dateEnd: string): Promise<{ data: any }> => {
    return axiosClient.get(`api/reports/financial?startDate=${dateBegin}&endDate=${dateEnd}`);
  },
};

export default reportService;
